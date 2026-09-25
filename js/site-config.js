/**
 * Centralized Site Configuration & Contact Details
 * Single source of truth for Printer Setup Portal contact identity.
 */
const SITE_CONFIG = {
  companyName: "PrinterSetupExperts",
  siteName: "Printer Setup",
  domain: "printersetupexperts.com",
  contact: {
    email: "hello@printerexpertshub.com",
    phone: "85201477963",
    address: "30 N Gould Street, Suite R, Sheridan, WY 82801"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
