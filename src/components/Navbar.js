/* ============================================
   CineVerse — Navbar Component
   ============================================ */
import { store } from '../data/store.js';

export function renderNavbar() {
    return `
    <nav class="navbar" id="main-navbar">
      <div class="nav-container container-wide">
        <a href="#/" class="nav-logo" id="nav-logo">
          <span class="logo-icon">🎬</span>
          <span class="logo-text">Cine<span class="logo-accent">Verse</span></span>
        </a>

        <div class="nav-links" id="nav-links">
          <a href="#/" class="nav-link" data-page="home">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </a>
          <a href="#/movies" class="nav-link" data-page="movies">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>
            Movies
          </a>
          <a href="#/bookings" class="nav-link" data-page="bookings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v0a3 3 0 01-3 3H5a3 3 0 01-3-3z"/><path d="M2 15a3 3 0 013-3h14a3 3 0 013 3v0a3 3 0 01-3 3H5a3 3 0 01-3-3z"/></svg>
            My Bookings
          </a>
          <a href="#/admin" class="nav-link" data-page="admin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
        </div>

        <div class="nav-actions">
          <div class="nav-user" id="nav-user">
            <div class="user-avatar">
              ${store.user.name.charAt(0)}
            </div>
            <span class="user-name">${store.user.name.split(' ')[0]}</span>
          </div>
          <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `;
}

export function initNavbar() {
    const navbar = document.getElementById('main-navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    // Mobile toggle
    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('open');
        });
    }

    // Close mobile menu on link click
    links?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle?.classList.remove('active');
            links.classList.remove('open');
        });
    });

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar?.classList.add('hidden');
        } else {
            navbar?.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });

    // Active link highlighting
    updateActiveLink();
}

export function updateActiveLink() {
    const hash = window.location.hash || '#/';
    const page = hash.split('/')[1] || 'home';

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
}
