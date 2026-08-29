/* ============================================
   CineVerse — Modal Component
   ============================================ */

let currentModal = null;

export function showModal({ title, content, actions = [], size = 'medium', onClose = null }) {
    closeModal();

    const container = document.getElementById('modal-container');
    if (!container) return;

    const sizeClass = `modal-${size}`;

    container.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop">
      <div class="modal ${sizeClass}" id="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close-btn" id="modal-close-btn" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">${content}</div>
        ${actions.length ? `
          <div class="modal-footer">
            ${actions.map(a => `<button class="btn ${a.className || 'btn-secondary'}" id="modal-action-${a.id}">${a.label}</button>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;

    // Show with animation
    requestAnimationFrame(() => {
        container.querySelector('.modal-backdrop')?.classList.add('show');
        container.querySelector('.modal')?.classList.add('show');
    });

    // Close button
    document.getElementById('modal-close-btn')?.addEventListener('click', () => {
        closeModal();
        onClose?.();
    });

    // Backdrop close
    document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
        if (e.target.id === 'modal-backdrop') {
            closeModal();
            onClose?.();
        }
    });

    // ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            onClose?.();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Action buttons
    actions.forEach(action => {
        document.getElementById(`modal-action-${action.id}`)?.addEventListener('click', () => {
            action.onClick?.();
        });
    });

    currentModal = { container, escHandler };
}

export function closeModal() {
    const container = document.getElementById('modal-container');
    if (!container) return;

    const backdrop = container.querySelector('.modal-backdrop');
    const modal = container.querySelector('.modal');

    if (backdrop) backdrop.classList.remove('show');
    if (modal) modal.classList.remove('show');

    setTimeout(() => {
        container.innerHTML = '';
    }, 300);

    currentModal = null;
}
