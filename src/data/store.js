/* ============================================
   CineVerse — Global State Store
   ============================================ */
import { currentUser } from './mockData.js';

class Store {
    constructor() {
        this.bookings = this._loadFromStorage('cv_bookings') || [];
        this.payments = this._loadFromStorage('cv_payments') || [];
        this.refunds = this._loadFromStorage('cv_refunds') || [];
        this.digitalTickets = this._loadFromStorage('cv_tickets') || [];
        this.seatHolds = {};        // showtimeId → { seatId: { userId, expiresAt } }
        this.seatMaps = {};         // showtimeId → seats[]
        this.user = currentUser;
        this._listeners = {};
        this._idCounters = {
            booking: this.bookings.length + 1,
            payment: this.payments.length + 1,
            refund: this.refunds.length + 1,
            ticket: this.digitalTickets.length + 1,
        };
    }

    /* ─── Persistence ─── */
    _loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch { return null; }
    }

    _saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch { /* quota exceeded — silent fail */ }
    }

    _persist() {
        this._saveToStorage('cv_bookings', this.bookings);
        this._saveToStorage('cv_payments', this.payments);
        this._saveToStorage('cv_refunds', this.refunds);
        this._saveToStorage('cv_tickets', this.digitalTickets);
    }

    /* ─── Event System ─── */
    on(event, callback) {
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(callback);
        return () => {
            this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
        };
    }

    _emit(event, data) {
        (this._listeners[event] || []).forEach(cb => cb(data));
    }

    /* ─── Seat Management ─── */
    getSeatMap(showtimeId, screenId, generateFn) {
        if (!this.seatMaps[showtimeId]) {
            const seats = generateFn(screenId);
            // Apply existing bookings
            this.bookings
                .filter(b => b.showtimeId === showtimeId && b.status === 'confirmed')
                .forEach(b => {
                    b.seatIds.forEach(seatId => {
                        const seat = seats.find(s => s.id === seatId);
                        if (seat) seat.status = 'booked';
                    });
                });
            this.seatMaps[showtimeId] = seats;
        }
        return this.seatMaps[showtimeId];
    }

    holdSeats(showtimeId, seatIds) {
        if (!this.seatHolds[showtimeId]) this.seatHolds[showtimeId] = {};
        const seats = this.seatMaps[showtimeId] || [];
        const holdExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

        seatIds.forEach(seatId => {
            const seat = seats.find(s => s.id === seatId);
            if (seat && seat.status === 'available') {
                seat.status = 'held';
                this.seatHolds[showtimeId][seatId] = {
                    userId: this.user.id,
                    expiresAt: holdExpiry,
                };
            }
        });
        this._emit('seats:updated', { showtimeId });
        return holdExpiry;
    }

    releaseSeats(showtimeId, seatIds) {
        const seats = this.seatMaps[showtimeId] || [];
        seatIds.forEach(seatId => {
            const seat = seats.find(s => s.id === seatId);
            if (seat && seat.status === 'held') {
                seat.status = 'available';
            }
            if (this.seatHolds[showtimeId]) {
                delete this.seatHolds[showtimeId][seatId];
            }
        });
        this._emit('seats:updated', { showtimeId });
    }

    toggleSeat(showtimeId, seatId) {
        const seats = this.seatMaps[showtimeId] || [];
        const seat = seats.find(s => s.id === seatId);
        if (!seat) return null;

        if (seat.status === 'available') {
            seat.status = 'selected';
            return 'selected';
        } else if (seat.status === 'selected') {
            seat.status = 'available';
            return 'available';
        }
        return null; // booked or held — no toggle
    }

    getSelectedSeats(showtimeId) {
        return (this.seatMaps[showtimeId] || []).filter(s => s.status === 'selected');
    }

    /* ─── Booking ─── */
    createBooking({ movieId, movieTitle, showtimeId, theaterId, theaterName, screenName, date, time, seats, totalAmount }) {
        const bookingId = `BK-${String(this._idCounters.booking++).padStart(5, '0')}`;
        const booking = {
            id: bookingId,
            customerId: this.user.id,
            customerName: this.user.name,
            customerEmail: this.user.email,
            movieId,
            movieTitle,
            showtimeId,
            theaterId,
            theaterName,
            screenName,
            date,
            time,
            seatIds: seats.map(s => s.id),
            seatLabels: seats.map(s => `${s.row}${s.number}`),
            seatCategories: seats.map(s => s.category),
            totalAmount,
            status: 'confirmed',
            bookingDate: new Date().toISOString(),
        };

        this.bookings.unshift(booking);

        // Mark seats as booked
        const seatMap = this.seatMaps[showtimeId] || [];
        seats.forEach(s => {
            const seat = seatMap.find(sm => sm.id === s.id);
            if (seat) seat.status = 'booked';
        });

        // Create payment
        const paymentId = `PAY-${String(this._idCounters.payment++).padStart(5, '0')}`;
        const payment = {
            id: paymentId,
            bookingId,
            amount: totalAmount,
            method: 'Credit Card',
            status: 'success',
            timestamp: new Date().toISOString(),
        };
        this.payments.push(payment);

        // Create digital ticket
        const ticketId = `TKT-${String(this._idCounters.ticket++).padStart(5, '0')}`;
        const ticket = {
            id: ticketId,
            bookingId,
            qrData: JSON.stringify({ ticketId, bookingId, movie: movieTitle, seats: booking.seatLabels, date, time }),
            issueDate: new Date().toISOString(),
            status: 'active',
        };
        this.digitalTickets.push(ticket);

        this._persist();
        this._emit('booking:created', { booking, payment, ticket });
        return { booking, payment, ticket };
    }

    cancelBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking || booking.status !== 'confirmed') return null;

        booking.status = 'cancelled';
        booking.cancelledAt = new Date().toISOString();

        // Release seats
        const seatMap = this.seatMaps[booking.showtimeId] || [];
        booking.seatIds.forEach(seatId => {
            const seat = seatMap.find(s => s.id === seatId);
            if (seat) seat.status = 'available';
        });

        // Update ticket
        const ticket = this.digitalTickets.find(t => t.bookingId === bookingId);
        if (ticket) ticket.status = 'cancelled';

        // Create refund
        const refundId = `RF-${String(this._idCounters.refund++).padStart(5, '0')}`;
        const refund = {
            id: refundId,
            bookingId,
            amount: booking.totalAmount,
            status: 'initiated',
            processedBy: null,
            createdAt: new Date().toISOString(),
        };
        this.refunds.push(refund);

        // Auto-approve refund after short delay  
        setTimeout(() => {
            refund.status = 'approved';
            refund.processedBy = 'System (Auto-Approved)';
            this._persist();
            this._emit('refund:updated', refund);
        }, 1500);

        this._persist();
        this._emit('booking:cancelled', { booking, refund });
        return { booking, refund };
    }

    getBookingById(bookingId) {
        return this.bookings.find(b => b.id === bookingId);
    }

    getTicketByBookingId(bookingId) {
        return this.digitalTickets.find(t => t.bookingId === bookingId);
    }

    getPaymentByBookingId(bookingId) {
        return this.payments.find(p => p.bookingId === bookingId);
    }

    getUserBookings() {
        return this.bookings.filter(b => b.customerId === this.user.id);
    }

    /* ─── Analytics ─── */
    getAnalytics() {
        const confirmed = this.bookings.filter(b => b.status === 'confirmed');
        const cancelled = this.bookings.filter(b => b.status === 'cancelled');
        const totalRevenue = confirmed.reduce((sum, b) => sum + b.totalAmount, 0);
        const refundTotal = this.refunds.filter(r => r.status === 'approved' || r.status === 'processed')
            .reduce((sum, r) => sum + r.amount, 0);

        return {
            totalBookings: this.bookings.length,
            confirmedBookings: confirmed.length,
            cancelledBookings: cancelled.length,
            totalRevenue,
            refundTotal,
            netRevenue: totalRevenue - refundTotal,
            cancellationRate: this.bookings.length ? ((cancelled.length / this.bookings.length) * 100).toFixed(1) : 0,
            bookingsByMovie: this._groupBy(confirmed, 'movieTitle'),
            bookingsByTheater: this._groupBy(confirmed, 'theaterName'),
        };
    }

    _groupBy(arr, key) {
        return arr.reduce((acc, item) => {
            const k = item[key];
            acc[k] = (acc[k] || 0) + 1;
            return acc;
        }, {});
    }

    /* ─── Reset ─── */
    clearAll() {
        this.bookings = [];
        this.payments = [];
        this.refunds = [];
        this.digitalTickets = [];
        this.seatMaps = {};
        this.seatHolds = {};
        this._idCounters = { booking: 1, payment: 1, refund: 1, ticket: 1 };
        localStorage.removeItem('cv_bookings');
        localStorage.removeItem('cv_payments');
        localStorage.removeItem('cv_refunds');
        localStorage.removeItem('cv_tickets');
        this._emit('store:cleared');
    }
}

export const store = new Store();
