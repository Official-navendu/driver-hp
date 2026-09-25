/**
 * Centralized Site Configuration & Contact Details
 * Single source of truth for Printer Setup Portal contact identity.
 */
const SITE_CONFIG = {
  companyName: "PrintersVault",
  siteName: "Printer Setup",
  domain: "PrintersVault.com",
  contact: {
    email: "hello@printersvault.com",
    phone: "+1 833-693-3171",
    address: "30 N Gould Street, Suite R, Sheridan, WY 82801"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
