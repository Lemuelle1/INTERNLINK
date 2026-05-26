const toast = {
  show(message, type = 'info', duration = 4000) {
    let container = document.getElementById('global-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'global-toast-container';
      container.className = 'toast-container-custom';
      document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast-custom ${type}`;

    let icon = 'bi-info-circle';
    if (type === 'success') icon = 'bi-check-circle-fill';
    if (type === 'error') icon = 'bi-exclamation-triangle-fill';
    if (type === 'warning') icon = 'bi-exclamation-circle-fill';

    toastEl.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="bi ${icon} fs-5"></i>
        <span>${message}</span>
      </div>
      <button class="toast-custom-close">&times;</button>
    `;

    container.appendChild(toastEl);

    const closeBtn = toastEl.querySelector('.toast-custom-close');
    closeBtn.addEventListener('click', () => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateY(10px)';
      setTimeout(() => toastEl.remove(), 300);
    });

    // Auto remove
    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(10px)';
        setTimeout(() => toastEl.remove(), 300);
      }
    }, duration);
  },
  
  success(message, duration) {
    this.show(message, 'success', duration);
  },
  
  error(message, duration) {
    this.show(message, 'error', duration);
  },
  
  warning(message, duration) {
    this.show(message, 'warning', duration);
  },
  
  info(message, duration) {
    this.show(message, 'info', duration);
  }
};

export default toast;
