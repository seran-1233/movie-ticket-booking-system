/* ============================================
   CineVerse — Movies Page
   ============================================ */
import './styles/movies.css';
import { movies } from '../data/mockData.js';

export function renderMoviesPage() {
    const genres = [...new Set(movies.flatMap(m => m.genre))].sort();
    const languages = [...new Set(movies.map(m => m.language))].sort();

    return `
    <div class="movies-page">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <h1 class="page-title">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary-light)" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            Movie <span class="accent">Catalog</span>
          </h1>
          <p class="page-subtitle text-muted">Discover and book tickets for the latest blockbusters</p>
        </div>

        <!-- Filters -->
        <div class="filters-bar glass-card" id="filters-bar">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="search-input" id="movie-search" placeholder="Search movies..." />
          </div>
          <div class="filter-group">
            <select class="filter-select" id="filter-genre">
              <option value="">All Genres</option>
              ${genres.map(g => `<option value="${g}">${g}</option>`).join('')}
            </select>
            <select class="filter-select" id="filter-language">
              <option value="">All Languages</option>
              ${languages.map(l => `<option value="${l}">${l}</option>`).join('')}
            </select>
            <select class="filter-select" id="filter-status">
              <option value="">All</option>
              <option value="showing">Now Showing</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
            <select class="filter-select" id="filter-sort">
              <option value="rating">Rating ↓</option>
              <option value="title">Title A→Z</option>
              <option value="release">Release Date</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        <!-- Results Count -->
        <div class="results-info" id="results-info">
          <span id="results-count">${movies.length} movies</span>
        </div>

        <!-- Movie Grid -->
        <div class="catalog-grid" id="catalog-grid">
          ${renderMovieCards(movies)}
        </div>
      </div>
    </div>
  `;
}

function renderMovieCards(movieList) {
    if (movieList.length === 0) {
        return `
      <div class="empty-state">
        <div class="empty-state-icon">🎬</div>
        <h3 class="empty-state-title">No Movies Found</h3>
        <p class="empty-state-text">Try adjusting your filters</p>
      </div>
    `;
    }

    return movieList.map(movie => `
    <a href="#/movie/${movie.id}" class="movie-card catalog-movie-card" data-movie-id="${movie.id}">
      <div class="movie-card-poster">
        <img src="${movie.posterUrl}" alt="${movie.title}" loading="lazy" />
        <div class="movie-card-rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          ${movie.rating}
        </div>
        ${movie.status === 'coming_soon' ? '<div class="coming-soon-badge">Coming Soon</div>' : ''}
        <div class="movie-card-overlay">
          <span class="btn btn-primary btn-sm">${movie.status === 'showing' ? 'Book Now' : 'Notify Me'}</span>
        </div>
      </div>
      <div class="movie-card-info">
        <h3 class="movie-card-title">${movie.title}</h3>
        <div class="movie-card-meta">
          <span>${movie.genre.join(', ')}</span>
        </div>
        <div class="movie-card-meta">
          <span>${movie.language}</span>
          <span class="dot"></span>
          <span>${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m</span>
          <span class="dot"></span>
          <span class="cert-badge-sm">${movie.certification}</span>
        </div>
      </div>
    </a>
  `).join('');
}

export function initMoviesPage() {
    const searchInput = document.getElementById('movie-search');
    const genreFilter = document.getElementById('filter-genre');
    const langFilter = document.getElementById('filter-language');
    const statusFilter = document.getElementById('filter-status');
    const sortFilter = document.getElementById('filter-sort');

    function applyFilters() {
        const search = searchInput?.value?.toLowerCase() || '';
        const genre = genreFilter?.value || '';
        const language = langFilter?.value || '';
        const status = statusFilter?.value || '';
        const sort = sortFilter?.value || 'rating';

        let filtered = movies.filter(m => {
            if (search && !m.title.toLowerCase().includes(search) && !m.genre.join(' ').toLowerCase().includes(search)) return false;
            if (genre && !m.genre.includes(genre)) return false;
            if (language && m.language !== language) return false;
            if (status && m.status !== status) return false;
            return true;
        });

        // Sort
        filtered.sort((a, b) => {
            if (sort === 'rating') return b.rating - a.rating;
            if (sort === 'title') return a.title.localeCompare(b.title);
            if (sort === 'release') return new Date(b.releaseDate) - new Date(a.releaseDate);
            if (sort === 'duration') return b.duration - a.duration;
            return 0;
        });

        const grid = document.getElementById('catalog-grid');
        const count = document.getElementById('results-count');
        if (grid) grid.innerHTML = renderMovieCards(filtered);
        if (count) count.textContent = `${filtered.length} movie${filtered.length !== 1 ? 's' : ''}`;
    }

    [searchInput, genreFilter, langFilter, statusFilter, sortFilter].forEach(el => {
        el?.addEventListener('input', applyFilters);
        el?.addEventListener('change', applyFilters);
    });
}
