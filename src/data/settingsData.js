/**
 * Default Store Settings Data for StockNaira
 * Tailored for Nigerian retail merchants and multi-branch commercial hubs.
 */

export const DEFAULT_STORE_SETTINGS = {
  // 1. Business & Profile Information
  profile: {
    storeName: 'Okonkwo & Sons Ltd',
    tradingName: 'StockNaira Balogun Commercial Hub',
    cacNumber: 'RC-1849204',
    tinNumber: '23849102-0001',
    email: 'accounts@okonkwoandsons.ng',
    phone: '+234 803 445 9912',
    alternatePhone: '+234 802 881 2341',
    address: 'Plot 14, Breadfruit Street, Balogun Market, Lagos Island',
    state: 'Lagos State',
    country: 'Nigeria',
    businessCategory: 'FMCG, Groceries & Textiles Wholesale',
    currencySymbol: '₦',
    currencyCode: 'NGN',
    logoInitials: 'OS',
    activeBranchId: 'balogun',
  },

  // 2. Payment & NIP Webhook Configuration
  payment: {
    nipLiveStatus: true, // Live vs Sandbox API
    nipEnvironment: 'production', // 'production' | 'sandbox'
    webhookUrl: 'https://api.stocknaira.ng/v1/webhooks/nip-inbound',
    webhookSecretKey: 'whsec_nip_live_99482103_okonkwo_balogun',
    autoMatchTransfers: true,
    autoApproveVerifiedTransfers: false, // If false, cashier still clicks 1-click verify
    audioAlertOnTransfer: true,
    smsAlertNotifications: true,
    whatsappAlertNotifications: true,
    alertPhone: '+234 803 445 9912',
    receivingAccounts: [
      {
        id: 'acc-1',
        bankName: 'Moniepoint Microfinance Bank',
        accountNumber: '8145521109',
        accountName: 'Okonkwo & Sons Ltd / Balogun',
        accountType: 'POS Terminal & NIP Settlement',
        isDefault: true,
        isActive: true,
        nipStatus: 'Connected',
        terminalId: 'MNP-POS-882190'
      },
      {
        id: 'acc-2',
        bankName: 'OPay Digital Services',
        accountNumber: '6128491023',
        accountName: 'Okonkwo & Sons Trading',
        accountType: 'Virtual Merchant Account',
        isDefault: false,
        isActive: true,
        nipStatus: 'Connected',
        terminalId: 'OPY-VIRT-3391'
      },
      {
        id: 'acc-3',
        bankName: 'Guaranty Trust Bank (GTBank)',
        accountNumber: '0129482019',
        accountName: 'Okonkwo & Sons Nigeria Enterprise',
        accountType: 'Corporate Current Account',
        isDefault: false,
        isActive: true,
        nipStatus: 'Connected',
        terminalId: 'GTB-CORP-001'
      },
      {
        id: 'acc-4',
        bankName: 'Zenith Bank Plc',
        accountNumber: '1014892011',
        accountName: 'Okonkwo & Sons Ltd Commercial',
        accountType: 'Corporate Current Account',
        isDefault: false,
        isActive: true,
        nipStatus: 'Connected',
        terminalId: 'ZEN-CORP-042'
      },
      {
        id: 'acc-5',
        bankName: 'Kuda Microfinance Bank',
        accountNumber: '2001948291',
        accountName: 'Okonkwo & Sons Retail Hub',
        accountType: 'Business Tier-3 Account',
        isDefault: false,
        isActive: false,
        nipStatus: 'Paused',
        terminalId: 'KUD-BUS-102'
      }
    ]
  },

  // 3. Tax & VAT Settings
  tax: {
    enableVat: true,
    vatRate: 7.5, // 7.5% Nigerian statutory VAT
    vatMode: 'exclusive', // 'exclusive' | 'inclusive'
    showTinOnReceipt: true,
    showVatBreakdownOnReceipt: true,
    receiptHeader: 'OKONKWO & SONS NIGERIA LTD\nDirect Importers & FMCG Wholesalers\nBalogun Market, Lagos Island',
    receiptFooter: 'Thank you for your valued patronage!\nGoods sold in good condition are non-refundable after 3 days.\nFor customer inquiries, call +234 803 445 9912.',
    printCashierName: true,
    printTimestamp: true,
    printNipRefCode: true,
    paperSize: '80mm', // '80mm' | '58mm'
  },

  // 4. Low Stock Thresholds & Alerts
  inventory: {
    globalLowStockThreshold: 5,
    globalCriticalThreshold: 2,
    enableAutoReorderDrafts: true,
    sendDailyDigest: true,
    digestTime: '08:00',
    notifyViaEmail: true,
    notifyViaWhatsApp: true,
    categoryThresholds: [
      { category: 'Groceries & Provisions', lowThreshold: 10, criticalThreshold: 3, defaultReorderQty: 30 },
      { category: 'Electronics & Gadgets', lowThreshold: 5, criticalThreshold: 2, defaultReorderQty: 25 },
      { category: 'Fashion & Textiles', lowThreshold: 8, criticalThreshold: 2, defaultReorderQty: 20 },
      { category: 'General Goods & Others', lowThreshold: 6, criticalThreshold: 2, defaultReorderQty: 15 },
    ]
  },

  // 5. Team & Staff Permissions
  team: {
    staff: [
      {
        id: 'stf-1',
        name: 'Chief Emeka Okonkwo',
        role: 'Store Admin',
        email: 'emeka@okonkwoandsons.ng',
        phone: '+234 803 999 8811',
        branch: 'All Branches (Executive)',
        pin: '8899',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        permissions: {
          posAccess: true,
          approveTransfers: true,
          overrideDiscounts: true,
          manageInventory: true,
          manageSettings: true,
          viewFinancials: true,
          issueRefunds: true
        }
      },
      {
        id: 'stf-2',
        name: 'Mrs. Funke Adeleke',
        role: 'Branch Manager',
        email: 'funke.a@okonkwoandsons.ng',
        phone: '+234 802 881 2341',
        branch: 'Balogun Branch',
        pin: '4421',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60',
        permissions: {
          posAccess: true,
          approveTransfers: true,
          overrideDiscounts: true,
          manageInventory: true,
          manageSettings: false,
          viewFinancials: true,
          issueRefunds: true
        }
      },
      {
        id: 'stf-3',
        name: 'Adeola Balogun',
        role: 'Senior Cashier',
        email: 'adeola.b@okonkwoandsons.ng',
        phone: '+234 814 552 9011',
        branch: 'Balogun Branch',
        pin: '1234',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
        permissions: {
          posAccess: true,
          approveTransfers: true,
          overrideDiscounts: false,
          manageInventory: false,
          manageSettings: false,
          viewFinancials: false,
          issueRefunds: false
        }
      },
      {
        id: 'stf-4',
        name: 'Chinedu Okeke',
        role: 'Cashier & Floor Associate',
        email: 'chinedu.o@okonkwoandsons.ng',
        phone: '+234 809 113 4455',
        branch: 'Balogun Branch',
        pin: '5678',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        permissions: {
          posAccess: true,
          approveTransfers: false,
          overrideDiscounts: false,
          manageInventory: false,
          manageSettings: false,
          viewFinancials: false,
          issueRefunds: false
        }
      },
      {
        id: 'stf-5',
        name: 'Kelechi Obi',
        role: 'Inventory & Logistics Officer',
        email: 'kelechi.o@okonkwoandsons.ng',
        phone: '+234 816 778 0092',
        branch: 'Alaba Warehouse B',
        pin: '9012',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60',
        permissions: {
          posAccess: false,
          approveTransfers: false,
          overrideDiscounts: false,
          manageInventory: true,
          manageSettings: false,
          viewFinancials: false,
          issueRefunds: false
        }
      }
    ],
    rolesConfig: {
      'Store Admin': {
        description: 'Full unrestricted system access, financial reports, settings and user management.',
        color: 'bg-purple-100 text-purple-700 border-purple-200'
      },
      'Branch Manager': {
        description: 'Day-to-day operations, cashier overrides, refunds, transfer approvals and stock purchase orders.',
        color: 'bg-blue-100 text-blue-700 border-blue-200'
      },
      'Senior Cashier': {
        description: 'POS sales terminal, customer receipt issuance, and NIP bank transfer verification.',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
      },
      'Cashier & Floor Associate': {
        description: 'Standard POS checkout and cash handling. Transfer verification requires manager sign-off.',
        color: 'bg-slate-100 text-slate-700 border-slate-200'
      },
      'Inventory & Logistics Officer': {
        description: 'Warehouse stock counts, supplier purchase orders, and goods received notes.',
        color: 'bg-amber-100 text-amber-700 border-amber-200'
      }
    }
  }
};

const STORAGE_KEY = 'stocknaira_store_settings_v1';

/**
 * Load store settings from localStorage, falling back to defaults.
 */
export function loadStoreSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_STORE_SETTINGS,
        ...parsed,
        profile: { ...DEFAULT_STORE_SETTINGS.profile, ...parsed.profile },
        payment: { ...DEFAULT_STORE_SETTINGS.payment, ...parsed.payment },
        tax: { ...DEFAULT_STORE_SETTINGS.tax, ...parsed.tax },
        inventory: { ...DEFAULT_STORE_SETTINGS.inventory, ...parsed.inventory },
        team: { ...DEFAULT_STORE_SETTINGS.team, ...parsed.team },
      };
    }
  } catch (err) {
    console.error('Failed to parse saved store settings:', err);
  }
  return DEFAULT_STORE_SETTINGS;
}

/**
 * Save store settings to localStorage.
 */
export function saveStoreSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error('Failed to save store settings to localStorage:', err);
    return false;
  }
}
