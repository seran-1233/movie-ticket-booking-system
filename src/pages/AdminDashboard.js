/* ============================================
   CineVerse — Admin Dashboard
   ============================================ */
import './styles/admin.css';
import { store } from '../data/store.js';
import { movies, theaters, showtimes } from '../data/mockData.js';
import { showToast } from '../components/Toast.js';

export function renderAdminDashboard() {
    const analytics = store.getAnalytics();
    const allBookings = store.bookings;
    const recentBookings = allBookings.slice(0, 10);

    return `
    <div class="admin-page">
      <div class="container-wide">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary-light)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Admin <span class="accent">Dashboard</span>
            </h1>
            <p class="text-muted">Booking analytics and management overview</p>
          </div>
          <div class="admin-actions">
            <button class="btn btn-secondary btn-sm" id="refresh-dashboard-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-icon" style="background: rgba(124, 58, 237, 0.15); color: var(--color-accent-primary-light);">🎫</div>
            <div class="stat-card-value">${analytics.totalBookings}</div>
            <div class="stat-card-label">Total Bookings</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon" style="background: rgba(16, 185, 129, 0.15); color: var(--color-success);">💰</div>
            <div class="stat-card-value">₹${analytics.totalRevenue.toLocaleString()}</div>
            <div class="stat-card-label">Total Revenue</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon" style="background: rgba(6, 182, 212, 0.15); color: var(--color-accent-cyan);">✅</div>
            <div class="stat-card-value">${analytics.confirmedBookings}</div>
            <div class="stat-card-label">Confirmed</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon" style="background: rgba(239, 68, 68, 0.15); color: var(--color-error);">❌</div>
            <div class="stat-card-value">${analytics.cancelledBookings}</div>
            <div class="stat-card-label">Cancelled (${analytics.cancellationRate}%)</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon" style="background: rgba(245, 158, 11, 0.15); color: var(--color-accent-secondary);">💸</div>
            <div class="stat-card-value">₹${analytics.refundTotal.toLocaleString()}</div>
            <div class="stat-card-label">Refunds</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon" style="background: rgba(236, 72, 153, 0.15); color: var(--color-accent-pink);">📊</div>
            <div class="stat-card-value">₹${analytics.netRevenue.toLocaleString()}</div>
            <div class="stat-card-label">Net Revenue</div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-grid">
          <div class="chart-card glass-card">
            <h3 class="chart-title">Bookings by Movie</h3>
            <div class="chart-container">
              <canvas id="chart-bookings-movie"></canvas>
            </div>
            ${Object.keys(analytics.bookingsByMovie).length === 0 ? '<p class="chart-empty text-muted">No booking data yet. Complete a booking to see analytics.</p>' : ''}
          </div>
          <div class="chart-card glass-card">
            <h3 class="chart-title">Revenue by Theater</h3>
            <div class="chart-container">
              <canvas id="chart-revenue-theater"></canvas>
            </div>
            ${Object.keys(analytics.bookingsByTheater).length === 0 ? '<p class="chart-empty text-muted">No booking data yet.</p>' : ''}
          </div>
        </div>

        <!-- Quick Overview -->
        <div class="overview-grid">
          <!-- Movies Overview -->
          <div class="overview-card glass-card">
            <h3 class="overview-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary-light)" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
              Movies (${movies.length})
            </h3>
            <div class="overview-list">
              ${movies.map(m => `
                <div class="overview-item">
                  <img src="${m.posterUrl}" alt="${m.title}" class="overview-poster" />
                  <div class="overview-item-info">
                    <span class="overview-item-name">${m.title}</span>
                    <span class="overview-item-meta">${m.language} · ${m.genre[0]} · ★ ${m.rating}</span>
                  </div>
                  <span class="badge ${m.status === 'showing' ? 'badge-success' : 'badge-gold'}">${m.status === 'showing' ? 'Showing' : 'Coming'}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Recent Bookings -->
          <div class="overview-card glass-card">
            <h3 class="overview-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-secondary)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Recent Bookings
            </h3>
            ${recentBookings.length === 0 ? `
              <div class="overview-empty">
                <p class="text-muted">No bookings yet. Try making a booking from the Movies page!</p>
                <a href="#/movies" class="btn btn-primary btn-sm" style="margin-top: var(--space-md);">Browse Movies</a>
              </div>
            ` : `
              <div class="bookings-table-wrap">
                <table class="bookings-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Movie</th>
                      <th>Time</th>
                      <th>Seats</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentBookings.map(b => `
                      <tr>
                        <td><code>${b.id}</code></td>
                        <td>${b.movieTitle}</td>
                        <td>${b.time}</td>
                        <td>${b.seatLabels.join(', ')}</td>
                        <td>₹${b.totalAmount.toLocaleString()}</td>
                        <td><span class="badge ${b.status === 'confirmed' ? 'badge-success' : 'badge-error'}">${b.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>

        <!-- Showtimes Management -->
        <div class="showtimes-management glass-card">
          <div class="showtimes-header">
            <h3 class="overview-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-emerald)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Showtime Management (${showtimes.length} active)
            </h3>
          </div>
          <div class="showtimes-table-wrap">
            <table class="bookings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Movie</th>
                  <th>Theater</th>
                  <th>Screen</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Capacity</th>
                </tr>
              </thead>
              <tbody>
                ${showtimes.slice(0, 15).map(st => {
        const m = movies.find(mv => mv.id === st.movieId);
        return `
                    <tr>
                      <td><code>${st.id}</code></td>
                      <td>${m ? m.title : st.movieId}</td>
                      <td>${st.theaterName}</td>
                      <td>${st.screenName}</td>
                      <td>${st.date}</td>
                      <td>${st.time}</td>
                      <td>${st.totalSeats} seats</td>
                    </tr>
                  `;
    }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;
}

export async function initAdminDashboard() {
    const analytics = store.getAnalytics();

    // Refresh button
    document.getElementById('refresh-dashboard-btn')?.addEventListener('click', () => {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        showToast('Dashboard refreshed', 'info', 2000);
    });

    // Charts
    if (Object.keys(analytics.bookingsByMovie).length > 0 || Object.keys(analytics.bookingsByTheater).length > 0) {
        try {
            const Chart = (await import('chart.js/auto')).default;

            // Bookings by Movie
            const movieCtx = document.getElementById('chart-bookings-movie');
            if (movieCtx && Object.keys(analytics.bookingsByMovie).length > 0) {
                new Chart(movieCtx.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(analytics.bookingsByMovie),
                        datasets: [{
                            data: Object.values(analytics.bookingsByMovie),
                            backgroundColor: ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#ef4444', '#3b82f6', '#8b5cf6'],
                            borderColor: 'transparent',
                            borderWidth: 0,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { color: '#a0a0b8', padding: 16, font: { family: 'Inter', size: 12 } },
                            },
                        },
                    },
                });
            }

            // Revenue by Theater
            const theaterCtx = document.getElementById('chart-revenue-theater');
            if (theaterCtx && Object.keys(analytics.bookingsByTheater).length > 0) {
                new Chart(theaterCtx.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: Object.keys(analytics.bookingsByTheater).map(t => t.replace('CineVerse ', '')),
                        datasets: [{
                            label: 'Bookings',
                            data: Object.values(analytics.bookingsByTheater),
                            backgroundColor: 'rgba(124, 58, 237, 0.6)',
                            borderColor: '#7c3aed',
                            borderWidth: 1,
                            borderRadius: 8,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true, ticks: { color: '#6b6b82', font: { family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' } },
                            x: { ticks: { color: '#6b6b82', font: { family: 'Inter', size: 11 } }, grid: { display: false } },
                        },
                        plugins: {
                            legend: { display: false },
                        },
                    },
                });
            }
        } catch (err) {
            console.warn('Chart.js not loaded:', err);
        }
    }
}
