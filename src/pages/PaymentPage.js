/* ============================================
   CineVerse — Payment Page
   ============================================ */
import './styles/payment.css';
import { movies, showtimes } from '../data/mockData.js';
import { store } from '../data/store.js';
import { showToast } from '../components/Toast.js';

export function renderPaymentPage(movieId, showtimeId) {
    const movie = movies.find(m => m.id === movieId);
    const showtime = showtimes.find(s => s.id === showtimeId);
    const selected = store.getSelectedSeats(showtimeId);

    if (!movie || !showtime || selected.length === 0) {
        return `<div class="empty-state"><div class="empty-state-icon">💳</div><h2>No Seats Selected</h2><p class="text-muted">Please select seats first.</p><a href="#/movies" class="btn btn-primary">Browse Movies</a></div>`;
    }

    const subtotal = selected.reduce((sum, s) => sum + s.price, 0);
    const convenienceFee = Math.round(subtotal * 0.05);
    const gst = Math.round((subtotal + convenienceFee) * 0.18);
    const total = subtotal + convenienceFee + gst;

    return `
    <div class="payment-page">
      <div class="container">
        <div class="payment-layout">
          <!-- Payment Form -->
          <div class="payment-form-section">
            <h1 class="payment-title">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary-light)" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Payment
            </h1>

            <!-- Payment Methods -->
            <div class="payment-methods">
              <label class="payment-method active" data-method="card">
                <input type="radio" name="payment-method" value="card" checked />
                <div class="method-content">
                  <span class="method-icon">💳</span>
                  <span class="method-name">Credit / Debit Card</span>
                </div>
              </label>
              <label class="payment-method" data-method="upi">
                <input type="radio" name="payment-method" value="upi" />
                <div class="method-content">
                  <span class="method-icon">📱</span>
                  <span class="method-name">UPI</span>
                </div>
              </label>
              <label class="payment-method" data-method="netbanking">
                <input type="radio" name="payment-method" value="netbanking" />
                <div class="method-content">
                  <span class="method-icon">🏦</span>
                  <span class="method-name">Net Banking</span>
                </div>
              </label>
            </div>

            <!-- Card Form -->
            <div class="payment-form glass-card" id="payment-form-card">
              <div class="form-group">
                <label class="form-label">Card Number</label>
                <input type="text" class="form-input" id="card-number" placeholder="4242  4242  4242  4242" maxlength="19" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Expiry Date</label>
                  <input type="text" class="form-input" id="card-expiry" placeholder="MM/YY" maxlength="5" />
                </div>
                <div class="form-group">
                  <label class="form-label">CVV</label>
                  <input type="password" class="form-input" id="card-cvv" placeholder="•••" maxlength="3" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Cardholder Name</label>
                <input type="text" class="form-input" id="card-name" placeholder="KARTHIK RAJALEE" />
              </div>
            </div>

            <!-- UPI Form -->
            <div class="payment-form glass-card hidden" id="payment-form-upi">
              <div class="form-group">
                <label class="form-label">UPI ID</label>
                <input type="text" class="form-input" id="upi-id" placeholder="yourname@paytm" />
              </div>
            </div>

            <!-- Net Banking Form -->
            <div class="payment-form glass-card hidden" id="payment-form-netbanking">
              <div class="form-group">
                <label class="form-label">Select Bank</label>
                <select class="form-input" id="bank-select">
                  <option value="">Choose a bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
              </div>
            </div>

            <div class="payment-secure">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span>Secured by 256-bit SSL encryption. We do not store your card details.</span>
            </div>

            <button class="btn btn-gold btn-lg payment-submit-btn" id="pay-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Pay ₹${total.toLocaleString()}
            </button>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <div class="order-summary-card glass-card">
              <h3 class="order-title">Order Summary</h3>

              <div class="order-movie">
                <img src="${movie.posterUrl}" alt="${movie.title}" class="order-poster" />
                <div class="order-movie-info">
                  <h4>${movie.title}</h4>
                  <p>${movie.certification} · ${movie.genre.join(', ')}</p>
                  <p>${movie.language} · ${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m</p>
                </div>
              </div>

              <div class="order-details">
                <div class="order-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>${showtime.date}</span>
                </div>
                <div class="order-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>${showtime.time}</span>
                </div>
                <div class="order-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>${showtime.theaterName}</span>
                </div>
                <div class="order-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/></svg>
                  <span>${showtime.screenName}</span>
                </div>
                <div class="order-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>${selected.length} Ticket${selected.length > 1 ? 's' : ''}: ${selected.map(s => `${s.row}${s.number}`).join(', ')}</span>
                </div>
              </div>

              <div class="order-pricing">
                <div class="price-row">
                  <span>Subtotal (${selected.length} tickets)</span>
                  <span>₹${subtotal.toLocaleString()}</span>
                </div>
                <div class="price-row">
                  <span>Convenience Fee</span>
                  <span>₹${convenienceFee.toLocaleString()}</span>
                </div>
                <div class="price-row">
                  <span>GST (18%)</span>
                  <span>₹${gst.toLocaleString()}</span>
                </div>
                <div class="price-row price-total">
                  <span>Total Amount</span>
                  <span>₹${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Processing Overlay -->
      <div class="payment-processing hidden" id="payment-processing">
        <div class="processing-card glass-card">
          <div class="spinner"></div>
          <h3>Processing Payment...</h3>
          <p class="text-muted">Please do not close this window</p>
        </div>
      </div>
    </div>
  `;
}

export function initPaymentPage(movieId, showtimeId) {
    const movie = movies.find(m => m.id === movieId);
    const showtime = showtimes.find(s => s.id === showtimeId);
    const selected = store.getSelectedSeats(showtimeId);
    if (!movie || !showtime || selected.length === 0) return;

    // Payment method switching
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            method.classList.add('active');

            document.querySelectorAll('.payment-form').forEach(f => f.classList.add('hidden'));
            const formId = `payment-form-${method.dataset.method}`;
            document.getElementById(formId)?.classList.remove('hidden');
        });
    });

    // Card number formatting
    document.getElementById('card-number')?.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.replace(/(\d{4})(?=\d)/g, '$1  ');
        e.target.value = val;
    });

    // Expiry date formatting
    document.getElementById('card-expiry')?.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
        e.target.value = val;
    });

    // Pay button
    document.getElementById('pay-btn')?.addEventListener('click', () => {
        const subtotal = selected.reduce((sum, s) => sum + s.price, 0);
        const convenienceFee = Math.round(subtotal * 0.05);
        const gst = Math.round((subtotal + convenienceFee) * 0.18);
        const total = subtotal + convenienceFee + gst;

        // Show processing
        document.getElementById('payment-processing')?.classList.remove('hidden');

        // Simulate payment processing
        setTimeout(() => {
            const result = store.createBooking({
                movieId,
                movieTitle: movie.title,
                showtimeId,
                theaterId: showtime.theaterId,
                theaterName: showtime.theaterName,
                screenName: showtime.screenName,
                date: showtime.date,
                time: showtime.time,
                seats: selected,
                totalAmount: total,
            });

            showToast('Payment successful! Your ticket is ready.', 'success');
            window.location.hash = `#/confirmation/${result.booking.id}`;
        }, 2500);
    });
}
