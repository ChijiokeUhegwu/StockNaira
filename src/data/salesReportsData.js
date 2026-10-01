/**
 * Sales Reports analytics data module
 *
 * The Dashboard overview is anchored on the demo trading week (Sep 1 - Sep 7, 2026).
 * To avoid contradicting the overview headline figures, the reports dataset:
 *   - reuses the Dashboard cash/transfer split for Sep 1 - Sep 7, and
 *   - extends the same pattern through Sep 30, 2026, with the final day carrying
 *     the Dashboard "today" totals (Cash ₦95,000 + POS/Transfer ₦150,800 = ₦245,800).
 * So "Today" in reports == the most recent reporting day (Sep 30, 2026).
 */

export const VAT_RATE = 0.075;

/** Average basket assumption used to derive transaction counts from revenue. */
export const AVG_BASKET = 38000;

/** Share of digital revenue settled through the Moniepoint POS terminal vs NIP transfer. */
export const POS_SHARE_OF_DIGITAL = 0.42;

const RAW_TREND = [
  { date: '2026-09-01', cash: 72000, transferPos: 108000 },
  { date: '2026-09-02', cash: 85000, transferPos: 125000 },
  { date: '2026-09-03', cash: 65000, transferPos: 130000 },
  { date: '2026-09-04', cash: 92000, transferPos: 138000 },
  { date: '2026-09-05', cash: 110000, transferPos: 160000 },
  { date: '2026-09-06', cash: 135000, transferPos: 175000 },
  { date: '2026-09-07', cash: 95000, transferPos: 150800 },
  { date: '2026-09-08', cash: 102000, transferPos: 148000 },
  { date: '2026-09-09', cash: 88000, transferPos: 136000 },
  { date: '2026-09-10', cash: 96000, transferPos: 142000 },
  { date: '2026-09-11', cash: 118000, transferPos: 168000 },
  { date: '2026-09-12', cash: 142000, transferPos: 186000 },
  { date: '2026-09-13', cash: 128000, transferPos: 172000 },
  { date: '2026-09-14', cash: 105000, transferPos: 150000 },
  { date: '2026-09-15', cash: 91000, transferPos: 139000 },
  { date: '2026-09-16', cash: 87000, transferPos: 133000 },
  { date: '2026-09-17', cash: 99000, transferPos: 145000 },
  { date: '2026-09-18', cash: 124000, transferPos: 171000 },
  { date: '2026-09-19', cash: 148000, transferPos: 192000 },
  { date: '2026-09-20', cash: 132000, transferPos: 178000 },
  { date: '2026-09-21', cash: 108000, transferPos: 152000 },
  { date: '2026-09-22', cash: 94000, transferPos: 141000 },
  { date: '2026-09-23', cash: 90000, transferPos: 137000 },
  { date: '2026-09-24', cash: 101000, transferPos: 148000 },
  { date: '2026-09-25', cash: 126000, transferPos: 174000 },
  { date: '2026-09-26', cash: 152000, transferPos: 198000 },
  { date: '2026-09-27', cash: 136000, transferPos: 181000 },
  { date: '2026-09-28', cash: 110000, transferPos: 156000 },
  { date: '2026-09-29', cash: 97000, transferPos: 143000 },
  { date: '2026-09-30', cash: 95000, transferPos: 150800 },
];

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * The reporting day the app treats as "today" - the last day of the series.
 */
export const REPORT_TODAY = '2026-09-30';
export const REPORT_MONTH_START = '2026-09-01';
export const REPORT_MONTH_END = '2026-09-30';

export const SALES_REPORT_TREND = RAW_TREND.map((row) => {
  const [year, month, day] = row.date.split('-').map(Number);
  const total = row.cash + row.transferPos;
  const pos = Math.round(row.transferPos * POS_SHARE_OF_DIGITAL);
  return {
    date: row.date,
    label: `Sep ${day}`,
    weekday: WEEKDAY_SHORT[new Date(year, month - 1, day).getDay()],
    cash: row.cash,
    pos,
    transfer: row.transferPos - pos,
    transferPos: row.transferPos,
    total,
    vat: Math.round(total * VAT_RATE),
    transactions: Math.max(1, Math.round(total / AVG_BASKET)),
  };
});

export const SALES_REPORT_DATE_RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'last7', label: 'Last 7 Days' },
  { id: 'thisMonth', label: 'This Month' },
  { id: 'custom', label: 'Custom Date Range' },
];

function lastNDays(n) {
  return SALES_REPORT_TREND.slice(SALES_REPORT_TREND.length - n).map((d) => d.date);
}

/** Resolves a preset id into an inclusive [start, end] ISO date window. */
export function resolveDateWindow(rangeId, customRange) {
  if (rangeId === 'today') return { start: REPORT_TODAY, end: REPORT_TODAY };
  if (rangeId === 'last7') {
    const days = lastNDays(7);
    return { start: days[0], end: days[days.length - 1] };
  }
  if (rangeId === 'thisMonth') return { start: REPORT_MONTH_START, end: REPORT_MONTH_END };
  const start = customRange?.start || lastNDays(7)[0];
  const end = customRange?.end || REPORT_TODAY;
  return start <= end ? { start, end } : { start: end, end: start };
}

export function filterTrendByWindow(start, end) {
  return SALES_REPORT_TREND.filter((row) => row.date >= start && row.date <= end);
}

/**
 * Aggregates a window of trend rows into the financial summary card metrics.
 * VAT is reported on the exclusive base (total / 1.075 * 7.5%) so the card ties
 * back to the inclusive shelf prices charged on receipts.
 */
export function summariseTrend(rows) {
  const totals = rows.reduce(
    (acc, row) => {
      acc.grossSales += row.total;
      acc.cashSales += row.cash;
      acc.posSales += row.pos;
      acc.transferSales += row.transfer;
      acc.digitalSales += row.transferPos;
      acc.transactions += row.transactions;
      return acc;
    },
    {
      grossSales: 0,
      cashSales: 0,
      posSales: 0,
      transferSales: 0,
      digitalSales: 0,
      transactions: 0,
    }
  );

  const vat = Math.round((totals.grossSales / (1 + VAT_RATE)) * VAT_RATE);
  const netSales = totals.grossSales - vat;

  return {
    ...totals,
    vat,
    netSales,
    cashShare: totals.grossSales > 0 ? (totals.cashSales / totals.grossSales) * 100 : 0,
    digitalShare: totals.grossSales > 0 ? (totals.digitalSales / totals.grossSales) * 100 : 0,
    avgBasket:
      totals.transactions > 0 ? Math.round(totals.grossSales / totals.transactions) : 0,
    bestDay: rows.reduce(
      (best, row) => (row.total > (best?.total || 0) ? row : best),
      null
    ),
  };
}

/**
 * Top selling products for the window. Units are prorated from the trailing
 * 30-day run rate so short windows (Today / Last 7 Days) stay realistic.
 */
export const TOP_SELLING_PRODUCTS = [
  { sku: 'GRO-DN-001', name: 'Dangote Sugar 50kg Bag', category: 'Provisions', units30d: 168, unitPrice: 47250 },
  { sku: 'GRO-IND-003', name: 'Indomie Super Pack 120g (Carton 40pcs)', category: 'Provisions', units30d: 210, unitPrice: 11270 },
  { sku: 'GRO-BEV-075', name: 'Soft Drinks Crate (24 x 350ml)', category: 'Provisions', units30d: 320, unitPrice: 8640 },
  { sku: 'GRO-GP-012', name: 'Golden Penny Spaghetti 500g (Carton 20pcs)', category: 'Provisions', units30d: 132, unitPrice: 18170 },
  { sku: 'GRO-MIL-008', name: 'Milo Refill Economy 500g (Pack 12pcs)', category: 'Provisions', units30d: 145, unitPrice: 36800 },
  { sku: 'ELE-TYP-077', name: 'Type-C Fast Cable 1m (Pack of 10)', category: 'Gadgets', units30d: 198, unitPrice: 7360 },
  { sku: 'ELE-SAM-022', name: 'Samsung 25W Type-C Super Fast Adapter', category: 'Gadgets', units30d: 176, unitPrice: 8625 },
  { sku: 'ELE-OR-045', name: 'Oraimo 20000mAh Powerbank Toast 20 Pro', category: 'Gadgets', units30d: 88, unitPrice: 15525 },
  { sku: 'FAS-DSP-130', name: 'Ankara Print Fabric 6 Yards', category: 'Fashion', units30d: 158, unitPrice: 15525 },
  { sku: 'FAS-ANK-091', name: 'Super Wax Hollandis 6 Yards Roll', category: 'Fashion', units30d: 84, unitPrice: 27600 },
  { sku: 'GRO-NFD-033', name: 'Noodles Multi-pack Bundle (Carton 60)', category: 'Provisions', units30d: 190, unitPrice: 24725 },
  { sku: 'ELE-HDP-210', name: '65W GaN Laptop Charger', category: 'Gadgets', units30d: 52, unitPrice: 13225 },
];

export function buildTopSellers(windowRowCount) {
  const factor = Math.min(1, Math.max(windowRowCount, 1) / 30);
  return TOP_SELLING_PRODUCTS.map((p) => {
    const unitsSold = Math.max(p.units30d > 0 ? 1 : 0, Math.round(p.units30d * factor));
    return {
      ...p,
      unitsSold,
      revenue: unitsSold * p.unitPrice,
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

export function formatReconciliationDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
