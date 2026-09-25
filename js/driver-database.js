/**
 * HP-Inspired Printer Setup & Driver Portal — Driver Catalog Database
 * Configured driver metadata catalog for supported printer models and platforms.
 * 100% Frontend-only modular catalog with verified catalog entries.
 */

const DRIVER_DATABASE = {
  "HP LaserJet Pro M404dn": {
    modelCode: "W1A53A",
    Windows: {
      version: "v48.3.4754",
      releaseDate: "Oct 14, 2024",
      packageName: "HP LaserJet Full Software Solution",
      packageSize: "104.2 MB",
      supportedOS: "Windows",
      packageType: "Full Software Solution",
      releaseNotes: [
        "Full printer setup and driver package for Windows",
        "Updated print subsystem compatibility",
        "Improved print job processing efficiency"
      ],
      includedComponents: [
        {
          title: "Printer driver",
          desc: "Core software required for Windows to communicate with and print through the selected printer."
        },
        {
          title: "Printer setup software",
          desc: "Guides printer configuration and initial device setup."
        },
        {
          title: "Print compatibility",
          desc: "Updates compatibility with supported Windows printing components."
        },
        {
          title: "Print job handling",
          desc: "Improvements to printer communication and print job processing."
        },
        {
          title: "Device configuration",
          desc: "Provides printer configuration and management options exposed by the package."
        }
      ],
      installationNotes: [
        "Keep the printer powered on and connected to your computer or network.",
        "Close any previous printer installation windows before running the package."
      ],
      downloadUrl: ""
    },
    macOS: {
      version: "v15.2.0",
      releaseDate: "Sep 20, 2024",
      packageName: "HP Easy Start for macOS",
      packageSize: "12.8 MB",
      supportedOS: "macOS",
      packageType: "macOS Print Package",
      releaseNotes: [
        "Native macOS printer setup package",
        "Apple AirPrint and print queue compatibility updates"
      ],
      includedComponents: [
        {
          title: "macOS Print Driver",
          desc: "Print driver software for macOS desktop environment."
        },
        {
          title: "AirPrint Queue Utility",
          desc: "Manages network print queues and direct AirPrint connectivity."
        }
      ],
      installationNotes: [
        "Ensure macOS is connected to the same Wi-Fi network as the printer.",
        "Open the downloaded installer file and follow the macOS setup wizard."
      ],
      downloadUrl: ""
    }
  },

  "HP DeskJet 2820e": {
    modelCode: "607R4B",
    Windows: {
      version: "v51.4.1102",
      releaseDate: "Nov 02, 2024",
      packageName: "HP DeskJet Print & Scan Driver Package",
      packageSize: "88.5 MB",
      supportedOS: "Windows",
      packageType: "Print and Scan Package",
      releaseNotes: [
        "DeskJet print & scan driver setup package",
        "Wireless setup wizard updates"
      ],
      includedComponents: [
        {
          title: "DeskJet Print Driver",
          desc: "Essential print driver software for Windows operating system."
        },
        {
          title: "Scan Subsystem Driver",
          desc: "Enables document scanning and image acquisition."
        },
        {
          title: "Wireless Setup Wizard",
          desc: "Guides wireless network connection for DeskJet series."
        }
      ],
      installationNotes: [
        "Turn on the printer and verify paper is loaded in the input tray.",
        "Connect the printer via Wi-Fi network or USB cable when prompted."
      ],
      downloadUrl: ""
    },
    macOS: {
      version: "v15.4.1",
      releaseDate: "Oct 28, 2024",
      packageName: "HP Smart Print & Scan for macOS",
      packageSize: "15.1 MB",
      supportedOS: "macOS",
      packageType: "macOS Print & Scan Package",
      releaseNotes: [
        "macOS desktop print and scan software solution"
      ],
      includedComponents: [
        {
          title: "macOS DeskJet Driver",
          desc: "Native driver for DeskJet series on macOS."
        }
      ],
      installationNotes: [
        "Run the installer package on macOS and follow on-screen instructions."
      ],
      downloadUrl: ""
    }
  },

  "HP OfficeJet Pro 9015e": {
    modelCode: "1G5L3B",
    Windows: {
      version: "v50.2.4580",
      releaseDate: "Aug 18, 2024",
      packageName: "HP OfficeJet Pro Full Feature Software",
      packageSize: "112.4 MB",
      supportedOS: "Windows",
      packageType: "Full Feature Package",
      releaseNotes: [
        "Full feature print, scan, and fax software solution",
        "OfficeJet wireless network setup package"
      ],
      includedComponents: [
        {
          title: "OfficeJet Pro Driver",
          desc: "Core driver software for OfficeJet Pro series."
        },
        {
          title: "Scan & OCR Software",
          desc: "Enables multi-page document scanning and document text processing."
        },
        {
          title: "Network Utility",
          desc: "Configures network printer connectivity."
        }
      ],
      installationNotes: [
        "Verify printer network status before starting installation.",
        "Run the package installer and follow the initial setup steps."
      ],
      downloadUrl: ""
    },
    macOS: {
      version: "v15.1.0",
      releaseDate: "Aug 10, 2024",
      packageName: "HP Easy Start for OfficeJet macOS",
      packageSize: "14.2 MB",
      supportedOS: "macOS",
      packageType: "macOS Driver Package",
      releaseNotes: [
        "macOS OfficeJet driver and scanner setup"
      ],
      includedComponents: [
        {
          title: "macOS OfficeJet Driver",
          desc: "Native driver for OfficeJet Pro series."
        }
      ],
      installationNotes: [
        "Run the setup utility on your Mac computer."
      ],
      downloadUrl: ""
    }
  }
};

/**
 * Retrieve driver information from catalog based on model and operating system
 * @param {string} modelName 
 * @param {string} osName 
 * @returns {Object} Structured driver info object
 */
function getDriverInfo(modelName, osName) {
  if (!modelName || typeof modelName !== 'string') {
    return {
      available: false,
      version: "Unavailable",
      status: "Package available",
      releaseDate: "Unavailable",
      packageName: "Unavailable",
      packageSize: "Unavailable",
      supportedOS: "Unavailable",
      packageType: "Unavailable",
      modelCode: "Unavailable",
      releaseNotes: [],
      includedComponents: [],
      installationNotes: []
    };
  }

  const cleanModel = modelName.trim();
  const cleanOS = (osName && typeof osName === 'string') ? osName.trim() : 'Windows';

  let matchedModelData = null;
  for (const key in DRIVER_DATABASE) {
    if (cleanModel.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanModel.toLowerCase())) {
      matchedModelData = DRIVER_DATABASE[key];
      break;
    }
  }

  if (!matchedModelData) {
    return {
      available: false,
      version: "Unavailable",
      status: "Package available",
      releaseDate: "Unavailable",
      packageName: "Unavailable",
      packageSize: "Unavailable",
      supportedOS: cleanOS,
      packageType: "Unavailable",
      modelCode: "Unavailable",
      releaseNotes: [],
      includedComponents: [],
      installationNotes: []
    };
  }

  const modelCode = matchedModelData.modelCode || "Unavailable";
  const osData = matchedModelData[cleanOS] || matchedModelData['Windows'];

  if (!osData) {
    return {
      available: false,
      version: "Unavailable",
      status: "Package available",
      releaseDate: "Unavailable",
      packageName: "Unavailable",
      packageSize: "Unavailable",
      supportedOS: cleanOS,
      packageType: "Unavailable",
      modelCode: modelCode,
      releaseNotes: [],
      includedComponents: [],
      installationNotes: []
    };
  }

  return {
    available: true,
    version: osData.version || "Unavailable",
    status: "Package available",
    releaseDate: osData.releaseDate || "Unavailable",
    packageName: osData.packageName || "Unavailable",
    packageSize: osData.packageSize || "Unavailable",
    supportedOS: osData.supportedOS || cleanOS,
    packageType: osData.packageType || "Full Software Solution",
    downloadUrl: osData.downloadUrl || "",
    modelCode: modelCode,
    releaseNotes: Array.isArray(osData.releaseNotes) ? osData.releaseNotes : [],
    includedComponents: Array.isArray(osData.includedComponents) ? osData.includedComponents : [],
    installationNotes: Array.isArray(osData.installationNotes) ? osData.installationNotes : []
  };
}
