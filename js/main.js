/**
 * HP-Inspired Printer Setup & Driver Portal — Main Script
 * Handles sticky corporate header, mobile drawer navigation,
 * single-panel accordion, and interactive diagnostic card triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initAccordion();
  initFixCardModal();
});

/**
 * Sticky Corporate Header Scroll Effect
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (!toggleBtn || !mobileNav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('is-open');
    if (isOpen) {
      mobileNav.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileNav.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close menu when a link inside mobile drawer is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Accordion System (One panel expanded at a time)
 */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const headerBtn = item.querySelector('.accordion-header');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close other panels
      items.forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          const btn = other.querySelector('.accordion-header');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current panel
      if (isOpen) {
        item.classList.remove('is-open');
        headerBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        headerBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Fix Card Diagnostic Modal Integration
 */
const FIX_STEPS_DATA = {
  'power': {
    title: 'Check Power Connection',
    steps: [
      'Verify the power cable is firmly attached to the back of the printer.',
      'Plug directly into an unswitched electrical outlet (avoid ungrounded power strips).',
      'Press the power button on the printer panel and ensure the status light stays solid.'
    ]
  },
  'errors': {
    title: 'Check Display Error Messages',
    steps: [
      'Examine the printer front panel screen for specific numerical or text error codes.',
      'Check if ink/toner or paper lights are flashing on the control console.',
      'Refer to your printer model manual to resolve active door or cartridge alerts.'
    ]
  },
  'connection': {
    title: 'Check Network & Wireless Connection',
    steps: [
      'Ensure your computer and printer are connected to the same Wi-Fi network (2.4GHz band).',
      'If using USB, disconnect and re-insert the USB cable into a direct computer USB port.',
      'Restart your wireless router and printer to refresh assigned IP addresses.'
    ]
  },
  'supplies': {
    title: 'Check Ink or Toner Supplies',
    steps: [
      'Open the printer access door and check ink/toner level indicators.',
      'Ensure all protective orange tape or plastic caps are removed from new cartridges.',
      'Reseat cartridges firmly until they click into their respective slots.'
    ]
  },
  'paper': {
    title: 'Check Paper Tray & Path',
    steps: [
      'Load clean, un-bent plain paper into the input tray and align the paper guides.',
      'Open the rear or lower access panel to inspect and gently clear jammed paper.',
      'Avoid overfilling the paper tray past the maximum fill mark line.'
    ]
  },
  'restart': {
    title: 'Restart Print Spooler Service',
    steps: [
      'Turn off the printer, wait 30 seconds, and turn it back on.',
      'In Windows, open Services app, scroll to "Print Spooler", right-click and select Restart.',
      'Cancel stuck print queue jobs before sending a new print request.'
    ]
  },
  'software': {
    title: 'Update Driver Software',
    steps: [
      'Identify your printer model using the Identify tool.',
      'Download and run the latest driver installation package for your OS version.',
      'Restart your computer after driver installation completes.'
    ]
  },
  'testpage': {
    title: 'Print Diagnostic Test Page',
    steps: [
      'Open Printers & Scanners in your operating system control panel.',
      'Select your printer model, click Manage -> Print a test page.',
      'Inspect test page colors and text sharpness to confirm alignment.'
    ]
  }
};

function initFixCardModal() {
  const cards = document.querySelectorAll('.trouble-item-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const fixKey = card.getAttribute('data-fix');
      const data = FIX_STEPS_DATA[fixKey];
      if (!data) return;

      // Show alert or scroll to setup guide with feedback
      const identifyUrl = `identify-printer.html`;
      window.location.href = identifyUrl;
    });
  });
}
