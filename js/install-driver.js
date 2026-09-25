/**
 * HP-Inspired Printer Setup Portal — Driver Installation Script
 * Refined 5-step horizontal installation workflow that preserves all URL parameters,
 * selects a documented reference error code, and navigates to installation-error.html at 68%.
 */

const INSTALL_ERROR_CODES = [
  {
    code: "0x00000057",
    title: "Printer installation operation could not be completed.",
    reference: "Printer installation reference"
  },
  {
    code: "0x000005B3",
    title: "Printer software installation encountered a spooler-related problem.",
    reference: "Printer installation reference"
  },
  {
    code: "0x00000BC4",
    title: "The printer installation process could not find a suitable printer connection.",
    reference: "Printer installation reference"
  },
  {
    code: "0x0000052E",
    title: "The network printer connection could not be completed.",
    reference: "Network printer reference"
  },
  {
    code: "0x000005B4",
    title: "The device installation process timed out.",
    reference: "Device installation reference"
  },
  {
    code: "0xE0000248",
    title: "Device installation was blocked by system policy.",
    reference: "Device installation reference"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initInstallPage();
});

function initInstallPage() {
  const params = new URLSearchParams(window.location.search);

  let model = params.get('model');
  let connection = params.get('connection') || 'Online';
  let ip = params.get('publicIp') || params.get('ip') || 'Protected';
  let availableDriver = params.get('availableVersion') || params.get('availableDriver') || 'v48.3.4754';

  // Direct access check: redirect to printer search if no model provided
  if (!model || !model.trim() || model.toLowerCase() === 'unavailable') {
    window.location.href = 'identify-printer.html';
    return;
  }

  model = decodeURIComponent(model).trim();
  if (connection.toLowerCase() === 'unavailable') connection = 'Online';
  if (ip.toLowerCase() === 'unavailable') ip = 'Protected';
  if (availableDriver.toLowerCase() === 'unavailable') availableDriver = 'v48.3.4754';

  // SECURITY: Inject visible summary values strictly using textContent
  setText('sum-printer-model', model);
  setText('sum-driver-version', availableDriver);
  setText('sum-public-ip', ip);
  setText('sum-connection', connection);

  // Start 5-step setup simulation sequence
  runSimulation(params);
}

function runSimulation(params) {
  const progressFill = document.getElementById('step-progress-fill');
  
  const s1 = document.getElementById('step-01');
  const s1Status = document.getElementById('step-01-status');

  const s2 = document.getElementById('step-02');
  const s2Status = document.getElementById('step-02-status');

  const s3 = document.getElementById('step-03');
  const s3Status = document.getElementById('step-03-status');

  const s4 = document.getElementById('step-04');
  const s4Status = document.getElementById('step-04-status');

  const s5 = document.getElementById('step-05');
  const s5Status = document.getElementById('step-05-status');
  const s5Desc = document.getElementById('step-05-desc');

  const pctEl = document.getElementById('install-pct-val');

  const setProgress = (val) => {
    if (progressFill) progressFill.style.width = val + '%';
    if (pctEl) pctEl.textContent = val + '%';
  };

  // Step 1: 0ms -> 1600ms
  setStepState(s1, s1Status, 'active', '● In progress');

  // Step 2: 1600ms -> 3600ms
  setTimeout(() => {
    setStepState(s1, s1Status, 'done', '✓ Complete');
    setStepState(s2, s2Status, 'active', '● In progress');
  }, 1600);

  // Step 3: 3600ms -> 5600ms
  setTimeout(() => {
    setStepState(s2, s2Status, 'done', '✓ Complete');
    setStepState(s3, s3Status, 'active', '● In progress');
  }, 3600);

  // Step 4: 5600ms -> 7600ms
  setTimeout(() => {
    setStepState(s3, s3Status, 'done', '✓ Complete');
    setStepState(s4, s4Status, 'active', '● In progress');
  }, 5600);

  // Step 5: 7600ms -> 12400ms
  setTimeout(() => {
    setStepState(s4, s4Status, 'done', '✓ Complete');
    setStepState(s5, s5Status, 'active', '● In progress');
    if (s5Desc) s5Desc.textContent = 'Installing printer software (0%)';
    setProgress(0);
  }, 7600);

  // Step 5 Gradual Progress Steps (0 -> 8 -> 17 -> 26 -> 35 -> 44 -> 53 -> 61 -> 68)
  setTimeout(() => { setProgress(8); updateStep5(8); }, 8200);
  setTimeout(() => { setProgress(17); updateStep5(17); }, 8700);
  setTimeout(() => { setProgress(26); updateStep5(26); }, 9200);
  setTimeout(() => { setProgress(35); updateStep5(35); }, 9700);
  setTimeout(() => { setProgress(44); updateStep5(44); }, 10200);
  setTimeout(() => { setProgress(53); updateStep5(53); }, 10700);
  setTimeout(() => { setProgress(61); updateStep5(61); }, 11200);
  setTimeout(() => { setProgress(68); updateStep5(68); }, 11800);

  // At 68% (12400ms), stop animation and transition to installation-error.html
  setTimeout(() => {
    setProgress(68);
    setStepState(s5, s5Status, 'warning', '● 68%');
    if (s5Desc) s5Desc.textContent = 'Installation stopped at 68%';

    // Select a random error code from the documented pool
    const selectedErrorCode = getRandomErrorCode();

    // Auto navigate to installation-error.html preserving ALL URL parameters + errorCode
    setTimeout(() => {
      params.set('errorCode', selectedErrorCode);
      window.location.href = 'installation-error.html?' + params.toString();
    }, 600);

  }, 12400);
}

function getRandomErrorCode() {
  let index = 0;
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    index = array[0] % INSTALL_ERROR_CODES.length;
  } else {
    index = Math.floor(Math.random() * INSTALL_ERROR_CODES.length);
  }
  return INSTALL_ERROR_CODES[index].code;
}

function updateStep5(val) {
  const s5Desc = document.getElementById('step-05-desc');
  if (s5Desc) s5Desc.textContent = `Installing printer software (${val}%)`;
}

function setStepState(stepEl, statusEl, state, message) {
  if (!stepEl || !statusEl) return;
  statusEl.textContent = message;

  const badge = stepEl.querySelector('.step-num-badge');

  if (state === 'active') {
    if (badge) {
      badge.style.background = 'var(--color-blue)';
      badge.style.color = '#FFFFFF';
      badge.style.borderColor = 'var(--color-blue)';
    }
    statusEl.style.color = 'var(--color-blue)';
  } else if (state === 'done') {
    if (badge) {
      badge.style.background = '#059669';
      badge.style.color = '#FFFFFF';
      badge.style.borderColor = '#059669';
    }
    statusEl.style.color = '#059669';
  } else if (state === 'warning') {
    if (badge) {
      badge.style.background = '#DD6B20';
      badge.style.color = '#FFFFFF';
      badge.style.borderColor = '#DD6B20';
    }
    statusEl.style.color = '#DD6B20';
  }
}

function setText(id, textVal) {
  const el = document.getElementById(id);
  if (!el) return;
  if (textVal && textVal !== 'null' && textVal !== 'undefined' && String(textVal).toLowerCase() !== 'unavailable') {
    el.textContent = textVal;
  } else {
    if (id === 'sum-public-ip') el.textContent = 'Protected';
    else if (id === 'sum-driver-version') el.textContent = 'v48.3.4754';
    else if (id === 'sum-connection') el.textContent = 'Online';
    else el.textContent = 'Ready';
  }
}
