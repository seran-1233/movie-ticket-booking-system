/* ============================================
   CineVerse — Movie Detail Page
   ============================================ */
import './styles/movieDetail.css';
import { movies, theaters, showtimes } from '../data/mockData.js';

export function renderMovieDetailPage(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) {
        return `<div class="empty-state"><div class="empty-state-icon">🎬</div><h2 class="empty-state-title">Movie Not Found</h2><a href="#/movies" class="btn btn-primary">Browse Movies</a></div>`;
    }

    const movieShowtimes = showtimes.filter(s => s.movieId === movieId);
    const theaterGroups = {};
    movieShowtimes.forEach(st => {
        if (!theaterGroups[st.theaterId]) {
            theaterGroups[st.theaterId] = { theater: theaters.find(t => t.id === st.theaterId), showtimes: [] };
        }
        theaterGroups[st.theaterId].showtimes.push(st);
    });

    return `
    <div class="movie-detail-page">
      <!-- Backdrop -->
      <div class="detail-backdrop">
        <img src="${movie.backdropUrl}" alt="${movie.title}" />
        <div class="detail-backdrop-gradient"></div>
      </div>

      <!-- Movie Info -->
      <div class="container">
        <div class="detail-content">
          <div class="detail-poster">
            <img src="${movie.posterUrl}" alt="${movie.title}" />
          </div>
          <div class="detail-info">
            <div class="detail-badges">
              <span class="badge badge-accent">${movie.status === 'showing' ? '🎬 Now Showing' : '🕐 Coming Soon'}</span>
              <span class="badge badge-gold">★ ${movie.rating}/10</span>
              <span class="badge badge-info">${movie.certification}</span>
            </div>
            <h1 class="detail-title">${movie.title}</h1>
            <div class="detail-meta">
              <span>${movie.genre.join(' • ')}</span>
              <span class="dot">•</span>
              <span>${movie.language}</span>
              <span class="dot">•</span>
              <span>${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m</span>
              <span class="dot">•</span>
              <span>${new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <p class="detail-synopsis">${movie.synopsis}</p>

            <div class="detail-crew">
              <div class="crew-item">
                <span class="crew-label">Director</span>
                <span class="crew-value">${movie.director}</span>
              </div>
              <div class="crew-item">
                <span class="crew-label">Cast</span>
                <span class="crew-value">${movie.cast.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Showtimes -->
        ${movie.status === 'showing' ? `
          <section class="showtimes-section" id="showtimes-section">
            <h2 class="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary-light)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Select <span class="accent">Showtime</span>
            </h2>

            <div class="date-selector" id="date-selector">
              ${generateDateTabs()}
            </div>

            <div class="theaters-list" id="theaters-list">
              ${Object.values(theaterGroups).map(group => `
                <div class="theater-card glass-card">
                  <div class="theater-header">
                    <div class="theater-info">
                      <h3 class="theater-name">${group.theater.name}</h3>
                      <p class="theater-address">${group.theater.address}</p>
                    </div>
                  </div>
                  <div class="showtime-slots">
                    ${group.showtimes.map(st => `
                      <a href="#/seats/${movieId}/${st.id}" class="showtime-slot" data-showtime-id="${st.id}">
                        <span class="slot-time">${st.time}</span>
                        <span class="slot-screen">${st.screenName}</span>
                        <span class="slot-price">₹${st.prices.standard}+</span>
                      </a>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : `
          <div class="coming-soon-notice glass-card">
            <div class="notice-icon">🕐</div>
            <h3>Coming Soon</h3>
            <p>This movie releases on ${new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. Bookings will open soon!</p>
            <button class="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              Notify Me When Available
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}

function generateDateTabs() {
    const days = [];
    for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short' });
        const dayNum = date.getDate();
        const month = date.toLocaleDateString('en-IN', { month: 'short' });
        days.push(`
      <button class="date-tab ${i === 0 ? 'active' : ''}" data-date="${date.toISOString().split('T')[0]}">
        <span class="date-day">${dayName}</span>
        <span class="date-num">${dayNum} ${month}</span>
      </button>
    `);
    }
    return days.join('');
}

export function initMovieDetailPage(_movieId) {
    // Date tab switching
    document.querySelectorAll('.date-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.date-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}
