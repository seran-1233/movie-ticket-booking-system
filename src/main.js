/* ============================================
   CineVerse — Main Entry Point & SPA Router
   ============================================ */
import './styles/global.css';
import './styles/components.css';

import { renderNavbar, initNavbar, updateActiveLink } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';

/* ─── Page imports (lazy-ish) ─── */
import { renderHomePage, initHomePage } from './pages/HomePage.js';
import { renderMoviesPage, initMoviesPage } from './pages/MoviesPage.js';
import { renderMovieDetailPage, initMovieDetailPage } from './pages/MovieDetailPage.js';
import { renderSeatSelectionPage, initSeatSelectionPage } from './pages/SeatSelectionPage.js';
import { renderPaymentPage, initPaymentPage } from './pages/PaymentPage.js';
import { renderConfirmationPage, initConfirmationPage } from './pages/ConfirmationPage.js';
import { renderMyBookingsPage, initMyBookingsPage } from './pages/MyBookingsPage.js';
import { renderAdminDashboard, initAdminDashboard } from './pages/AdminDashboard.js';

/* ─── Route Definitions ─── */
const routes = [
    { pattern: /^#?\/?$/, page: 'home', render: renderHomePage, init: initHomePage },
    { pattern: /^#\/movies\/?$/, page: 'movies', render: renderMoviesPage, init: initMoviesPage },
    { pattern: /^#\/movie\/(.+)$/, page: 'movie', render: renderMovieDetailPage, init: initMovieDetailPage },
    { pattern: /^#\/seats\/(.+)\/(.+)$/, page: 'seats', render: renderSeatSelectionPage, init: initSeatSelectionPage },
    { pattern: /^#\/payment\/(.+)\/(.+)$/, page: 'payment', render: renderPaymentPage, init: initPaymentPage },
    { pattern: /^#\/confirmation\/(.+)$/, page: 'confirmation', render: renderConfirmationPage, init: initConfirmationPage },
    { pattern: /^#\/bookings\/?$/, page: 'bookings', render: renderMyBookingsPage, init: initMyBookingsPage },
    { pattern: /^#\/admin\/?$/, page: 'admin', render: renderAdminDashboard, init: initAdminDashboard },
];

/* ─── Router ─── */
function navigate() {
    const hash = window.location.hash || '#/';
    const app = document.getElementById('app');

    let matched = false;
    for (const route of routes) {
        const match = hash.match(route.pattern);
        if (match) {
            const params = match.slice(1);
            app.innerHTML = renderNavbar() + `<main class="page-content" id="page-container">${route.render(...params)}</main>` + renderFooter();
            initNavbar();
            updateActiveLink();
            route.init(...params);
            matched = true;
            window.scrollTo({ top: 0, behavior: 'instant' });
            break;
        }
    }

    if (!matched) {
        app.innerHTML = renderNavbar() + `
      <main class="page-content">
        <div class="empty-state">
          <div class="empty-state-icon">🎭</div>
          <h2 class="empty-state-title">Page Not Found</h2>
          <p class="empty-state-text">The page you're looking for doesn't exist.</p>
          <a href="#/" class="btn btn-primary">Go Home</a>
        </div>
      </main>
    ` + renderFooter();
        initNavbar();
    }
}

/* ─── App Boot ─── */
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) window.location.hash = '#/';
    navigate();
});
