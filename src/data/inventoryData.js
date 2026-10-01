/**
 * StockNaira - Inventory Control data model
 *
 * Single source of truth for the wholesale stock ledger. The Dashboard donut,
 * the Dashboard "Low Stock Items" tab, the Inventory Control table and the restock
 * flows all derive from this catalog so stock quantities never drift between views.
 *
 * Quantity math note: department unit volumes are deliberately balanced
 * (Provisions 1,928 / Gadgets 1,687 / Fashion 1,205 = 4,820 total units)
 * to match the warehouse load gauge design of the Dashboard overview.
 */

export const STOCK_CATEGORIES = [
  {
    id: 'Provisions',
    label: 'Provisions',
    fullLabel: 'Groceries & Provisions',
    color: '#059669',
    bgHex: 'bg-emerald-500',
  },
  {
    id: 'Gadgets',
    label: 'Gadgets',
    fullLabel: 'Electronics & Gadgets',
    color: '#2563EB',
    bgHex: 'bg-blue-600',
  },
  {
    id: 'Fashion',
    label: 'Fashion',
    fullLabel: 'Fashion & Textiles',
    color: '#EA580C',
    bgHex: 'bg-orange-600',
  },
];

/** A SKU selling 90+ units in the trailing 30 days is treated as a fast mover. */
export const FAST_MOVER_UNITS_30D = 90;

export const INITIAL_STOCK_ITEMS = [
  // ---------- PROVISIONS (1,928 units) ----------
  {
    id: 'STK-01',
    sku: 'GRO-DN-001',
    name: 'Dangote Sugar 50kg Bag',
    category: 'Provisions',
    unitsInStock: 3,
    reorderPoint: 10,
    suggestedReorder: 25,
    costPrice: 42000,
    unitPrice: 47250,
    supplier: 'Dangote Foods Direct Lagos',
    unitsSold30d: 168,
    lastRestocked: 'Aug 18, 2026',
  },
  {
    id: 'STK-02',
    sku: 'GRO-RIC-060',
    name: 'Big Rice 50kg Bag (Fortified)',
    category: 'Provisions',
    unitsInStock: 620,
    reorderPoint: 100,
    suggestedReorder: 200,
    costPrice: 58000,
    unitPrice: 66700,
    supplier: 'Dangote Foods Direct Lagos',
    unitsSold30d: 96,
    lastRestocked: 'Sep 12, 2026',
  },
  {
    id: 'STK-03',
    sku: 'GRO-GP-012',
    name: 'Golden Penny Spaghetti 500g (Carton 20pcs)',
    category: 'Provisions',
    unitsInStock: 5,
    reorderPoint: 18,
    suggestedReorder: 40,
    costPrice: 15800,
    unitPrice: 18170,
    supplier: 'Golden Penny Mills Dist.',
    unitsSold30d: 132,
    lastRestocked: 'Aug 22, 2026',
  },
  {
    id: 'STK-04',
    sku: 'GRO-IND-003',
    name: 'Indomie Super Pack 120g (Carton 40pcs)',
    category: 'Provisions',
    unitsInStock: 7,
    reorderPoint: 20,
    suggestedReorder: 50,
    costPrice: 9800,
    unitPrice: 11270,
    supplier: 'Dufil Prima Foods Depot',
    unitsSold30d: 210,
    lastRestocked: 'Aug 29, 2026',
  },
  {
    id: 'STK-05',
    sku: 'GRO-MIL-008',
    name: 'Milo Refill Economy 500g (Pack 12pcs)',
    category: 'Provisions',
    unitsInStock: 8,
    reorderPoint: 20,
    suggestedReorder: 24,
    costPrice: 32000,
    unitPrice: 36800,
    supplier: 'Nestle Nigeria Wholesale Dist.',
    unitsSold30d: 145,
    lastRestocked: 'Aug 25, 2026',
  },
  {
    id: 'STK-06',
    sku: 'GRO-PK-019',
    name: 'Peak Evaporated Milk 160g (Carton 48 tins)',
    category: 'Provisions',
    unitsInStock: 9,
    reorderPoint: 25,
    suggestedReorder: 40,
    costPrice: 23500,
    unitPrice: 27025,
    supplier: 'FrieslandCampina WAMCO Depot',
    unitsSold30d: 118,
    lastRestocked: 'Sep 2, 2026',
  },
  {
    id: 'STK-07',
    sku: 'GRO-NFD-033',
    name: 'Noodles Multi-pack Bundle (Carton 60)',
    category: 'Provisions',
    unitsInStock: 340,
    reorderPoint: 80,
    suggestedReorder: 150,
    costPrice: 21500,
    unitPrice: 24725,
    supplier: 'Dufil Prima Foods Depot',
    unitsSold30d: 190,
    lastRestocked: 'Sep 9, 2026',
  },
  {
    id: 'STK-08',
    sku: 'GRO-OIL-044',
    name: 'Vegetable Oil 25L Carton (6 x 25L)',
    category: 'Provisions',
    unitsInStock: 165,
    reorderPoint: 40,
    suggestedReorder: 80,
    costPrice: 118000,
    unitPrice: 135700,
    supplier: 'Nestle Nigeria Wholesale Dist.',
    unitsSold30d: 42,
    lastRestocked: 'Sep 6, 2026',
  },
  {
    id: 'STK-09',
    sku: 'GRO-BEV-075',
    name: 'Soft Drinks Crate (24 x 350ml)',
    category: 'Provisions',
    unitsInStock: 480,
    reorderPoint: 120,
    suggestedReorder: 200,
    costPrice: 7200,
    unitPrice: 8640,
    supplier: 'Dangote Foods Direct Lagos',
    unitsSold30d: 320,
    lastRestocked: 'Sep 15, 2026',
  },
  {
    id: 'STK-10',
    sku: 'GRO-TWF-021',
    name: 'Tomato Paste Tin 400g (Carton 24)',
    category: 'Provisions',
    unitsInStock: 291,
    reorderPoint: 30,
    suggestedReorder: 60,
    costPrice: 26400,
    unitPrice: 30360,
    supplier: 'FrieslandCampina WAMCO Depot',
    unitsSold30d: 74,
    lastRestocked: 'Sep 1, 2026',
  },

  // ---------- GADGETS (1,687 units) ----------
  {
    id: 'STK-11',
    sku: 'ELE-OR-045',
    name: 'Oraimo 20000mAh Powerbank Toast 20 Pro',
    category: 'Gadgets',
    unitsInStock: 4,
    reorderPoint: 15,
    suggestedReorder: 30,
    costPrice: 13500,
    unitPrice: 15525,
    supplier: 'Alaba Electronics Wholesale Ltd',
    unitsSold30d: 88,
    lastRestocked: 'Aug 20, 2026',
  },
  {
    id: 'STK-12',
    sku: 'ELE-SAM-022',
    name: 'Samsung 25W Type-C Super Fast Adapter',
    category: 'Gadgets',
    unitsInStock: 8,
    reorderPoint: 25,
    suggestedReorder: 50,
    costPrice: 7500,
    unitPrice: 8625,
    supplier: 'Alaba Electronics Wholesale Ltd',
    unitsSold30d: 176,
    lastRestocked: 'Aug 31, 2026',
  },
  {
    id: 'STK-13',
    sku: 'ELE-TYP-077',
    name: 'Type-C Fast Cable 1m (Pack of 10)',
    category: 'Gadgets',
    unitsInStock: 0,
    reorderPoint: 20,
    suggestedReorder: 60,
    costPrice: 6400,
    unitPrice: 7360,
    supplier: 'Alaba Electronics Wholesale Ltd',
    unitsSold30d: 198,
    lastRestocked: 'Aug 14, 2026',
  },
  {
    id: 'STK-14',
    sku: 'ELE-SND-128',
    name: 'SanDisk 128GB Ultra Flash Drive',
    category: 'Gadgets',
    unitsInStock: 22,
    reorderPoint: 12,
    suggestedReorder: 30,
    costPrice: 6600,
    unitPrice: 7590,
    supplier: 'Computer Village Distributors Ltd',
    unitsSold30d: 34,
    lastRestocked: 'Sep 4, 2026',
  },
  {
    id: 'STK-15',
    sku: 'ELE-BT-090',
    name: 'JBL Tune 510BT Wireless Headset',
    category: 'Gadgets',
    unitsInStock: 0,
    reorderPoint: 6,
    suggestedReorder: 15,
    costPrice: 41000,
    unitPrice: 47150,
    supplier: 'Alaba Electronics Wholesale Ltd',
    unitsSold30d: 9,
    lastRestocked: 'Aug 8, 2026',
  },
  {
    id: 'STK-16',
    sku: 'ELE-HDP-140',
    name: '43-inch LED Smart TV (Full HD 1080p)',
    category: 'Gadgets',
    unitsInStock: 0,
    reorderPoint: 4,
    suggestedReorder: 8,
    costPrice: 138000,
    unitPrice: 158700,
    supplier: 'Computer Village Distributors Ltd',
    unitsSold30d: 3,
    lastRestocked: 'Jul 30, 2026',
  },
  {
    id: 'STK-17',
    sku: 'ELE-BAT-150',
    name: 'Laptop 15.6" Core i5 / 8GB RAM / 512GB SSD',
    category: 'Gadgets',
    unitsInStock: 48,
    reorderPoint: 10,
    suggestedReorder: 15,
    costPrice: 385000,
    unitPrice: 442750,
    supplier: 'Computer Village Distributors Ltd',
    unitsSold30d: 12,
    lastRestocked: 'Sep 11, 2026',
  },
  {
    id: 'STK-18',
    sku: 'ELE-PRT-160',
    name: 'Canon LBP2900 Wireless Printer',
    category: 'Gadgets',
    unitsInStock: 26,
    reorderPoint: 8,
    suggestedReorder: 12,
    costPrice: 88000,
    unitPrice: 101200,
    supplier: 'Computer Village Distributors Ltd',
    unitsSold30d: 5,
    lastRestocked: 'Sep 5, 2026',
  },
  {
    id: 'STK-19',
    sku: 'ELE-NET-170',
    name: 'TP-Link 4G LTE WiFi Router',
    category: 'Gadgets',
    unitsInStock: 63,
    reorderPoint: 12,
    suggestedReorder: 25,
    costPrice: 24500,
    unitPrice: 28175,
    supplier: 'Alaba Electronics Wholesale Ltd',
    unitsSold30d: 21,
    lastRestocked: 'Sep 8, 2026',
  },
  {
    id: 'STK-20',
    sku: 'ELE-MON-180',
    name: 'Acer 24" IPS LED Monitor',
    category: 'Gadgets',
    unitsInStock: 90,
    reorderPoint: 15,
    suggestedReorder: 30,
    costPrice: 76000,
    unitPrice: 87400,
    supplier: 'Computer Village Distributors Ltd',
    unitsSold30d: 8,
    lastRestocked: 'Sep 3, 2026',
  },
  {
    id: 'STK-21',
    sku: 'ELE-KBD-190',
    name: 'Wireless Keyboard & Mouse Combo',
    category: 'Gadgets',
    unitsInStock: 142,
    reorderPoint: 20,
    suggestedReorder: 40,
    costPrice: 8900,
    unitPrice: 10235,
    supplier: 'Computer Village Distributors Ltd',
    unitsSold30d: 34,
    lastRestocked: 'Sep 14, 2026',
  },
  {
    id: 'STK-22',
    sku: 'ELE-PWR-200',
    name: 'APC 650VA UPS Backup Unit',
    category: 'Gadgets',
    unitsInStock: 210,
    reorderPoint: 20,
    suggestedReorder: 40,
    costPrice: 58000,
    unitPrice: 66700,
    supplier: 'Computer Village Distributors Ltd',
    unitsSold30d: 19,
    lastRestocked: 'Sep 7, 2026',
  },
  {
    id: 'STK-23',
    sku: 'ELE-HDP-210',
    name: '65W GaN Laptop Charger',
    category: 'Gadgets',
    unitsInStock: 385,
    reorderPoint: 30,
    suggestedReorder: 60,
    costPrice: 11500,
    unitPrice: 13225,
    supplier: 'Alaba Electronics Wholesale Ltd',
    unitsSold30d: 52,
    lastRestocked: 'Sep 16, 2026',
  },
  {
    id: 'STK-24',
    sku: 'ELE-AUD-220',
    name: 'JBL Go 4 Portable Bluetooth Speaker',
    category: 'Gadgets',
    unitsInStock: 240,
    reorderPoint: 25,
    suggestedReorder: 50,
    costPrice: 19000,
    unitPrice: 21850,
    supplier: 'Alaba Electronics Wholesale Ltd',
    unitsSold30d: 27,
    lastRestocked: 'Sep 10, 2026',
  },
  {
    id: 'STK-25',
    sku: 'ELE-SEC-230',
    name: 'CCTV 4-Channel Security Camera Kit',
    category: 'Gadgets',
    unitsInStock: 118,
    reorderPoint: 12,
    suggestedReorder: 20,
    costPrice: 96000,
    unitPrice: 110400,
    supplier: 'Computer Village Distributors Ltd',
    unitsSold30d: 9,
    lastRestocked: 'Aug 27, 2026',
  },
  {
    id: 'STK-26',
    sku: 'ELE-MEM-240',
    name: '16GB DDR4 3200MHz Laptop RAM',
    category: 'Gadgets',
    unitsInStock: 331,
    reorderPoint: 30,
    suggestedReorder: 60,
    costPrice: 16800,
    unitPrice: 19320,
    supplier: 'Computer Village Distributors Ltd',
    unitsSold30d: 44,
    lastRestocked: 'Sep 13, 2026',
  },

  // ---------- FASHION (1,205 units) ----------
  {
    id: 'STK-27',
    sku: 'FAS-ANK-091',
    name: 'Super Wax Hollandis 6 Yards Roll',
    category: 'Fashion',
    unitsInStock: 6,
    reorderPoint: 15,
    suggestedReorder: 20,
    costPrice: 24000,
    unitPrice: 27600,
    supplier: 'Balogun Textile Importers Ltd',
    unitsSold30d: 84,
    lastRestocked: 'Aug 16, 2026',
  },
  {
    id: 'STK-28',
    sku: 'FAS-GEO-005',
    name: 'Lace Fabric George 5 Yards',
    category: 'Fashion',
    unitsInStock: 5,
    reorderPoint: 10,
    suggestedReorder: 12,
    costPrice: 44000,
    unitPrice: 50600,
    supplier: 'Balogun Textile Importers Ltd',
    unitsSold30d: 46,
    lastRestocked: 'Aug 12, 2026',
  },
  {
    id: 'STK-29',
    sku: 'FAS-AOS-114',
    name: 'Head Tie Aso-Oke Premium (Pair)',
    category: 'Fashion',
    unitsInStock: 48,
    reorderPoint: 15,
    suggestedReorder: 30,
    costPrice: 8500,
    unitPrice: 9775,
    supplier: 'Balogun Textile Importers Ltd',
    unitsSold30d: 62,
    lastRestocked: 'Sep 6, 2026',
  },
  {
    id: 'STK-30',
    sku: 'FAS-BRD-120',
    name: 'Brocade Damask 6 Yards',
    category: 'Fashion',
    unitsInStock: 32,
    reorderPoint: 10,
    suggestedReorder: 20,
    costPrice: 31000,
    unitPrice: 35650,
    supplier: 'Trade Fair Fabrics Depot',
    unitsSold30d: 28,
    lastRestocked: 'Sep 2, 2026',
  },
  {
    id: 'STK-31',
    sku: 'FAS-DSP-130',
    name: 'Ankara Print Fabric 6 Yards',
    category: 'Fashion',
    unitsInStock: 573,
    reorderPoint: 25,
    suggestedReorder: 60,
    costPrice: 13500,
    unitPrice: 15525,
    supplier: 'Trade Fair Fabrics Depot',
    unitsSold30d: 158,
    lastRestocked: 'Sep 17, 2026',
  },
  {
    id: 'STK-32',
    sku: 'FAS-BLT-140',
    name: 'Leather Belt & Wallet Gift Set',
    category: 'Fashion',
    unitsInStock: 165,
    reorderPoint: 20,
    suggestedReorder: 40,
    costPrice: 7800,
    unitPrice: 8970,
    supplier: 'Balogun Textile Importers Ltd',
    unitsSold30d: 51,
    lastRestocked: 'Sep 9, 2026',
  },
  {
    id: 'STK-33',
    sku: 'FAS-SHO-150',
    name: "Men's Formal Shoe (Pair)",
    category: 'Fashion',
    unitsInStock: 128,
    reorderPoint: 15,
    suggestedReorder: 30,
    costPrice: 18500,
    unitPrice: 21275,
    supplier: 'Trade Fair Fabrics Depot',
    unitsSold30d: 37,
    lastRestocked: 'Sep 4, 2026',
  },
  {
    id: 'STK-34',
    sku: 'FAS-CAP-160',
    name: 'Ankara-Fabric Baseball Cap',
    category: 'Fashion',
    unitsInStock: 248,
    reorderPoint: 25,
    suggestedReorder: 50,
    costPrice: 4200,
    unitPrice: 4830,
    supplier: 'Trade Fair Fabrics Depot',
    unitsSold30d: 44,
    lastRestocked: 'Sep 11, 2026',
  },
];

export const STOCK_STATUS_FILTERS = [
  { id: 'all', label: 'All Items' },
  { id: 'reorder', label: 'Low Stock / Reorder Needed' },
  { id: 'out', label: 'Out of Stock' },
  { id: 'fast', label: 'Fast Movers' },
];

/**
 * Stock health for a single SKU.
 * Out of Stock wins over Reorder Needed so a zero-count line is never
 * reported as a plain "low stock" item.
 */
export function getStockStatus(item) {
  if (item.unitsInStock <= 0) return 'Out of Stock';
  if (item.unitsInStock <= item.reorderPoint) return 'Reorder Needed';
  return 'Stock OK';
}

export function isFastMover(item) {
  return (item.unitsSold30d || 0) >= FAST_MOVER_UNITS_30D;
}

export function getStockStatusMeta(item) {
  const status = getStockStatus(item);
  if (status === 'Out of Stock') {
    return {
      label: 'Out of Stock',
      badge: 'bg-red-50 text-red-700 border border-red-200',
      bar: 'bg-red-500',
      text: 'text-red-600',
    };
  }
  if (status === 'Reorder Needed') {
    return {
      label: 'Reorder Needed',
      badge: 'bg-amber-50 text-amber-700 border border-amber-200',
      bar: 'bg-amber-500',
      text: 'text-amber-600',
    };
  }
  return {
    label: 'Stock OK',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    bar: 'bg-emerald-500',
    text: 'text-emerald-600',
  };
}

export function matchesStockFilter(item, filterId) {
  const status = getStockStatus(item);
  if (filterId === 'reorder') return status === 'Reorder Needed';
  if (filterId === 'out') return status === 'Out of Stock';
  if (filterId === 'fast') return isFastMover(item);
  return true;
}

/** Warehouse-level totals for the Inventory Control summary widgets. */
export function buildInventorySummary(items) {
  return items.reduce(
    (acc, item) => {
      acc.totalUnits += item.unitsInStock;
      acc.valuationAtCost += item.unitsInStock * item.costPrice;
      acc.valuationAtRetail += item.unitsInStock * item.unitPrice;
      acc.skuCount += 1;
      if (getStockStatus(item) === 'Out of Stock') acc.outOfStockCount += 1;
      else if (getStockStatus(item) === 'Reorder Needed') acc.reorderCount += 1;
      if (isFastMover(item)) acc.fastMoverCount += 1;
      return acc;
    },
    {
      totalUnits: 0,
      valuationAtCost: 0,
      valuationAtRetail: 0,
      skuCount: 0,
      reorderCount: 0,
      outOfStockCount: 0,
      fastMoverCount: 0,
    }
  );
}

/**
 * Category share of warehouse volume, shaped for InventoryDonutChart.
 */
export function buildCategoryBreakdown(items) {
  const totalUnits = items.reduce((sum, item) => sum + item.unitsInStock, 0);
  return STOCK_CATEGORIES.map((category) => {
    const units = items
      .filter((item) => item.category === category.id)
      .reduce((sum, item) => sum + item.unitsInStock, 0);
    return {
      name: category.fullLabel,
      shortName: category.label,
      units,
      percentage: totalUnits > 0 ? Math.round((units / totalUnits) * 100) : 0,
      color: category.color,
      bgHex: category.bgHex,
    };
  });
}

/**
 * Maps the stock catalog into the row shape consumed by the Dashboard
 * "Low Stock Items" tab and by RestockModal.
 */
export function toLowStockRow(item) {
  const status = getStockStatus(item);
  const isCritical = status === 'Out of Stock';
  return {
    id: item.id,
    sku: item.sku,
    name: item.name,
    category: item.category,
    inStock: item.unitsInStock,
    minThreshold: item.reorderPoint,
    reorderQty: item.suggestedReorder,
    unitPrice: item.costPrice,
    supplier: item.supplier,
    status: isCritical ? 'Critical' : 'Low Stock',
    urgencyColor: isCritical
      ? 'text-red-700 bg-red-50 border-red-200'
      : 'text-amber-700 bg-amber-50 border-amber-200',
  };
}

export function buildLowStockRows(items) {
  return items
    .filter((item) => getStockStatus(item) !== 'Stock OK')
    .map(toLowStockRow);
}
