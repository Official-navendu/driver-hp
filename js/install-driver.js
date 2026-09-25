/**
 * HP-Inspired Printer Setup & Driver Portal — Driver Installation Script
 * Reads all URL query parameters using URLSearchParams and populates
 * workspace elements safely using textContent strictly.
 */

document.addEventListener('DOMContentLoaded', () => {
  initInstallPage();
});

function initInstallPage() {
  const params = new URLSearchParams(window.location.search);

  let model = params.get('model');
  let os = params.get('os');
  let device = params.get('device');
  let browser = params.get('browser');
  let connection = params.get('connection');
  let network = params.get('network');
  let ip = params.get('ip');
  let currentDriver = params.get('currentDriver');
  let availableDriver = params.get('availableDriver');

  // Fallback model if accessed directly without parameter
  if (!model || !model.trim() || model === 'unavailable') {
    model = 'HP LaserJet Pro M404dn';
  } else {
    model = decodeURIComponent(model).trim();
  }

  // SECURITY: Inject dynamic values strictly using textContent
  setText('selected-model-title', model);
  setText('breadcrumb-model', model);
  setText('modal-model-span', model);

  setText('install-os-span', os);
  setText('install-device-span', device);
  setText('install-browser-span', browser);
  setText('install-connection-span', connection);
  setText('install-network-span', network);
  setText('install-ip-span', ip);
  setText('install-current-driver-span', currentDriver);
  setText('install-available-driver-span', availableDriver);

  const osLabel = document.getElementById('detected-os-label');
  const activeOSVal = (os && os !== 'unavailable') ? os : 'Windows';
  if (osLabel) osLabel.textContent = activeOSVal;

  // Sync OS toggle buttons
  const osButtons = document.querySelectorAll('.os-btn');
  osButtons.forEach(btn => {
    const btnOS = btn.getAttribute('data-os');
    if (btnOS && btnOS.toLowerCase() === activeOSVal.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    btn.addEventListener('click', () => {
      osButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedOS = btn.getAttribute('data-os');
      if (osLabel) osLabel.textContent = selectedOS;

      // Update available driver version label if driver database entry exists
      if (typeof getDriverInfo === 'function') {
        const info = getDriverInfo(model, selectedOS);
        setText('install-available-driver-span', info.version);
      }
    });
  });

  // Driver Action Button
  const installDriverBtn = document.getElementById('install-driver-action');
  const changePrinterBtn = document.getElementById('change-printer-btn');

  const noticeModal = document.getElementById('driver-notice-modal');
  const modalCloseBtn = document.getElementById('close-notice-btn');
  const confirmNoticeBtn = document.getElementById('confirm-notice-btn');

  if (installDriverBtn) {
    installDriverBtn.addEventListener('click', () => {
      if (noticeModal) {
        noticeModal.classList.add('is-active');
        noticeModal.setAttribute('aria-hidden', 'false');
      }
    });
  }

  function closeModal() {
    if (noticeModal) {
      noticeModal.classList.remove('is-active');
      noticeModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (confirmNoticeBtn) confirmNoticeBtn.addEventListener('click', closeModal);

  if (noticeModal) {
    noticeModal.addEventListener('click', (e) => {
      if (e.target === noticeModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && noticeModal && noticeModal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Change Printer navigation
  if (changePrinterBtn) {
    changePrinterBtn.addEventListener('click', () => {
      window.location.href = 'identify-printer.html';
    });
  }
}

function setText(id, textVal) {
  const el = document.getElementById(id);
  if (!el) return;
  if (textVal && textVal !== 'null' && textVal !== 'undefined' && textVal !== 'unavailable') {
    el.textContent = textVal;
  } else {
    el.textContent = 'Unavailable';
  }
}
