/* ============================================
   CineVerse — Home Page
   ============================================ */
import './styles/home.css';
import { movies } from '../data/mockData.js';

export function renderHomePage() {
    const showing = movies.filter(m => m.status === 'showing');
    const coming = movies.filter(m => m.status === 'coming_soon');
    const heroMovie = showing[0];

    return `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero" id="hero-section">
        <div class="hero-bg">
          <img src="${heroMovie.backdropUrl}" alt="${heroMovie.title}" class="hero-bg-img" />
          <div class="hero-gradient"></div>
          <div class="hero-particles" id="hero-particles"></div>
        </div>
        <div class="hero-content container">
          <div class="hero-text">
            <div class="hero-badge animate-fade-in">
              <span class="badge badge-accent">🎬 Now Showing</span>
              <span class="badge badge-gold">★ ${heroMovie.rating}/10</span>
            </div>
            <h1 class="hero-title animate-fade-in-up">${heroMovie.title}</h1>
            <div class="hero-meta animate-fade-in-up stagger-1">
              <span>${heroMovie.genre.join(' • ')}</span>
              <span class="dot">•</span>
              <span>${heroMovie.language}</span>
              <span class="dot">•</span>
              <span>${Math.floor(heroMovie.duration / 60)}h ${heroMovie.duration % 60}m</span>
              <span class="dot">•</span>
              <span class="cert-badge">${heroMovie.certification}</span>
            </div>
            <p class="hero-synopsis animate-fade-in-up stagger-2">${heroMovie.synopsis}</p>
            <div class="hero-actions animate-fade-in-up stagger-3">
              <a href="#/movie/${heroMovie.id}" class="btn btn-primary btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                Book Tickets
              </a>
              <button class="btn btn-secondary btn-lg" id="hero-trailer-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Watch Trailer
              </button>
            </div>
          </div>
          <div class="hero-poster animate-slide-in-right">
            <img src="${heroMovie.posterUrl}" alt="${heroMovie.title}" />
            <div class="hero-poster-glow"></div>
          </div>
        </div>
        <div class="hero-scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      <!-- Quick Stats -->
      <section class="quick-stats">
        <div class="container">
          <div class="stats-bar glass-card">
            <div class="stat-item">
              <span class="stat-number" data-target="8">0</span>
              <span class="stat-label">Movies Showing</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number" data-target="3">0</span>
              <span class="stat-label">Premium Theaters</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number" data-target="48">0</span>
              <span class="stat-label">Daily Shows</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number" data-target="25000">0</span>
              <span class="stat-label">Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Now Showing -->
      <section class="section" id="now-showing">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">
              <span class="accent">Now</span> Showing
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary-light)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            </h2>
            <a href="#/movies" class="btn btn-ghost">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </div>
          <div class="movies-scroll" id="now-showing-scroll">
            ${showing.map(movie => renderMovieCard(movie)).join('')}
          </div>
        </div>
      </section>

      <!-- Coming Soon -->
      <section class="section coming-soon-section" id="coming-soon">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">
              <span class="gold">Coming</span> Soon
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-secondary)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </h2>
          </div>
          <div class="movies-grid">
            ${coming.map(movie => renderMovieCard(movie, true)).join('')}
          </div>
        </div>
      </section>

      <!-- Why CineVerse -->
      <section class="section why-section">
        <div class="container">
          <h2 class="section-title text-center" style="justify-content: center;">
            Why <span class="accent">CineVerse</span>?
          </h2>
          <p class="why-subtitle text-center text-muted">Premium cinema experience, redefined.</p>
          <div class="features-grid">
            <div class="feature-card glass-card">
              <div class="feature-icon" style="background: rgba(124, 58, 237, 0.15);">🎭</div>
              <h3>Premium Screens</h3>
              <p>IMAX, 4DX, Dolby Atmos — experience movies the way they were meant to be seen.</p>
            </div>
            <div class="feature-card glass-card">
              <div class="feature-icon" style="background: rgba(16, 185, 129, 0.15);">💺</div>
              <h3>Live Seat Maps</h3>
              <p>Real-time interactive seat selection. Choose your perfect spot with instant confirmation.</p>
            </div>
            <div class="feature-card glass-card">
              <div class="feature-icon" style="background: rgba(245, 158, 11, 0.15);">📱</div>
              <h3>Digital Tickets</h3>
              <p>QR-code based digital tickets delivered instantly. No paper, no hassle.</p>
            </div>
            <div class="feature-card glass-card">
              <div class="feature-icon" style="background: rgba(236, 72, 153, 0.15);">🔒</div>
              <h3>Secure Payments</h3>
              <p>PCI-DSS compliant payment processing with 256-bit encryption.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderMovieCard(movie, isComingSoon = false) {
    return `
    <a href="#/movie/${movie.id}" class="movie-card" data-movie-id="${movie.id}">
      <div class="movie-card-poster">
        <img src="${movie.posterUrl}" alt="${movie.title}" loading="lazy" />
        <div class="movie-card-rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          ${movie.rating}
        </div>
        <div class="movie-card-overlay">
          <span class="btn btn-primary btn-sm">${isComingSoon ? 'Notify Me' : 'Book Now'}</span>
        </div>
      </div>
      <div class="movie-card-info">
        <h3 class="movie-card-title">${movie.title}</h3>
        <div class="movie-card-meta">
          <span>${movie.genre[0]}</span>
          <span class="dot"></span>
          <span>${movie.language}</span>
          <span class="dot"></span>
          <span>${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m</span>
        </div>
      </div>
    </a>
  `;
}

export function initHomePage() {
    // Animate stats on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) observer.observe(statsBar);

    // Create floating particles
    createParticles();
}

function animateStats() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString();

            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    });
}

function createParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      animation-delay: ${Math.random() * 5}s;
      animation-duration: ${3 + Math.random() * 4}s;
    `;
        container.appendChild(particle);
    }
}
