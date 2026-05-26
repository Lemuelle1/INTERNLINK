const loader = {
  show() {
    let overlay = document.getElementById('global-loader');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'global-loader';
      overlay.className = 'loader-overlay';
      overlay.innerHTML = '<div class="spinner-custom"></div>';
      document.body.appendChild(overlay);
    }
  },
  hide() {
    const overlay = document.getElementById('global-loader');
    if (overlay) {
      overlay.remove();
    }
  }
};

export default loader;
