/* ============================================
   CineVerse — Footer Component
   ============================================ */

export function renderFooter() {
    return `
    <footer class="footer">
      <div class="footer-glow"></div>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#/" class="footer-logo">
              <span class="logo-icon">🎬</span>
              <span class="logo-text">Cine<span class="logo-accent">Verse</span></span>
            </a>
            <p class="footer-tagline">Your universe of cinema. Premium movie booking experience with real-time seat selection and instant digital tickets.</p>
            <div class="footer-socials">
              <a href="#" class="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          <div class="footer-links-group">
            <h4 class="footer-heading">Quick Links</h4>
            <ul class="footer-list">
              <li><a href="#/">Home</a></li>
              <li><a href="#/movies">Now Showing</a></li>
              <li><a href="#/bookings">My Bookings</a></li>
              <li><a href="#/admin">Dashboard</a></li>
            </ul>
          </div>

          <div class="footer-links-group">
            <h4 class="footer-heading">Help & Support</h4>
            <ul class="footer-list">
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div class="footer-links-group">
            <h4 class="footer-heading">Contact</h4>
            <ul class="footer-list footer-contact">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Chennai, Tamil Nadu, India
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                support@cineverse.in
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                +91 044-CINEVERSE
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 CineVerse. All rights reserved. Built with ❤️ by Karthik Rajalee.</p>
          <div class="footer-badges">
            <span class="badge badge-accent">PCI-DSS Compliant</span>
            <span class="badge badge-success">256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
