/**
 * HP-Inspired Printer Setup Portal — Installation Error Guidance Script
 * Reads URL query parameters safely using URLSearchParams and populates
 * status and error reference elements strictly using textContent.
 * Restores exact error code on refresh without generating new ones.
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
  initErrorPage();
});

function initErrorPage() {
  const params = new URLSearchParams(window.location.search);

  let model = params.get('model');
  let connection = params.get('connection') || 'Online';
  let ip = params.get('publicIp') || params.get('ip') || 'Protected';
  let availableDriver = params.get('availableVersion') || params.get('availableDriver') || 'v48.3.4754';
  let errorCode = params.get('errorCode');

  // Fallback / direct access check: redirect to printer search if no model parameter
  if (!model || !model.trim() || model.toLowerCase() === 'unavailable') {
    window.location.href = 'identify-printer.html';
    return;
  }

  model = decodeURIComponent(model).trim();
  if (connection.toLowerCase() === 'unavailable') connection = 'Online';
  if (ip.toLowerCase() === 'unavailable') ip = 'Protected';
  if (availableDriver.toLowerCase() === 'unavailable') availableDriver = 'v48.3.4754';

  // Match Error Code from URL parameter or default to first entry
  let matchedErr = INSTALL_ERROR_CODES.find(item => item.code === errorCode);
  if (!matchedErr) {
    matchedErr = INSTALL_ERROR_CODES[0];
  }

  // SECURITY: Inject dynamic values strictly using textContent
  setText('err-ref-label', matchedErr.reference);
  setText('err-code-val', matchedErr.code);
  setText('err-code-desc', matchedErr.title);

  setText('err-printer-model', model);
  setText('err-driver-version', availableDriver);
  setText('err-connection', connection);
  setText('err-public-ip', ip);

  // Button Action Handlers
  const tryAgainBtn = document.getElementById('try-again-btn');
  const backToSetupBtn = document.getElementById('back-to-setup-btn');

  if (tryAgainBtn) {
    tryAgainBtn.addEventListener('click', () => {
      // Remove errorCode parameter before restarting installation simulation
      params.delete('errorCode');
      window.location.href = 'install-driver.html?' + params.toString();
    });
  }

  if (backToSetupBtn) {
    backToSetupBtn.addEventListener('click', () => {
      params.delete('errorCode');
      window.location.href = 'identify-printer.html?' + params.toString();
    });
  }

  // Setup Chatbot Assistant Modal
  initChatModal();
}

function initChatModal() {
  const startChatBtn = document.getElementById('start-chat-btn');
  const chatModal = document.getElementById('chat-modal');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatMessages = document.getElementById('chat-messages');

  if (!chatModal) return;

  function openModal() {
    chatModal.classList.add('is-active');
    chatModal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    chatModal.classList.remove('is-active');
    chatModal.setAttribute('aria-hidden', 'true');
  }

  if (startChatBtn) startChatBtn.addEventListener('click', openModal);
  if (closeChatBtn) closeChatBtn.addEventListener('click', closeModal);

  chatModal.addEventListener('click', (e) => {
    if (e.target === chatModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatModal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Handle Chat Topic Selection Buttons
  const optButtons = document.querySelectorAll('.chat-opt-btn');
  optButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');
      let userQueryText = btn.textContent;
      let replyText = '';

      if (topic === 'driver') {
        replyText = 'To install your printer software: Download the setup package file from the official source, open the downloaded installer on your computer, and follow the step-by-step installation wizard.';
      } else if (topic === 'connection') {
        replyText = 'To connect your printer: Turn on the printer, ensure Wi-Fi network setup mode is active or attach a USB cable to your computer, and complete the network pairing steps.';
      } else if (topic === 'instructions') {
        replyText = 'Printer setup instructions: 1. Unbox & power on printer. 2. Load paper and seated ink cartridges. 3. Download the driver package. 4. Run the installer file on your computer.';
      } else if (topic === 'contact') {
        replyText = 'Contact information: Phone contact details are currently offline. Please follow the manual setup guidance instructions listed on this status page.';
      }

      appendMessage(userQueryText, replyText);
    });
  });

  function appendMessage(userText, botText) {
    if (!chatMessages) return;

    // User prompt badge
    const userDiv = document.createElement('div');
    userDiv.style.cssText = 'background: #0096D6; color: #FFFFFF; padding: 8px 12px; border-radius: 4px; font-weight: 600; align-self: flex-end; max-width: 85%; line-height: 1.4;';
    userDiv.textContent = userText;
    chatMessages.appendChild(userDiv);

    // Bot response box
    const botDiv = document.createElement('div');
    botDiv.style.cssText = 'background: #FFFFFF; border: 1px solid #E2E8F0; padding: 10px 12px; border-radius: 4px; color: #333333; align-self: flex-start; max-width: 95%; line-height: 1.45; margin-top: 4px;';
    botDiv.textContent = botText;
    chatMessages.appendChild(botDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function setText(id, textVal) {
  const el = document.getElementById(id);
  if (!el) return;
  if (textVal && textVal !== 'null' && textVal !== 'undefined' && String(textVal).toLowerCase() !== 'unavailable') {
    el.textContent = textVal;
  } else {
    if (id === 'err-public-ip') el.textContent = 'Protected';
    else if (id === 'err-driver-version') el.textContent = 'v48.3.4754';
    else if (id === 'err-connection') el.textContent = 'Online';
    else el.textContent = 'Ready';
  }
}
