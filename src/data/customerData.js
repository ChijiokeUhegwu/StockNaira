/**
 * Customer and Trade Credit Ledger Data for StockNaira
 * Models realistic Nigerian market trade credit ("gbese"), customer running balances,
 * credit limits, payment aging, and WhatsApp reminder templates.
 */

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Alhaji Musa Ibrahim',
    businessName: 'Musa Brothers Provisions Ltd',
    phone: '+234 803 445 9912',
    whatsapp: '+234 803 445 9912',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=60',
    initials: 'MI',
    address: 'Shop B4, Breadfruit Street, Balogun Market, Lagos Island',
    stallNumber: 'Shop B4 / Breadfruit',
    tier: 'Wholesale VIP',
    creditLimit: 800000,
    currentBalance: 285000,
    paymentTerms: 'Net 14 days',
    daysOverdue: 0,
    dueDate: '2026-09-12',
    lastPaymentDate: '2026-09-02',
    lastPaymentAmount: 50000,
    lifetimePurchases: 4850000,
    riskRating: 'Low Risk (AAA)',
    trustScore: 96,
    notes: 'Long-standing wholesale partner. Usually settles via GTBank or Moniepoint weekly.',
    ledger: [
      {
        id: 'LED-1092',
        date: '2026-09-05',
        type: 'CREDIT_SALE',
        reference: 'INV-9921',
        description: 'Dangote Sugar 50kg (x4), Golden Penny Spaghetti (x15)',
        debit: 201750,
        credit: 0,
        balanceAfter: 285000,
        cashier: 'Adeola B.',
        dueDate: '2026-09-19',
        status: 'Unpaid'
      },
      {
        id: 'LED-1088',
        date: '2026-09-02',
        type: 'REPAYMENT',
        reference: 'NIP/GTB/992810',
        paymentMethod: 'Bank Transfer (GTBank)',
        description: 'Weekly credit repayment via NIP transfer',
        debit: 0,
        credit: 50000,
        balanceAfter: 83250,
        cashier: 'Chinedu O.',
        status: 'Confirmed'
      },
      {
        id: 'LED-1075',
        date: '2026-08-28',
        type: 'CREDIT_SALE',
        reference: 'INV-9854',
        description: 'Indomie Super Pack Carton (x10), Milo 500g (x12)',
        debit: 133250,
        credit: 0,
        balanceAfter: 133250,
        cashier: 'Adeola B.',
        dueDate: '2026-09-11',
        status: 'Partially Paid'
      },
      {
        id: 'LED-1060',
        date: '2026-08-20',
        type: 'REPAYMENT',
        reference: 'MNP/POS/77219',
        paymentMethod: 'POS Terminal (Moniepoint)',
        description: 'Full settlement of mid-August invoice',
        debit: 0,
        credit: 120000,
        balanceAfter: 0,
        cashier: 'Adeola B.',
        status: 'Confirmed'
      }
    ]
  },
  {
    id: 'CUST-002',
    name: 'Mrs. Funke Adeleke',
    businessName: 'Adeleke Fabric & Lace Gallery',
    phone: '+234 802 881 2341',
    whatsapp: '+234 802 881 2341',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=60',
    initials: 'FA',
    address: 'Block 2, Martin Street, Balogun Island Market',
    stallNumber: 'Block 2 / Martin St',
    tier: 'Trade Retailer',
    creditLimit: 600000,
    currentBalance: 162000,
    paymentTerms: 'Net 7 days',
    daysOverdue: 0,
    dueDate: '2026-09-09',
    lastPaymentDate: '2026-08-31',
    lastPaymentAmount: 85000,
    lifetimePurchases: 3240000,
    riskRating: 'Good Standing',
    trustScore: 91,
    notes: 'Takes textiles and lace fabrics on 1-week consignment. Pays as her customers settle.',
    ledger: [
      {
        id: 'LED-1090',
        date: '2026-09-03',
        type: 'CREDIT_SALE',
        reference: 'INV-9915',
        description: 'Ankara Hollandis Wax 6 Yards (x6), Lace George 5 Yds (x1)',
        debit: 152000,
        credit: 0,
        balanceAfter: 162000,
        cashier: 'Adeola B.',
        dueDate: '2026-09-10',
        status: 'Unpaid'
      },
      {
        id: 'LED-1084',
        date: '2026-08-31',
        type: 'REPAYMENT',
        reference: 'CSH/REC/8892',
        paymentMethod: 'Cash (Direct Counter)',
        description: 'Cash installment settlement brought to counter',
        debit: 0,
        credit: 85000,
        balanceAfter: 10000,
        cashier: 'Chinedu O.',
        status: 'Confirmed'
      },
      {
        id: 'LED-1070',
        date: '2026-08-25',
        type: 'CREDIT_SALE',
        reference: 'INV-9810',
        description: 'Brocade Damask 5 Yards (x2)',
        debit: 95000,
        credit: 0,
        balanceAfter: 95000,
        cashier: 'Adeola B.',
        dueDate: '2026-09-01',
        status: 'Paid'
      }
    ]
  },
  {
    id: 'CUST-003',
    name: 'Chief Emeka Okonkwo',
    businessName: 'Okonkwo Sound & Gadgets Alaba',
    phone: '+234 803 999 8811',
    whatsapp: '+234 803 999 8811',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=60',
    initials: 'EO',
    address: 'Plaza 3, Electronic Line, Alaba International Market, Ojo',
    stallNumber: 'Plaza 3 / Line E',
    tier: 'Wholesale VIP',
    creditLimit: 1200000,
    currentBalance: 640000,
    paymentTerms: 'Net 14 days',
    daysOverdue: 12,
    dueDate: '2026-08-26',
    lastPaymentDate: '2026-08-15',
    lastPaymentAmount: 200000,
    lifetimePurchases: 6800000,
    riskRating: 'Overdue / Flagged',
    trustScore: 74,
    notes: 'Exceeded 14-day credit window. Awaiting bulk remittance from his Onitsha branch sales.',
    ledger: [
      {
        id: 'LED-1081',
        date: '2026-08-12',
        type: 'CREDIT_SALE',
        reference: 'INV-9780',
        description: 'Oraimo Powerbank 20k mAh (x25), SanDisk 128GB Flash (x30)',
        debit: 572250,
        credit: 0,
        balanceAfter: 640000,
        cashier: 'Chinedu O.',
        dueDate: '2026-08-26',
        status: 'Overdue'
      },
      {
        id: 'LED-1077',
        date: '2026-08-15',
        type: 'REPAYMENT',
        reference: 'NIP/ZEN/440192',
        paymentMethod: 'Bank Transfer (Zenith)',
        description: 'Direct corporate transfer from Zenith Bank',
        debit: 0,
        credit: 200000,
        balanceAfter: 67750,
        cashier: 'Adeola B.',
        status: 'Confirmed'
      },
      {
        id: 'LED-1065',
        date: '2026-08-08',
        type: 'CREDIT_SALE',
        reference: 'INV-9742',
        description: 'Samsung 25W Type-C Charger (x30)',
        debit: 267750,
        credit: 0,
        balanceAfter: 267750,
        cashier: 'Adeola B.',
        dueDate: '2026-08-22',
        status: 'Partially Paid'
      }
    ]
  },
  {
    id: 'CUST-004',
    name: 'Chioma Nwosu',
    businessName: 'Nwosu Provisions & Cosmetics',
    phone: '+234 814 552 1109',
    whatsapp: '+234 814 552 1109',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=60',
    initials: 'CN',
    address: 'Stall 18, Idumota Market, Lagos Island',
    stallNumber: 'Stall 18 / Idumota',
    tier: 'Trade Retailer',
    creditLimit: 350000,
    currentBalance: 145500,
    paymentTerms: 'Net 7 days',
    daysOverdue: 4,
    dueDate: '2026-09-03',
    lastPaymentDate: '2026-08-27',
    lastPaymentAmount: 40000,
    lifetimePurchases: 1890000,
    riskRating: 'Watchlist',
    trustScore: 82,
    notes: 'Short grace period requested due to market sanitation day. Usually prompt.',
    ledger: [
      {
        id: 'LED-1087',
        date: '2026-08-27',
        type: 'CREDIT_SALE',
        reference: 'INV-9880',
        description: 'Peak Milk Tin Carton (x2), Milo Refill (x15)',
        debit: 110500,
        credit: 0,
        balanceAfter: 145500,
        cashier: 'Adeola B.',
        dueDate: '2026-09-03',
        status: 'Overdue'
      },
      {
        id: 'LED-1082',
        date: '2026-08-27',
        type: 'REPAYMENT',
        reference: 'OPY/TRF/33109',
        paymentMethod: 'Bank Transfer (OPay)',
        description: 'Instant transfer settlement via OPay',
        debit: 0,
        credit: 40000,
        balanceAfter: 35000,
        cashier: 'Chinedu O.',
        status: 'Confirmed'
      },
      {
        id: 'LED-1068',
        date: '2026-08-18',
        type: 'CREDIT_SALE',
        reference: 'INV-9760',
        description: 'Golden Penny Spaghetti (x10)',
        debit: 75000,
        credit: 0,
        balanceAfter: 75000,
        cashier: 'Chinedu O.',
        dueDate: '2026-08-25',
        status: 'Paid'
      }
    ]
  },
  {
    id: 'CUST-005',
    name: 'Babatunde Lawal',
    businessName: 'Lawal Superstores & Mini Mart',
    phone: '+234 809 113 4455',
    whatsapp: '+234 809 113 4455',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=60',
    initials: 'BL',
    address: 'Medical Road, Ikeja Commercial Hub, Lagos',
    stallNumber: 'Shop 7 / Medical Rd',
    tier: 'Regular Merchant',
    creditLimit: 500000,
    currentBalance: 0,
    paymentTerms: 'Net 14 days',
    daysOverdue: 0,
    dueDate: 'N/A (Cleared)',
    lastPaymentDate: '2026-09-06',
    lastPaymentAmount: 180000,
    lifetimePurchases: 2950000,
    riskRating: 'Low Risk (AAA)',
    trustScore: 98,
    notes: 'Account completely cleared. Highly reliable, maintains zero outstanding debt balance.',
    ledger: [
      {
        id: 'LED-1094',
        date: '2026-09-06',
        type: 'REPAYMENT',
        reference: 'NIP/MNP/18290',
        paymentMethod: 'Bank Transfer (Moniepoint)',
        description: 'Full balance clearance before weekend stock intake',
        debit: 0,
        credit: 180000,
        balanceAfter: 0,
        cashier: 'Adeola B.',
        status: 'Confirmed'
      },
      {
        id: 'LED-1079',
        date: '2026-08-24',
        type: 'CREDIT_SALE',
        reference: 'INV-9840',
        description: 'Indomie Super Pack (x12), Peak Milk (x2 Cartons)',
        debit: 180000,
        credit: 0,
        balanceAfter: 180000,
        cashier: 'Chinedu O.',
        dueDate: '2026-09-07',
        status: 'Fully Settled'
      }
    ]
  },
  {
    id: 'CUST-006',
    name: 'Madam Blessing Okoro',
    businessName: 'Blessing FMCG Wholesale Hub',
    phone: '+234 816 778 0092',
    whatsapp: '+234 816 778 0092',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=60',
    initials: 'BO',
    address: 'Pavilion 4, ASPAMDA Plaza, Trade Fair Complex, Badagry Express',
    stallNumber: 'Pavilion 4 / Line 2',
    tier: 'Wholesale VIP',
    creditLimit: 750000,
    currentBalance: 410000,
    paymentTerms: 'Net 14 days',
    daysOverdue: 0,
    dueDate: '2026-09-15',
    lastPaymentDate: '2026-09-01',
    lastPaymentAmount: 150000,
    lifetimePurchases: 5120000,
    riskRating: 'Good Standing',
    trustScore: 89,
    notes: 'Takes provisions for suburban retail supply. Weekly Friday reconciliation.',
    ledger: [
      {
        id: 'LED-1091',
        date: '2026-09-01',
        type: 'CREDIT_SALE',
        reference: 'INV-9908',
        description: 'Dangote Sugar 50kg (x6), Milo Refill 500g (x20)',
        debit: 341500,
        credit: 0,
        balanceAfter: 410000,
        cashier: 'Adeola B.',
        dueDate: '2026-09-15',
        status: 'Unpaid'
      },
      {
        id: 'LED-1089',
        date: '2026-09-01',
        type: 'REPAYMENT',
        reference: 'NIP/GTB/882104',
        paymentMethod: 'Bank Transfer (GTBank)',
        description: 'Monthly end installment transfer',
        debit: 0,
        credit: 150000,
        balanceAfter: 68500,
        cashier: 'Adeola B.',
        status: 'Confirmed'
      }
    ]
  },
  {
    id: 'CUST-007',
    name: 'Ibrahim Danjuma',
    businessName: 'Danjuma Grains & Feeds',
    phone: '+234 808 334 1122',
    whatsapp: '+234 808 334 1122',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=60',
    initials: 'ID',
    address: 'Warehouse Row 3, Mile 12 International Market, Ketu',
    stallNumber: 'Row 3 / Stall 12',
    tier: 'Trade Retailer',
    creditLimit: 500000,
    currentBalance: 198000,
    paymentTerms: 'Net 7 days',
    daysOverdue: 19,
    dueDate: '2026-08-19',
    lastPaymentDate: '2026-08-10',
    lastPaymentAmount: 70000,
    lifetimePurchases: 2100000,
    riskRating: 'Overdue / Flagged',
    trustScore: 68,
    notes: 'Exceeded 2 weeks past due date. Has promised transfer upon grain dispatch to Ibadan.',
    ledger: [
      {
        id: 'LED-1073',
        date: '2026-08-12',
        type: 'CREDIT_SALE',
        reference: 'INV-9799',
        description: 'Dangote Sugar 50kg (x3), Golden Penny Spaghetti (x10)',
        debit: 150250,
        credit: 0,
        balanceAfter: 198000,
        cashier: 'Chinedu O.',
        dueDate: '2026-08-19',
        status: 'Overdue'
      },
      {
        id: 'LED-1066',
        date: '2026-08-10',
        type: 'REPAYMENT',
        reference: 'CSH/DIR/0912',
        paymentMethod: 'Cash',
        description: 'Direct cash collection by sales rep',
        debit: 0,
        credit: 70000,
        balanceAfter: 47750,
        cashier: 'Chinedu O.',
        status: 'Confirmed'
      }
    ]
  },
  {
    id: 'CUST-008',
    name: 'Kelechi Obi',
    businessName: 'Obi Boutique & Accessories',
    phone: '+234 803 112 9988',
    whatsapp: '+234 803 112 9988',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=60',
    initials: 'KO',
    address: 'Shop 22, Mandilas Arcade, Lagos Island',
    stallNumber: 'Shop 22 / Mandilas',
    tier: 'Regular Merchant',
    creditLimit: 300000,
    currentBalance: 0,
    paymentTerms: 'Net 7 days',
    daysOverdue: 0,
    dueDate: 'N/A (Cleared)',
    lastPaymentDate: '2026-09-04',
    lastPaymentAmount: 95000,
    lifetimePurchases: 1450000,
    riskRating: 'Good Standing',
    trustScore: 94,
    notes: 'Recently cleared account. Eligible for credit limit upgrade to ₦450,000.',
    ledger: [
      {
        id: 'LED-1093',
        date: '2026-09-04',
        type: 'REPAYMENT',
        reference: 'POS/MNP/66019',
        paymentMethod: 'POS (Moniepoint)',
        description: 'Card terminal settlement for lace consignment',
        debit: 0,
        credit: 95000,
        balanceAfter: 0,
        cashier: 'Adeola B.',
        status: 'Confirmed'
      },
      {
        id: 'LED-1080',
        date: '2026-08-28',
        type: 'CREDIT_SALE',
        reference: 'INV-9860',
        description: 'Ankara Hollandis Wax (x4)',
        debit: 72000,
        credit: 0,
        balanceAfter: 95000,
        cashier: 'Adeola B.',
        dueDate: '2026-09-04',
        status: 'Fully Settled'
      }
    ]
  }
];

const LOCAL_STORAGE_CUSTOMERS_KEY = 'stocknaira_customers_v1';

export function loadCustomersData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOMERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not load customers from localStorage:', err);
  }
  return INITIAL_CUSTOMERS;
}

export function saveCustomersData(customers) {
  try {
    localStorage.setItem(LOCAL_STORAGE_CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (err) {
    console.warn('Could not persist customers to localStorage:', err);
  }
}

/**
 * Calculates high-level trade credit metrics for the dashboard summary
 */
export function calculateCreditMetrics(customers = []) {
  let totalReceivables = 0;
  let activeDebtorsCount = 0;
  let overdueCount = 0;
  let overdueAmount = 0;
  let clearedCount = 0;
  let totalCreditLimit = 0;
  let totalLifetimeSales = 0;

  // Aging buckets
  let agingCurrent = 0; // 0-7 days
  let agingMedium = 0;  // 8-14 days
  let agingLate = 0;    // 15-30 days
  let agingCritical = 0;// >30 days

  customers.forEach((c) => {
    const balance = Number(c.currentBalance) || 0;
    const limit = Number(c.creditLimit) || 0;
    const daysOver = Number(c.daysOverdue) || 0;

    totalReceivables += balance;
    totalCreditLimit += limit;
    totalLifetimeSales += Number(c.lifetimePurchases) || 0;

    if (balance > 0) {
      activeDebtorsCount += 1;
      if (daysOver > 0) {
        overdueCount += 1;
        overdueAmount += balance;

        if (daysOver > 30) {
          agingCritical += balance;
        } else if (daysOver >= 15) {
          agingLate += balance;
        } else if (daysOver >= 8) {
          agingMedium += balance;
        } else {
          agingCurrent += balance;
        }
      } else {
        agingCurrent += balance;
      }
    } else {
      clearedCount += 1;
    }
  });

  // Calculate collections from all customer ledger entries dated in current month (September 2026)
  let collectionsThisMonth = 0;
  customers.forEach((c) => {
    if (Array.isArray(c.ledger)) {
      c.ledger.forEach((entry) => {
        if (entry.type === 'REPAYMENT' && entry.date?.startsWith('2026-09')) {
          collectionsThisMonth += Number(entry.credit) || 0;
        }
      });
    }
  });

  const utilizationPercent =
    totalCreditLimit > 0 ? Math.round((totalReceivables / totalCreditLimit) * 100) : 0;
  const overduePercent =
    totalReceivables > 0 ? Math.round((overdueAmount / totalReceivables) * 100) : 0;
  const recoveryRate =
    totalReceivables + collectionsThisMonth > 0
      ? Math.round((collectionsThisMonth / (totalReceivables + collectionsThisMonth)) * 100)
      : 85;

  return {
    totalReceivables,
    totalCreditLimit,
    activeDebtorsCount,
    totalCustomersCount: customers.length,
    overdueCount,
    overdueAmount,
    overduePercent,
    clearedCount,
    utilizationPercent,
    collectionsThisMonth,
    recoveryRate,
    aging: {
      current: agingCurrent,
      medium: agingMedium,
      late: agingLate,
      critical: agingCritical
    }
  };
}

/**
 * Clean phone number for WhatsApp wa.me links
 * Converts "+234 803 445 9912" -> "2348034459912"
 * Converts "08034459912" -> "2348034459912"
 */
export function cleanPhoneNumber(phone = '') {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '234' + digits.slice(1);
  }
  if (!digits.startsWith('234') && digits.length === 10) {
    return '234' + digits;
  }
  return digits || '2348000000000';
}

/**
 * Generate formatted WhatsApp message templates with store and bank details
 */
export function generateWhatsAppReminderMessage({
  customer,
  templateType = 'friendly',
  storeSettings,
  selectedBank = null
}) {
  const storeName = storeSettings?.profile?.storeName || 'Okonkwo & Sons Ltd';
  const branchName = storeSettings?.profile?.tradingName || 'StockNaira Balogun';
  const customerName = customer?.name || 'Valued Customer';
  const businessName = customer?.businessName ? ` (${customer.businessName})` : '';
  const balance = Number(customer?.currentBalance || 0).toLocaleString('en-NG');
  const dueDate = customer?.dueDate || 'Upon Receipt';
  const daysOverdue = customer?.daysOverdue || 0;

  // Selected bank details or fallback default
  const defaultBank =
    selectedBank ||
    storeSettings?.payment?.receivingAccounts?.find((a) => a.isDefault) || {
      bankName: 'Moniepoint Microfinance Bank',
      accountNumber: '8145521109',
      accountName: 'Okonkwo & Sons Ltd / Balogun'
    };

  const bankText = `🏦 *Bank Transfer Details:*\n• Bank: ${defaultBank.bankName}\n• Account No: *${defaultBank.accountNumber}*\n• Account Name: ${defaultBank.accountName}`;

  switch (templateType) {
    case 'due_today':
      return `Good day ${customerName}${businessName},\n\nThis is a quick notification from *${storeName}* regarding your active trade credit balance of *₦${balance}* which is due today (${dueDate}).\n\nKindly process settlement via bank transfer or visit our sales counter at your earliest convenience.\n\n${bankText}\n\n_Please send the NIP transaction receipt here once completed for instant ledger clearance. Thank you for your continued partnership!_ 🙏`;

    case 'overdue':
      return `Dear ${customerName}${businessName},\n\n*URGENT: TRADE CREDIT SETTLEMENT NOTICE*\n\nYour account with *${storeName}* shows an outstanding balance of *₦${balance}*, which is now *${daysOverdue} days past due* (Due date: ${dueDate}).\n\nTo keep your wholesale credit facility active and prevent credit restriction on future orders, please make an immediate payment of this balance:\n\n${bankText}\n\nKindly reply to this message with your transfer confirmation so we can update your ledger.\n\nThank you,\n*${storeName} Accounts Desk*`;

    case 'receipt':
      return `Dear ${customerName}${businessName},\n\n✅ *PAYMENT RECEIVED & CONFIRMED*\n\nWe have successfully received your repayment towards your account with *${storeName}*.\n\n• Current Outstanding Balance: *₦${balance}*\n• Available Credit Limit: *₦${(
        (customer?.creditLimit || 0) - (customer?.currentBalance || 0)
      ).toLocaleString('en-NG')}*\n\nThank you for maintaining a great payment record with us. We appreciate your business!\n\n*${storeName} Management*`;

    case 'friendly':
    default:
      return `Hello ${customerName}${businessName},\n\nHope business is going smoothly today!\n\nThis is a friendly statement update from *${storeName}* (${branchName}). Your current trade credit running balance stands at *₦${balance}* (Due date: ${dueDate}).\n\nWhenever you're ready to settle or make an installment, here are our receiving account details:\n\n${bankText}\n\nHave a profitable week ahead! ✨`;
  }
}

/**
 * Builds direct WhatsApp URL
 */
export function buildWhatsAppLink(phone, messageText) {
  const clean = cleanPhoneNumber(phone);
  return `https://wa.me/${clean}?text=${encodeURIComponent(messageText)}`;
}
