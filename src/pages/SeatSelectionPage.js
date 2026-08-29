/* ============================================
   CineVerse — Seat Selection Page
   ============================================ */
import './styles/seatSelection.css';
import { movies, showtimes, theaters, generateSeatMap } from '../data/mockData.js';
import { store } from '../data/store.js';
import { showToast } from '../components/Toast.js';

let holdTimer = null;
let holdExpiry = null;

export function renderSeatSelectionPage(movieId, showtimeId) {
    const movie = movies.find(m => m.id === movieId);
    const showtime = showtimes.find(s => s.id === showtimeId);
    if (!movie || !showtime) {
        return `<div class="empty-state"><div class="empty-state-icon">💺</div><h2>Showtime Not Found</h2><a href="#/movies" class="btn btn-primary">Browse Movies</a></div>`;
    }

    const seats = store.getSeatMap(showtimeId, showtime.screenId, generateSeatMap);
    const rows = {};
    seats.forEach(seat => {
        if (!rows[seat.row]) rows[seat.row] = [];
        rows[seat.row].push(seat);
    });

    return `
    <div class="seat-page">
      <div class="container">
        <!-- Header -->
        <div class="seat-header">
          <div class="seat-header-info">
            <a href="#/movie/${movieId}" class="back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </a>
            <div>
              <h1 class="seat-movie-title">${movie.title}</h1>
              <p class="seat-showtime-info">${showtime.theaterName} · ${showtime.screenName} · ${showtime.time} · ${showtime.date}</p>
            </div>
          </div>
          <div class="seat-timer glass-card" id="seat-timer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span id="timer-display">05:00</span>
          </div>
        </div>

        <!-- Screen -->
        <div class="screen-container">
          <div class="screen-curve">
            <div class="screen-label">SCREEN</div>
          </div>
          <div class="screen-glow"></div>
        </div>

        <!-- Seat Map -->
        <div class="seat-map" id="seat-map">
          ${Object.entries(rows).map(([row, rowSeats]) => {
        const category = rowSeats[0].category;
        const prevRow = Object.keys(rows)[Object.keys(rows).indexOf(row) - 1];
        const prevCategory = prevRow ? rows[prevRow][0].category : category;
        const divider = prevCategory !== category ? `<div class="category-divider"><span>${category.toUpperCase()} — ₹${showtime.prices[category]}</span></div>` : '';

        return `
              ${divider}
              <div class="seat-row" data-category="${category}">
                <span class="row-label">${row}</span>
                <div class="seat-row-seats">
                  ${rowSeats.map(seat => `
                    <button
                      class="seat seat-${seat.status} seat-cat-${seat.category}"
                      data-seat-id="${seat.id}"
                      data-row="${seat.row}"
                      data-number="${seat.number}"
                      data-category="${seat.category}"
                      data-price="${seat.price}"
                      ${seat.status === 'booked' ? 'disabled' : ''}
                      title="${seat.row}${seat.number} — ${seat.category} — ₹${seat.price}"
                    >
                      ${seat.category === 'recliner' ? '🛋' : seat.number}
                    </button>
                  `).join('')}
                </div>
                <span class="row-label">${row}</span>
              </div>
            `;
    }).join('')}
        </div>

        <!-- Legend -->
        <div class="seat-legend">
          <div class="legend-item"><span class="legend-box legend-available"></span>Available</div>
          <div class="legend-item"><span class="legend-box legend-selected"></span>Selected</div>
          <div class="legend-item"><span class="legend-box legend-booked"></span>Booked</div>
          <div class="legend-item"><span class="legend-box legend-standard"></span>Standard ₹${showtime.prices.standard}</div>
          <div class="legend-item"><span class="legend-box legend-premium"></span>Premium ₹${showtime.prices.premium}</div>
          <div class="legend-item"><span class="legend-box legend-recliner"></span>Recliner ₹${showtime.prices.recliner}</div>
        </div>

        <!-- Booking Summary -->
        <div class="booking-summary glass-card" id="booking-summary">
          <div class="summary-details" id="summary-details">
            <p class="summary-placeholder">Select seats to see booking summary</p>
          </div>
          <button class="btn btn-primary btn-lg" id="proceed-payment-btn" disabled>
            Proceed to Payment
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initSeatSelectionPage(movieId, showtimeId) {
    const showtime = showtimes.find(s => s.id === showtimeId);
    if (!showtime) return;

    // Seat click handlers
    document.querySelectorAll('.seat:not([disabled])').forEach(seatEl => {
        seatEl.addEventListener('click', () => {
            const seatId = seatEl.dataset.seatId;
            const result = store.toggleSeat(showtimeId, seatId);

            if (result === 'selected') {
                seatEl.className = `seat seat-selected seat-cat-${seatEl.dataset.category}`;
                seatEl.classList.add('seat-bounce');
                setTimeout(() => seatEl.classList.remove('seat-bounce'), 400);
            } else if (result === 'available') {
                seatEl.className = `seat seat-available seat-cat-${seatEl.dataset.category}`;
            }

            updateSummary(movieId, showtimeId);
        });
    });

    // Start hold timer
    startTimer();

    // Proceed button
    document.getElementById('proceed-payment-btn')?.addEventListener('click', () => {
        const selected = store.getSelectedSeats(showtimeId);
        if (selected.length === 0) {
            showToast('Please select at least one seat', 'warning');
            return;
        }
        clearInterval(holdTimer);
        window.location.hash = `#/payment/${movieId}/${showtimeId}`;
    });
}

function updateSummary(movieId, showtimeId) {
    const selected = store.getSelectedSeats(showtimeId);
    const summaryEl = document.getElementById('summary-details');
    const proceedBtn = document.getElementById('proceed-payment-btn');

    if (selected.length === 0) {
        summaryEl.innerHTML = '<p class="summary-placeholder">Select seats to see booking summary</p>';
        proceedBtn.disabled = true;
        return;
    }

    const total = selected.reduce((sum, s) => sum + s.price, 0);
    const seatLabels = selected.map(s => `${s.row}${s.number}`).join(', ');
    const categoryCounts = {};
    selected.forEach(s => { categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1; });

    summaryEl.innerHTML = `
    <div class="summary-row">
      <span class="summary-label">Seats</span>
      <span class="summary-value">${seatLabels}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Tickets</span>
      <span class="summary-value">${selected.length} × ${Object.entries(categoryCounts).map(([cat, count]) => `${count} ${cat}`).join(', ')}</span>
    </div>
    <div class="summary-row summary-total">
      <span class="summary-label">Total</span>
      <span class="summary-value">₹${total.toLocaleString()}</span>
    </div>
  `;
    proceedBtn.disabled = false;
}

function startTimer() {
    let timeLeft = 300; // 5 minutes
    const timerDisplay = document.getElementById('timer-display');

    holdTimer = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const secs = (timeLeft % 60).toString().padStart(2, '0');
        if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;

        if (timeLeft <= 60 && timerDisplay) {
            timerDisplay.style.color = 'var(--color-error)';
        }

        if (timeLeft <= 0) {
            clearInterval(holdTimer);
            showToast('Session expired. Seats released.', 'error');
            window.location.hash = '#/movies';
        }
    }, 1000);
}
