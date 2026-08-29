/* ============================================
   CineVerse — My Bookings Page
   ============================================ */
import './styles/myBookings.css';
import { store } from '../data/store.js';
import { movies } from '../data/mockData.js';
import { showToast } from '../components/Toast.js';
import { showModal, closeModal } from '../components/Modal.js';

export function renderMyBookingsPage() {
    const bookings = store.getUserBookings();

    return `
    <div class="bookings-page">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary-light)" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            My <span class="accent">Bookings</span>
          </h1>
          <p class="page-subtitle text-muted">View and manage your movie ticket bookings</p>
        </div>

        <!-- Tab Filter -->
        <div class="booking-tabs" id="booking-tabs">
          <button class="booking-tab active" data-filter="all">All (${bookings.length})</button>
          <button class="booking-tab" data-filter="confirmed">Confirmed (${bookings.filter(b => b.status === 'confirmed').length})</button>
          <button class="booking-tab" data-filter="cancelled">Cancelled (${bookings.filter(b => b.status === 'cancelled').length})</button>
        </div>

        <!-- Bookings List -->
        <div class="bookings-list" id="bookings-list">
          ${bookings.length === 0 ? renderEmptyBookings() : bookings.map(booking => renderBookingCard(booking)).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderEmptyBookings() {
    return `
    <div class="empty-state">
      <div class="empty-state-icon">🎫</div>
      <h3 class="empty-state-title">No Bookings Yet</h3>
      <p class="empty-state-text">Book your first movie ticket and it will appear here!</p>
      <a href="#/movies" class="btn btn-primary">Browse Movies</a>
    </div>
  `;
}

function renderBookingCard(booking) {
    const movie = movies.find(m => m.id === booking.movieId);
    const ticket = store.getTicketByBookingId(booking.id);
    const isConfirmed = booking.status === 'confirmed';

    return `
    <div class="booking-card glass-card" data-status="${booking.status}" data-booking-id="${booking.id}">
      <div class="booking-card-left">
        ${movie ? `<img src="${movie.posterUrl}" alt="${movie.title}" class="booking-poster" />` : '<div class="booking-poster-placeholder">🎬</div>'}
      </div>
      <div class="booking-card-center">
        <div class="booking-card-header">
          <h3 class="booking-movie-title">${booking.movieTitle}</h3>
          <span class="badge ${isConfirmed ? 'badge-success' : 'badge-error'}">${isConfirmed ? '✓ Confirmed' : '✕ Cancelled'}</span>
        </div>
        <div class="booking-details-row">
          <div class="booking-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${booking.date}</span>
          </div>
          <div class="booking-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${booking.time}</span>
          </div>
          <div class="booking-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${booking.theaterName}</span>
          </div>
        </div>
        <div class="booking-details-row">
          <div class="booking-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/></svg>
            <span>${booking.screenName}</span>
          </div>
          <div class="booking-detail">
            <span class="seat-badge">💺 ${booking.seatLabels.join(', ')}</span>
          </div>
        </div>
        <div class="booking-meta">
          <span class="booking-id">Booking ID: ${booking.id}</span>
          <span>Booked: ${new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      <div class="booking-card-right">
        <div class="booking-amount">₹${booking.totalAmount.toLocaleString()}</div>
        <div class="booking-actions">
          ${isConfirmed ? `
            <a href="#/confirmation/${booking.id}" class="btn btn-secondary btn-sm">View Ticket</a>
            <button class="btn btn-danger btn-sm cancel-booking-btn" data-booking-id="${booking.id}">Cancel</button>
          ` : `
            <span class="text-muted" style="font-size: var(--text-xs);">Cancelled on ${new Date(booking.cancelledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          `}
        </div>
      </div>
    </div>
  `;
}

export function initMyBookingsPage() {
    // Tab filtering
    document.querySelectorAll('.booking-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.booking-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            document.querySelectorAll('.booking-card').forEach(card => {
                if (filter === 'all' || card.dataset.status === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Cancel booking buttons
    document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const bookingId = btn.dataset.bookingId;
            const booking = store.getBookingById(bookingId);
            if (!booking) return;

            showModal({
                title: 'Cancel Booking',
                content: `
          <div style="text-align: center; padding: var(--space-md) 0;">
            <div style="font-size: 3rem; margin-bottom: var(--space-md);">⚠️</div>
            <p style="margin-bottom: var(--space-md);">Are you sure you want to cancel your booking for <strong>${booking.movieTitle}</strong>?</p>
            <p style="font-size: var(--text-sm); color: var(--color-text-muted);">Seats: ${booking.seatLabels.join(', ')} · ${booking.time} · ${booking.date}</p>
            <p style="font-size: var(--text-sm); color: var(--color-warning); margin-top: var(--space-md);">A refund of ₹${booking.totalAmount.toLocaleString()} will be initiated automatically.</p>
          </div>
        `,
                size: 'medium',
                actions: [
                    { id: 'keep', label: 'Keep Booking', className: 'btn-secondary', onClick: () => closeModal() },
                    {
                        id: 'cancel', label: 'Yes, Cancel', className: 'btn-danger', onClick: () => {
                            const result = store.cancelBooking(bookingId);
                            closeModal();
                            if (result) {
                                showToast(`Booking ${bookingId} cancelled. Refund of ₹${booking.totalAmount.toLocaleString()} initiated.`, 'success');
                                // Re-render page
                                setTimeout(() => {
                                    window.location.hash = '#/bookings';
                                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                                }, 500);
                            }
                        },
                    },
                ],
            });
        });
    });
}
