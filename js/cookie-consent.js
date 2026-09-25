/**
 * Printer Setup Portal — Centralized Cookie Consent & Preferences System
 * Manages privacy choices, localStorage persistence, banner UI, preferences modal,
 * and accessible keyboard interaction.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'printer_setup_cookie_consent_v1';
  const CURRENT_VERSION = '1';

  // Default consent state
  const defaultConsent = {
    essential: true,
    analytics: false,
    advertising: false,
    timestamp: null,
    version: CURRENT_VERSION
  };

  let consentData = null;

  /**
   * Helper to get stored consent from localStorage or null
   */
  function getStoredConsent() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (parsed && parsed.version === CURRENT_VERSION) {
        return parsed;
      }
    } catch (e) {
      console.warn('Cookie consent localStorage error:', e);
    }
    return null;
  }

  /**
   * Helper to save consent object
   */
  function saveConsent(data) {
    const payload = {
      essential: true,
      analytics: Boolean(data.analytics),
      advertising: Boolean(data.advertising),
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Unable to save cookie consent:', e);
    }
    consentData = payload;

    // Dispatch event for any script listeners
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: payload }));
  }

  /**
   * Main Initialization
   */
  function initCookieConsent() {
    consentData = getStoredConsent();

    injectBannerMarkup();
    injectModalMarkup();
    bindEvents();

    if (!consentData) {
      showBanner();
    } else {
      hideBanner();
    }
  }

  /**
   * Inject Consent Banner DOM
   */
  function injectBannerMarkup() {
    if (document.getElementById('cookie-consent-banner')) return;

    const bannerHtml = `
      <div id="cookie-consent-banner" class="cookie-banner-wrapper" role="region" aria-label="Cookie Consent Banner">
        <div class="cookie-banner-container">
          <div class="cookie-banner-content">
            <h2 class="cookie-banner-title">
              <svg class="cookie-banner-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Cookies &amp; Privacy
            </h2>
            <p class="cookie-banner-desc">
              We use cookies and similar technologies to help keep this website working, understand how visitors use our pages, and improve the website experience. Where applicable, certain technologies may also be used for advertising and measurement.
            </p>
            <a href="cookie-policy.html" class="cookie-policy-link">Read our Cookie Policy &rarr;</a>
          </div>
          <div class="cookie-btn-group">
            <button type="button" id="cookie-btn-accept-all" class="cookie-btn cookie-btn-primary">Accept All</button>
            <button type="button" id="cookie-btn-reject-nonessential" class="cookie-btn cookie-btn-secondary">Reject Non-Essential</button>
            <button type="button" id="cookie-btn-manage-prefs" class="cookie-btn cookie-btn-text">Manage Preferences</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHtml);
  }

  /**
   * Inject Preferences Modal DOM
   */
  function injectModalMarkup() {
    if (document.getElementById('cookie-preferences-modal')) return;

    const modalHtml = `
      <div id="cookie-preferences-modal" class="cookie-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-heading">
        <div class="cookie-modal-dialog">
          <div class="cookie-modal-header">
            <div class="cookie-modal-title-group">
              <h3 id="cookie-modal-heading">Cookie Preferences</h3>
              <p>Choose which optional technologies you would like to allow.</p>
            </div>
            <button type="button" id="cookie-modal-close" class="cookie-modal-close-btn" aria-label="Close Cookie Preferences">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="cookie-modal-body">
            <!-- ESSENTIAL CATEGORY -->
            <div class="cookie-category-card">
              <div class="cookie-category-header">
                <span class="cookie-category-name">
                  Essential
                  <span class="cookie-badge-locked">Always active</span>
                </span>
                <label class="cookie-switch">
                  <input type="checkbox" id="cookie-opt-essential" checked disabled aria-label="Essential Cookies (Always Active)">
                  <span class="cookie-slider" aria-hidden="true"></span>
                </label>
              </div>
              <p class="cookie-category-desc">
                These cookies or technologies are required for core website functionality, security, navigation, and saving essential preferences.
              </p>
            </div>

            <!-- ANALYTICS CATEGORY -->
            <div class="cookie-category-card">
              <div class="cookie-category-header">
                <span class="cookie-category-name">Analytics</span>
                <label class="cookie-switch">
                  <input type="checkbox" id="cookie-opt-analytics" aria-label="Allow Analytics Cookies">
                  <span class="cookie-slider" aria-hidden="true"></span>
                </label>
              </div>
              <p class="cookie-category-desc">
                These technologies may help us understand how visitors use the website, such as which pages are viewed and how the website performs.
              </p>
            </div>

            <!-- ADVERTISING CATEGORY -->
            <div class="cookie-category-card">
              <div class="cookie-category-header">
                <span class="cookie-category-name">Advertising</span>
                <label class="cookie-switch">
                  <input type="checkbox" id="cookie-opt-advertising" aria-label="Allow Advertising Cookies">
                  <span class="cookie-slider" aria-hidden="true"></span>
                </label>
              </div>
              <p class="cookie-category-desc">
                Where advertising services are enabled, these technologies may be used to measure advertising performance or provide more relevant advertising experiences.
              </p>
            </div>
          </div>

          <div class="cookie-modal-footer">
            <button type="button" id="cookie-modal-reject" class="cookie-btn cookie-btn-secondary">Reject Non-Essential</button>
            <button type="button" id="cookie-modal-save" class="cookie-btn cookie-btn-primary">Save Preferences</button>
            <button type="button" id="cookie-modal-accept" class="cookie-btn cookie-btn-text">Accept All</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  /**
   * Bind Button and Trigger Events
   */
  function bindEvents() {
    const banner = document.getElementById('cookie-consent-banner');
    const modal = document.getElementById('cookie-preferences-modal');

    // Banner buttons
    const btnAcceptAll = document.getElementById('cookie-btn-accept-all');
    const btnRejectNonessential = document.getElementById('cookie-btn-reject-nonessential');
    const btnManagePrefs = document.getElementById('cookie-btn-manage-prefs');

    if (btnAcceptAll) {
      btnAcceptAll.addEventListener('click', () => {
        saveConsent({ analytics: true, advertising: true });
        hideBanner();
      });
    }

    if (btnRejectNonessential) {
      btnRejectNonessential.addEventListener('click', () => {
        saveConsent({ analytics: false, advertising: false });
        hideBanner();
      });
    }

    if (btnManagePrefs) {
      btnManagePrefs.addEventListener('click', () => {
        openModal();
      });
    }

    // Modal buttons
    const modalClose = document.getElementById('cookie-modal-close');
    const modalSave = document.getElementById('cookie-modal-save');
    const modalReject = document.getElementById('cookie-modal-reject');
    const modalAccept = document.getElementById('cookie-modal-accept');

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (modalSave) {
      modalSave.addEventListener('click', () => {
        const analyticsVal = document.getElementById('cookie-opt-analytics').checked;
        const advertisingVal = document.getElementById('cookie-opt-advertising').checked;
        saveConsent({ analytics: analyticsVal, advertising: advertisingVal });
        closeModal();
        hideBanner();
      });
    }

    if (modalReject) {
      modalReject.addEventListener('click', () => {
        saveConsent({ analytics: false, advertising: false });
        closeModal();
        hideBanner();
      });
    }

    if (modalAccept) {
      modalAccept.addEventListener('click', () => {
        saveConsent({ analytics: true, advertising: true });
        closeModal();
        hideBanner();
      });
    }

    // Bind Footer Triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.cookie-settings-trigger, [data-action="cookie-settings"]');
      if (trigger) {
        e.preventDefault();
        openModal();
      }
    });

    // ESC key closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  function showBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.add('is-visible');
    }
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('is-visible');
    }
  }

  function openModal() {
    const modal = document.getElementById('cookie-preferences-modal');
    if (!modal) return;

    // Set checkboxes according to saved or default state
    const current = getStoredConsent() || defaultConsent;
    const analyticsCheckbox = document.getElementById('cookie-opt-analytics');
    const advertisingCheckbox = document.getElementById('cookie-opt-advertising');

    if (analyticsCheckbox) analyticsCheckbox.checked = Boolean(current.analytics);
    if (advertisingCheckbox) advertisingCheckbox.checked = Boolean(current.advertising);

    modal.classList.add('is-open');

    // Trap focus inside modal
    const closeBtn = document.getElementById('cookie-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    const modal = document.getElementById('cookie-preferences-modal');
    if (modal) {
      modal.classList.remove('is-open');
    }
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
  } else {
    initCookieConsent();
  }
})();
