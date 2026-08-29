/* ============================================
   CineVerse — Confirmation Page
   ============================================ */
import './styles/confirmation.css';
import { store } from '../data/store.js';
import { movies } from '../data/mockData.js';

export function renderConfirmationPage(bookingId) {
    const booking = store.getBookingById(bookingId);
    const ticket = store.getTicketByBookingId(bookingId);
    const payment = store.getPaymentByBookingId(bookingId);

    if (!booking || !ticket) {
        return `<div class="empty-state"><div class="empty-state-icon">🎫</div><h2 class="empty-state-title">Booking Not Found</h2><a href="#/" class="btn btn-primary">Go Home</a></div>`;
    }

    const movie = movies.find(m => m.id === booking.movieId);

    return `
    <div class="confirmation-page">
      <div class="container">
        <!-- Success Header -->
        <div class="success-header animate-fade-in-up">
          <div class="success-icon-wrap">
            <div class="success-ring"></div>
            <div class="success-check">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <h1 class="success-title">Booking Confirmed!</h1>
          <p class="success-subtitle">Your tickets have been booked successfully. Enjoy the movie! 🎬</p>
        </div>

        <div class="confirmation-layout">
          <!-- Digital Ticket -->
          <div class="ticket-card animate-fade-in-up stagger-1" id="digital-ticket">
            <div class="ticket-header">
              <div class="ticket-logo">
                <span>🎬</span>
                <span class="ticket-brand">CineVerse</span>
              </div>
              <span class="badge badge-success">Confirmed</span>
            </div>

            <div class="ticket-movie-section">
              ${movie ? `<img src="${movie.posterUrl}" alt="${movie.title}" class="ticket-poster" />` : ''}
              <div class="ticket-movie-info">
                <h2 class="ticket-movie-title">${booking.movieTitle}</h2>
                ${movie ? `<p class="ticket-movie-meta">${movie.genre.join(' · ')} · ${movie.language} · ${movie.certification}</p>` : ''}
              </div>
            </div>

            <div class="ticket-details-grid">
              <div class="ticket-detail">
                <span class="detail-label">Date</span>
                <span class="detail-value">${new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div class="ticket-detail">
                <span class="detail-label">Time</span>
                <span class="detail-value">${booking.time}</span>
              </div>
              <div class="ticket-detail">
                <span class="detail-label">Theater</span>
                <span class="detail-value">${booking.theaterName}</span>
              </div>
              <div class="ticket-detail">
                <span class="detail-label">Screen</span>
                <span class="detail-value">${booking.screenName}</span>
              </div>
              <div class="ticket-detail">
                <span class="detail-label">Seats</span>
                <span class="detail-value">${booking.seatLabels.join(', ')}</span>
              </div>
              <div class="ticket-detail">
                <span class="detail-label">Tickets</span>
                <span class="detail-value">${booking.seatLabels.length}</span>
              </div>
            </div>

            <div class="ticket-divider">
              <div class="ticket-notch ticket-notch-left"></div>
              <div class="ticket-dotted"></div>
              <div class="ticket-notch ticket-notch-right"></div>
            </div>

            <div class="ticket-qr-section">
              <div class="qr-container" id="qr-container">
                <div class="spinner" style="width: 24px; height: 24px;"></div>
              </div>
              <div class="ticket-ids">
                <p class="ticket-id">Booking ID: <strong>${booking.id}</strong></p>
                <p class="ticket-id">Ticket ID: <strong>${ticket.id}</strong></p>
              </div>
            </div>

            <div class="ticket-footer">
              <p class="ticket-amount">Total: <strong>₹${booking.totalAmount.toLocaleString()}</strong></p>
              <p class="ticket-instructions">Show this QR code at the theater entrance</p>
            </div>
          </div>

          <!-- Side Info -->
          <div class="confirmation-side animate-fade-in-up stagger-2">
            <!-- Actions -->
            <div class="confirmation-actions glass-card">
              <h3>Your Ticket</h3>
              <div class="action-buttons">
                <button class="btn btn-primary" id="download-ticket-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Ticket
                </button>
                <button class="btn btn-secondary" id="share-ticket-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  Share
                </button>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="payment-info-card glass-card">
              <h3>Payment Details</h3>
              <div class="payment-info-row">
                <span>Payment ID</span>
                <span>${payment?.id || 'N/A'}</span>
              </div>
              <div class="payment-info-row">
                <span>Amount Paid</span>
                <span class="text-accent">₹${booking.totalAmount.toLocaleString()}</span>
              </div>
              <div class="payment-info-row">
                <span>Method</span>
                <span>${payment?.method || 'Card'}</span>
              </div>
              <div class="payment-info-row">
                <span>Status</span>
                <span class="badge badge-success">Success</span>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="quick-links glass-card">
              <a href="#/bookings" class="btn btn-ghost">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                View All Bookings
              </a>
              <a href="#/" class="btn btn-ghost">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function initConfirmationPage(bookingId) {
    const ticket = store.getTicketByBookingId(bookingId);
    if (!ticket) return;

    // Generate QR Code
    const qrContainer = document.getElementById('qr-container');
    if (qrContainer) {
        try {
            const QRCode = await import('qrcode');
            const dataUrl = await QRCode.toDataURL(ticket.qrData, {
                width: 180,
                margin: 2,
                color: { dark: '#1a1a2e', light: '#f0f0f5' },
                errorCorrectionLevel: 'H',
            });
            qrContainer.innerHTML = `<img src="${dataUrl}" alt="QR Code" class="qr-image" />`;
        } catch (err) {
            // Fallback: display a styled placeholder
            qrContainer.innerHTML = `
        <div class="qr-placeholder">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary)" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/>
          </svg>
          <p style="font-size: 10px; color: var(--color-text-muted); margin-top: 8px;">${ticket.id}</p>
        </div>
      `;
        }
    }

    // Download ticket (simulated)
    document.getElementById('download-ticket-btn')?.addEventListener('click', () => {
        const { showToast } = require('../components/Toast.js');
        import('../components/Toast.js').then(({ showToast }) => {
            showToast('Ticket downloaded successfully!', 'success');
        });
    });
}
