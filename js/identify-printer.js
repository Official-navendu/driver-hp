/**
 * HP-Inspired Printer Setup & Driver Portal — Identification Script
 * Refined Product Setup Flow with user-facing fallbacks, drawers, IPv6 copy, and DOM safety.
 */

document.addEventListener('DOMContentLoaded', () => {
  initIdentifyTool();
});

function initIdentifyTool() {
  const form = document.getElementById('identify-form');
  const modelInput = document.getElementById('printer-model-control');
  const errorNotice = document.getElementById('error-notice');

  const formPanel = document.getElementById('initial-form-panel');
  const loaderPanel = document.getElementById('in-place-loader-panel');
  const resultPanel = document.getElementById('in-place-result-panel');

  const updateDriverBtn = document.getElementById('update-driver-btn');
  const changePrinterBtn = document.getElementById('change-printer-btn');

  const helpToggle = document.getElementById('help-toggle-btn');
  const helpBox = document.getElementById('help-reveal-box');
  const exampleBtns = document.querySelectorAll('.model-link-btn');

  // Drawers
  const driverDrawer = document.getElementById('driver-details-drawer');
  const openDriverDrawerBtn = document.getElementById('open-driver-drawer-btn');
  const closeDriverDrawerBtn = document.getElementById('close-driver-drawer-btn');
  const drawerUpdateBtn = document.getElementById('drawer-update-btn');

  const networkDrawer = document.getElementById('network-details-drawer');
  const openNetworkDrawerBtn = document.getElementById('open-network-drawer-btn');
  const closeNetworkDrawerBtn = document.getElementById('close-network-drawer-btn');
  const closeNetDrwAction = document.getElementById('close-net-drw-action');

  const copyIpBtn = document.getElementById('copy-ip-btn');
  const netDrwCopyIpBtn = document.getElementById('net-drw-copy-ip-btn');

  let currentFullIp = 'Unavailable';

  if (!form || !modelInput) return;

  // Handle Example Model Links
  exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modelVal = btn.getAttribute('data-model');
      if (modelVal) {
        modelInput.value = modelVal;
        clearError();
      }
    });
  });

  // Handle Expandable Help Toggle
  if (helpToggle && helpBox) {
    helpToggle.addEventListener('click', () => {
      const isOpen = helpBox.classList.contains('is-open');
      if (isOpen) {
        helpBox.classList.remove('is-open');
        helpToggle.setAttribute('aria-expanded', 'false');
      } else {
        helpBox.classList.add('is-open');
        helpToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // --- DRAWER MANAGEMENT ---
  function openDrawer(drawerEl) {
    if (!drawerEl) return;
    drawerEl.classList.add('is-open');
    drawerEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(drawerEl) {
    if (!drawerEl) return;
    drawerEl.classList.remove('is-open');
    drawerEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Driver Details Drawer Handlers
  if (openDriverDrawerBtn) {
    openDriverDrawerBtn.addEventListener('click', () => {
      const currentModel = getModelFromUrl() || modelInput.value.trim() || 'HP LaserJet Pro M404dn';
      const systemInfo = detectSystem();
      const driverData = getDriverInfo(currentModel, systemInfo.os.value);
      populateDriverDrawer(currentModel, driverData);
      openDrawer(driverDrawer);
    });
  }

  if (closeDriverDrawerBtn) closeDriverDrawerBtn.addEventListener('click', () => closeDrawer(driverDrawer));
  if (drawerUpdateBtn) {
    drawerUpdateBtn.addEventListener('click', () => {
      closeDrawer(driverDrawer);
      if (updateDriverBtn) updateDriverBtn.click();
    });
  }

  if (driverDrawer) {
    driverDrawer.addEventListener('click', (e) => {
      if (e.target === driverDrawer) closeDrawer(driverDrawer);
    });
  }

  // Network Details Drawer Handlers
  if (openNetworkDrawerBtn) {
    openNetworkDrawerBtn.addEventListener('click', () => {
      openDrawer(networkDrawer);
    });
  }

  if (closeNetworkDrawerBtn) closeNetworkDrawerBtn.addEventListener('click', () => closeDrawer(networkDrawer));
  if (closeNetDrwAction) closeNetDrwAction.addEventListener('click', () => closeDrawer(networkDrawer));

  if (networkDrawer) {
    networkDrawer.addEventListener('click', (e) => {
      if (e.target === networkDrawer) closeDrawer(networkDrawer);
    });
  }

  // Universal Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (driverDrawer && driverDrawer.classList.contains('is-open')) closeDrawer(driverDrawer);
      if (networkDrawer && networkDrawer.classList.contains('is-open')) closeDrawer(networkDrawer);
    }
  });

  // --- COPY PUBLIC IP FUNCTIONALITY ---
  function handleCopyIP(buttonEl) {
    if (!currentFullIp || currentFullIp === 'Unavailable') {
      showCopyToast(buttonEl, 'Copy unavailable');
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentFullIp)
        .then(() => showCopyToast(buttonEl, 'Copied'))
        .catch(() => fallbackCopyText(currentFullIp, buttonEl));
    } else {
      fallbackCopyText(currentFullIp, buttonEl);
    }
  }

  function fallbackCopyText(text, buttonEl) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showCopyToast(buttonEl, 'Copied');
    } catch (e) {
      showCopyToast(buttonEl, 'Copy unavailable');
    }
  }

  function showCopyToast(btn, text) {
    if (!btn) return;
    const origText = btn.textContent;
    btn.textContent = text;
    btn.style.color = 'var(--color-blue)';
    setTimeout(() => {
      btn.textContent = origText;
      btn.style.color = '';
    }, 1500);
  }

  if (copyIpBtn) copyIpBtn.addEventListener('click', () => handleCopyIP(copyIpBtn));
  if (netDrwCopyIpBtn) netDrwCopyIpBtn.addEventListener('click', () => handleCopyIP(netDrwCopyIpBtn));

  // Listen for window live online / offline events
  window.addEventListener('online', updateLiveConnectionStatus);
  window.addEventListener('offline', updateLiveConnectionStatus);

  // Check URL Parameters on Page Load
  const urlParams = new URLSearchParams(window.location.search);
  const initialModel = urlParams.get('model');
  const hasFullParams = urlParams.get('availableDriver') || urlParams.get('driverStatus');

  if (initialModel) {
    modelInput.value = initialModel;
    if (hasFullParams) {
      renderSetupResultFromUrlParams(urlParams);
    } else {
      run5StepLoaderSequence(initialModel);
    }
  } else {
    switchLeftState('form');
  }

  // Form Submission Event
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawVal = modelInput.value.trim();

    if (!rawVal || rawVal.length < 2) {
      showError('Please enter your printer model number.');
      return;
    }

    clearError();

    // PushState URL Update immediately on submit
    const params = new URLSearchParams();
    params.set('model', rawVal);
    const targetUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState({ model: rawVal }, '', targetUrl);

    // Run 5-Step In-Place Setup Checks (~10.1s total visual duration)
    run5StepLoaderSequence(rawVal);
  });

  modelInput.addEventListener('input', () => {
    if (modelInput.value.trim().length >= 2) {
      clearError();
    }
  });

  // Final "Continue to driver setup" CTA Handler — Navigate preserving query parameters
  if (updateDriverBtn) {
    updateDriverBtn.addEventListener('click', () => {
      const activeModel = getModelFromUrl() || modelInput.value.trim();
      if (!activeModel) return;

      const currentParams = new URLSearchParams(window.location.search);
      window.location.href = `install-driver.html?${currentParams.toString()}`;
    });
  }

  // "Change printer" Reset Button
  if (changePrinterBtn) {
    changePrinterBtn.addEventListener('click', () => {
      modelInput.value = '';
      clearError();
      history.pushState({}, '', window.location.pathname);
      switchLeftState('form');
    });
  }

  // Handle Browser Navigation (Popstate)
  window.addEventListener('popstate', () => {
    const popParams = new URLSearchParams(window.location.search);
    const popModel = popParams.get('model');
    const popHasFull = popParams.get('availableDriver');

    if (popModel) {
      modelInput.value = popModel;
      if (popHasFull) {
        renderSetupResultFromUrlParams(popParams);
      } else {
        run5StepLoaderSequence(popModel);
      }
    } else {
      switchLeftState('form');
    }
  });

  function switchLeftState(stateName) {
    if (formPanel) formPanel.classList.remove('active');
    if (loaderPanel) loaderPanel.classList.remove('active');
    if (resultPanel) resultPanel.classList.remove('active');

    if (stateName === 'form' && formPanel) formPanel.classList.add('active');
    if (stateName === 'loader' && loaderPanel) loaderPanel.classList.add('active');
    if (stateName === 'result' && resultPanel) resultPanel.classList.add('active');
  }

  function showError(msg) {
    modelInput.classList.add('input-error');
    if (errorNotice) {
      errorNotice.textContent = msg;
      errorNotice.classList.add('is-visible');
    }
  }

  function clearError() {
    modelInput.classList.remove('input-error');
    if (errorNotice) {
      errorNotice.classList.remove('is-visible');
    }
  }

  function updateLiveConnectionStatus() {
    const resConnection = document.getElementById('res-connection');
    const netDrwConn = document.getElementById('net-drw-connection');
    const connStr = window.navigator.onLine ? 'Online' : 'Offline';
    if (resConnection) resConnection.textContent = connStr;
    if (netDrwConn) netDrwConn.textContent = connStr;
  }

  /**
   * Run 5-Step In-Place Setup Checks (~10.1s Total Visual Duration)
   */
  async function run5StepLoaderSequence(model) {
    switchLeftState('loader');

    const loaderModelSpan = document.getElementById('loader-model-name');
    if (loaderModelSpan) loaderModelSpan.textContent = model;

    const fillBar = document.getElementById('loader-bar-fill');
    const step1 = document.getElementById('loader-step-1');
    const step2 = document.getElementById('loader-step-2');
    const step3 = document.getElementById('loader-step-3');
    const step4 = document.getElementById('loader-step-4');
    const step5 = document.getElementById('loader-step-5');

    const sub1 = document.getElementById('step-1-subtext');
    const sub2 = document.getElementById('step-2-subtext');
    const sub3 = document.getElementById('step-3-subtext');
    const sub4 = document.getElementById('step-4-subtext');
    const sub5 = document.getElementById('step-5-subtext');

    if (fillBar) fillBar.style.width = '0%';
    resetStep(step1); resetStep(step2); resetStep(step3); resetStep(step4); resetStep(step5);

    // Trigger asynchronous public IP fetch
    const publicIpPromise = getPublicIP();

    // Step 01 — Identify printer (2000ms)
    setStepActive(step1);
    if (fillBar) fillBar.style.width = '20%';
    if (sub1) sub1.textContent = 'Reading printer model...';

    await sleep(2000);
    setStepCompleted(step1);
    if (sub1) sub1.textContent = '✓ Printer model identified';

    // Step 02 — Check driver (2400ms)
    setStepActive(step2);
    if (fillBar) fillBar.style.width = '40%';
    if (sub2) sub2.textContent = 'Checking available driver information...';

    await sleep(2400);
    setStepCompleted(step2);
    if (sub2) sub2.textContent = '✓ Driver catalog information retrieved';

    // Step 03 — Identify system (1800ms)
    setStepActive(step3);
    if (fillBar) fillBar.style.width = '60%';
    if (sub3) sub3.textContent = 'Identifying operating system & device category...';

    const systemInfo = detectSystem();
    await sleep(1800);
    setStepCompleted(step3);
    if (sub3) sub3.textContent = `✓ ${systemInfo.os.value} (${systemInfo.device.value}) detected`;

    // Step 04 — Check connection (2100ms)
    setStepActive(step4);
    if (fillBar) fillBar.style.width = '80%';
    if (sub4) sub4.textContent = 'Checking network status & public IP...';

    const networkInfo = detectNetwork();
    const publicIpData = await publicIpPromise;
    await sleep(2100);
    setStepCompleted(step4);
    if (sub4) sub4.textContent = `✓ Network status ${networkInfo.online.value}`;

    // Step 05 — Match setup (1800ms)
    setStepActive(step5);
    if (fillBar) fillBar.style.width = '100%';
    if (sub5) sub5.textContent = 'Matching printer software with your detected environment...';

    const driverInfo = getDriverInfo(model, systemInfo.os.value);
    const installedDriver = getInstalledDriver();

    await sleep(1800);
    setStepCompleted(step5);
    if (sub5) sub5.textContent = '✓ Setup parameters matched';

    await sleep(300);

    // Complete data object
    const finalData = {
      model: model,
      modelCode: driverInfo.modelCode,
      os: systemInfo.os.value,
      device: systemInfo.device.value,
      browser: systemInfo.browser.value,
      connection: networkInfo.online.value,
      network: networkInfo.type.value,
      ip: publicIpData.value,
      effectiveConn: networkInfo.effectiveType.value,
      latency: networkInfo.rtt.value,
      downlink: networkInfo.downlink.value,
      currentDriver: installedDriver.value,
      availableDriver: driverInfo.version,
      driverStatus: driverInfo.status,
      releaseDate: driverInfo.releaseDate,
      packageName: driverInfo.packageName,
      packageSize: driverInfo.packageSize,
      supportedOS: driverInfo.supportedOS,
      packageType: driverInfo.packageType,
      releaseNotes: driverInfo.releaseNotes,
      includedComponents: driverInfo.includedComponents,
      installationNotes: driverInfo.installationNotes,
      driverAvailable: driverInfo.available
    };

    // Update URL query parameters
    updateURL(finalData);

    // Render Refined Setup Ready Summary
    renderSetupResult(finalData);
  }

  function resetStep(el) { if (el) el.className = 'loader-step-row'; }
  function setStepActive(el) { if (el) el.className = 'loader-step-row active'; }
  function setStepCompleted(el) { if (el) el.className = 'loader-step-row done'; }
  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  function updateURL(data) {
    const params = new URLSearchParams();
    params.set('model', data.model || 'HP LaserJet Pro M404dn');
    params.set('os', data.os || 'unavailable');
    params.set('device', data.device || 'unavailable');
    params.set('browser', data.browser || 'unavailable');
    params.set('connection', data.connection || 'unavailable');
    params.set('network', data.network || 'unavailable');
    params.set('ip', data.ip || 'unavailable');
    params.set('effectiveConn', data.effectiveConn || 'unavailable');
    params.set('latency', data.latency || 'unavailable');
    params.set('downlink', data.downlink || 'unavailable');
    params.set('currentDriver', data.currentDriver || 'unavailable');
    params.set('availableDriver', data.availableDriver || 'unavailable');
    params.set('driverStatus', data.driverStatus || 'unavailable');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState(data, '', newUrl);
  }

  /**
   * Render Compact Setup Ready Summary Panel safely with textContent
   */
  function renderSetupResult(data) {
    switchLeftState('result');
    currentFullIp = data.ip || 'Unavailable';

    // 1. Printer Block
    setText('res-printer-name', data.model);
    setText('res-model-code', data.modelCode);
    setText('res-printer-driver-status', data.driverStatus);

    // 2. System Block
    setText('res-os', data.os);
    setText('res-device', data.device);
    setText('res-browser', data.browser);

    // 3. Network Block
    setText('res-connection', data.connection);
    setText('res-network-type', data.network);
    renderTruncatedIP('res-public-ip-truncated', currentFullIp);

    // 4. Driver Block & Horizontal Strip
    setText('res-current-driver-ver', data.currentDriver);
    setText('res-available-driver-ver', data.availableDriver);
    setText('res-driver-status-badge', data.driverStatus === 'Package available' ? 'PACKAGE AVAILABLE' : 'PACKAGE AVAILABLE');

    setText('res-cmp-current', data.currentDriver);
    setText('res-cmp-available', data.availableDriver);
    setText('res-cmp-status', 'PACKAGE AVAILABLE');

    // Compact Meta Line
    setText('res-meta-release', data.releaseDate);
    setText('res-meta-size', data.packageSize);
    setText('res-meta-type', data.packageType || 'Full Software Solution');

    // Populate Network Details Drawer
    setText('net-drw-connection', data.connection);
    setText('net-drw-type', data.network);
    setText('net-drw-ip-full', currentFullIp);
    setText('net-drw-effective', data.effectiveConn);
    setText('net-drw-rtt', data.latency);
    setText('net-drw-downlink', data.downlink);

    // Populate Driver Details Drawer
    populateDriverDrawer(data.model, data);
  }

  function renderTruncatedIP(id, fullIpStr) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!fullIpStr || fullIpStr === 'Unavailable') {
      el.textContent = 'Unavailable';
      return;
    }

    // Truncate long IPv6 strings cleanly
    if (fullIpStr.length > 18) {
      el.textContent = `${fullIpStr.substring(0, 16)}...`;
      el.title = fullIpStr;
    } else {
      el.textContent = fullIpStr;
    }
  }

  function populateDriverDrawer(modelName, driverData) {
    setText('drw-title', driverData.packageName || 'HP LaserJet Full Software Solution');
    setText('drw-version', driverData.version || driverData.availableDriver);
    setText('drw-release-date', driverData.releaseDate);
    setText('drw-package-size', driverData.packageSize);
    setText('drw-supported-os', driverData.supportedOS || driverData.os || 'Windows');
    setText('drw-package-type', driverData.packageType || 'Full Software Solution');
    setText('drw-model', modelName);
    setText('drw-model-code', driverData.modelCode || 'W1A53A');

    // Numbered Included Components List
    const compContainer = document.getElementById('drw-components-list');
    if (compContainer) {
      compContainer.innerHTML = '';
      if (Array.isArray(driverData.includedComponents) && driverData.includedComponents.length > 0) {
        driverData.includedComponents.forEach((item, idx) => {
          const div = document.createElement('div');
          div.className = 'component-item';

          const numSpan = document.createElement('span');
          numSpan.className = 'comp-num';
          numSpan.textContent = String(idx + 1).padStart(2, '0');

          const bodyDiv = document.createElement('div');
          const titleH5 = document.createElement('h5');
          titleH5.className = 'comp-title';
          titleH5.textContent = item.title || `Component ${idx + 1}`;

          const descP = document.createElement('p');
          descP.className = 'comp-desc';
          descP.textContent = item.desc || '';

          bodyDiv.appendChild(titleH5);
          bodyDiv.appendChild(descP);

          div.appendChild(numSpan);
          div.appendChild(bodyDiv);

          compContainer.appendChild(div);
        });
      } else {
        const p = document.createElement('p');
        p.style.fontSize = '14px';
        p.style.color = '#5F6368';
        p.textContent = 'Included components information is not available in the current driver catalog.';
        compContainer.appendChild(p);
      }
    }

    // Release Notes List
    const notesList = document.getElementById('drw-release-notes-list');
    if (notesList) {
      notesList.innerHTML = '';
      if (Array.isArray(driverData.releaseNotes) && driverData.releaseNotes.length > 0) {
        driverData.releaseNotes.forEach(noteText => {
          const li = document.createElement('li');
          li.textContent = noteText;
          notesList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'Release notes: Unavailable';
        notesList.appendChild(li);
      }
    }

    // Installation Notes List
    const installList = document.getElementById('drw-install-notes-list');
    if (installList) {
      installList.innerHTML = '';
      if (Array.isArray(driverData.installationNotes) && driverData.installationNotes.length > 0) {
        driverData.installationNotes.forEach(noteText => {
          const li = document.createElement('li');
          li.textContent = noteText;
          installList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'Installation notes: Unavailable';
        installList.appendChild(li);
      }
    }
  }

  function renderSetupResultFromUrlParams(params) {
    const model = params.get('model') || 'HP LaserJet Pro M404dn';
    const os = params.get('os') || 'Windows';
    const driverInfo = getDriverInfo(model, os);

    const data = {
      model: model,
      modelCode: driverInfo.modelCode,
      os: os,
      device: params.get('device') || 'Desktop',
      browser: params.get('browser') || 'Chrome',
      connection: params.get('connection') || 'Online',
      network: params.get('network') || 'Unavailable',
      ip: params.get('ip') || 'Unavailable',
      effectiveConn: params.get('effectiveConn') || 'Unavailable',
      latency: params.get('latency') || 'Unavailable',
      downlink: params.get('downlink') || 'Unavailable',
      currentDriver: params.get('currentDriver') || 'Unavailable',
      availableDriver: params.get('availableDriver') || driverInfo.version,
      driverStatus: params.get('driverStatus') || driverInfo.status,
      releaseDate: driverInfo.releaseDate,
      packageName: driverInfo.packageName,
      packageSize: driverInfo.packageSize,
      supportedOS: driverInfo.supportedOS,
      packageType: driverInfo.packageType,
      releaseNotes: driverInfo.releaseNotes,
      includedComponents: driverInfo.includedComponents,
      installationNotes: driverInfo.installationNotes,
      driverAvailable: driverInfo.available
    };

    renderSetupResult(data);
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

  function getModelFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('model');
    return m ? decodeURIComponent(m).trim() : null;
  }
}

/**
 * System Detection via browser APIs
 */
function detectSystem() {
  const ua = window.navigator.userAgent || '';
  const platform = window.navigator.platform || '';

  let osValue = 'Unavailable';
  if (ua.indexOf('Win') !== -1 || platform.indexOf('Win') !== -1) osValue = 'Windows';
  else if (ua.indexOf('Mac') !== -1 || platform.indexOf('Mac') !== -1) osValue = 'macOS';
  else if (ua.indexOf('CrOS') !== -1) osValue = 'ChromeOS';
  else if (ua.indexOf('Android') !== -1) osValue = 'Android';
  else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) osValue = 'iOS';
  else if (ua.indexOf('Linux') !== -1 || platform.indexOf('Linux') !== -1) osValue = 'Linux';

  let deviceValue = 'Desktop';
  if (osValue === 'iOS' || osValue === 'Android') {
    if (ua.indexOf('iPad') !== -1 || ua.indexOf('Tablet') !== -1) {
      deviceValue = 'Tablet';
    } else {
      deviceValue = 'Mobile device';
    }
  } else {
    // Default to Desktop when laptop vs desktop cannot be distinguished
    deviceValue = 'Desktop';
  }

  let browserValue = 'Unavailable';
  if (ua.indexOf('Edg') !== -1) browserValue = 'Edge';
  else if (ua.indexOf('OPR') !== -1 || ua.indexOf('Opera') !== -1) browserValue = 'Opera';
  else if (ua.indexOf('Chrome') !== -1) browserValue = 'Chrome';
  else if (ua.indexOf('Safari') !== -1) browserValue = 'Safari';
  else if (ua.indexOf('Firefox') !== -1) browserValue = 'Firefox';

  return {
    os: { available: osValue !== 'Unavailable', value: osValue, source: 'navigator.userAgent' },
    device: { available: true, value: deviceValue, source: 'browser' },
    browser: { available: browserValue !== 'Unavailable', value: browserValue, source: 'navigator.userAgent' }
  };
}

/**
 * Network Information via browser APIs
 */
function detectNetwork() {
  const isOnline = window.navigator.onLine !== false;

  const conn = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;

  let typeVal = 'Unavailable';
  let effVal = 'Unavailable';
  let rttVal = 'Unavailable';
  let downlinkVal = 'Unavailable';

  if (conn) {
    if (conn.type) {
      if (conn.type === 'wifi') typeVal = 'Wi-Fi';
      else if (conn.type === 'ethernet') typeVal = 'Ethernet';
      else if (conn.type === 'cellular') typeVal = 'Cellular';
      else typeVal = String(conn.type);
    }
    if (conn.effectiveType) {
      effVal = String(conn.effectiveType).toUpperCase();
    }
    if (typeof conn.rtt === 'number') {
      rttVal = `${conn.rtt} ms`;
    }
    if (typeof conn.downlink === 'number') {
      downlinkVal = `${conn.downlink} Mbps`;
    }
  }

  return {
    online: { available: true, value: isOnline ? 'Online' : 'Offline', source: 'navigator.onLine' },
    type: { available: typeVal !== 'Unavailable', value: typeVal, source: 'navigator.connection' },
    effectiveType: { available: effVal !== 'Unavailable', value: effVal, source: 'navigator.connection' },
    rtt: { available: rttVal !== 'Unavailable', value: rttVal, source: 'navigator.connection' },
    downlink: { available: downlinkVal !== 'Unavailable', value: downlinkVal, source: 'navigator.connection' }
  };
}

/**
 * Public IP via ipify CORS API with 3.5s AbortController timeout
 */
async function getPublicIP() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch('https://api64.ipify.org?format=json', {
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('IP request failed');
    }

    const data = await response.json();
    if (data && data.ip) {
      return {
        available: true,
        value: String(data.ip).trim(),
        source: 'ipify'
      };
    }

    return {
      available: false,
      value: 'Unavailable',
      source: 'ipify'
    };
  } catch (err) {
    return {
      available: false,
      value: 'Unavailable',
      source: 'browser'
    };
  }
}

/**
 * Installed Driver Inspection Check
 */
function getInstalledDriver() {
  return {
    available: false,
    value: 'Unavailable',
    source: 'browser'
  };
}
