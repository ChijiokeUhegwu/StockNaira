import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  Download,
  Printer,
  FileSpreadsheet,
  FileCheck,
  Info,
  Percent,
} from 'lucide-react';
import FinancialSummaryCards from './FinancialSummaryCards';
import SalesDateRangeFilter from './SalesDateRangeFilter';
import SalesChannelChart from './SalesChannelChart';
import TopSellingProducts from './TopSellingProducts';
import ReconciliationSheet from './ReconciliationSheet';
import {
  SALES_REPORT_DATE_RANGES,
  REPORT_TODAY,
  resolveDateWindow,
  filterTrendByWindow,
  summariseTrend,
  buildTopSellers,
  formatReconciliationDate,
  VAT_RATE,
} from '../data/salesReportsData';
import { formatNaira } from '../utils/formatters';
import { downloadCsv } from '../utils/exporters';

export default function SalesReportsView({ showToast, currentStore, storeSettings }) {
  const [rangeId, setRangeId] = useState('last7');
  const [customRange, setCustomRange] = useState({ start: '2026-09-24', end: REPORT_TODAY });
  const [rankBy, setRankBy] = useState('revenue');

  const windowRange = useMemo(
    () => resolveDateWindow(rangeId, customRange),
    [rangeId, customRange]
  );

  const trendRows = useMemo(
    () => filterTrendByWindow(windowRange.start, windowRange.end),
    [windowRange]
  );

  const summary = useMemo(() => summariseTrend(trendRows), [trendRows]);

  const topSellers = useMemo(() => {
    const ranked = buildTopSellers(trendRows.length);
    return rankBy === 'volume'
      ? [...ranked].sort((a, b) => b.unitsSold - a.unitsSold)
      : ranked;
  }, [trendRows.length, rankBy]);

  const rangeLabel = SALES_REPORT_DATE_RANGES.find((r) => r.id === rangeId)?.label || 'Custom';
  const windowLabel =
    trendRows.length === 1
      ? formatReconciliationDate(windowRange.start)
      : `${formatReconciliationDate(windowRange.start)} - ${formatReconciliationDate(
          windowRange.end
        )} (${trendRows.length} day${trendRows.length === 1 ? '' : 's'})`;

  const handleExportCsv = () => {
    if (trendRows.length === 0) {
      showToast('No sales data in the selected period to export.');
      return;
    }
    const headers = [
      'Date',
      'Day',
      'Cash Sales (NGN)',
      'POS Sales (NGN)',
      'NIP Transfer (NGN)',
      'POS + Bank Transfer (NGN)',
      'Gross Sales (NGN)',
      'VAT 7.5% (NGN)',
      'Transactions',
    ];
    const rows = trendRows.map((row) => [
      row.date,
      row.weekday,
      row.cash,
      row.pos,
      row.transfer,
      row.transferPos,
      row.total,
      row.vat,
      row.transactions,
    ]);
    rows.push([]);
    rows.push(['PERIOD TOTALS']);
    rows.push([rangeLabel, windowLabel]);
    rows.push(['Cash Sales', summary.cashSales]);
    rows.push(['POS Sales', summary.posSales]);
    rows.push(['NIP Transfer', summary.transferSales]);
    rows.push(['POS + Bank Transfer', summary.digitalSales]);
    rows.push(['Total Gross Sales', summary.grossSales]);
    rows.push([`VAT Collected (${VAT_RATE * 100}%)`, summary.vat]);
    rows.push(['Net Sales', summary.netSales]);
    rows.push(['Transactions', summary.transactions]);
    rows.push(['Average Basket', summary.avgBasket]);
    rows.push([]);
    rows.push(['TOP SELLING PRODUCTS']);
    rows.push(['Rank', 'SKU', 'Item Name', 'Category', 'Units Sold', 'Unit Price (NGN)', 'Revenue (NGN)']);
    topSellers.forEach((p, i) => {
      rows.push([i + 1, p.sku, p.name, p.category, p.unitsSold, p.unitPrice, p.revenue]);
    });

    downloadCsv(
      `stocknaira-sales-report-${currentStore?.id || 'branch'}-${windowRange.start}-to-${windowRange.end}`,
      headers,
      rows
    );
    showToast(
      `Sales report exported to CSV: ${trendRows.length} day(s) - ${formatNaira(summary.grossSales)} gross.`
    );
  };

  const handlePrintSheet = () => {
    showToast('Opening print dialog for the daily reconciliation sheet...');
    setTimeout(() => window.print(), 350);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page header + export / audit controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
              Sales Reports
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-600">{currentStore?.name || 'Balogun Branch'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Revenue, VAT &amp; Channel Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Gross sales, {VAT_RATE * 100}% VAT liability, and Cash vs POS / Bank Transfer performance for{' '}
            {rangeLabel.toLowerCase()}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Report to CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrintSheet}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 border border-emerald-700 rounded-xl transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-200" />
            <span>Print Daily Reconciliation</span>
          </button>
        </div>
      </div>

      <SalesDateRangeFilter
        rangeId={rangeId}
        setRangeId={setRangeId}
        customRange={customRange}
        setCustomRange={setCustomRange}
        windowLabel={windowLabel}
      />

      <FinancialSummaryCards summary={summary} rangeLabel={rangeLabel} />

      {/* Channel chart + top sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-7 min-h-[380px]">
          <SalesChannelChart data={trendRows} summary={summary} windowLabel={windowLabel} />
        </div>
        <div className="lg:col-span-5 min-h-[380px]">
          <TopSellingProducts products={topSellers} />
        </div>
      </div>

      {/* Channel ratio audit strip + ranking toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-600" />
            Channel Ratio &amp; Tax Position
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Mix of settlement channels and the resulting {VAT_RATE * 100}% VAT exposure for{' '}
            {rangeLabel.toLowerCase()}.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Digital Share', value: `${summary.digitalShare.toFixed(1)}%`, tone: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
              { label: 'Cash Share', value: `${summary.cashShare.toFixed(1)}%`, tone: 'text-slate-700 bg-slate-100 border-slate-200' },
              { label: 'VAT Payable', value: formatNaira(summary.vat), tone: 'text-rose-700 bg-rose-50 border-rose-200' },
              { label: 'Avg Basket', value: formatNaira(summary.avgBasket), tone: 'text-blue-700 bg-blue-50 border-blue-200' },
            ].map((tile) => (
              <div key={tile.label} className={`rounded-xl border px-3 py-2.5 ${tile.tone}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{tile.label}</p>
                <p className="font-mono font-bold text-[15px] mt-0.5">{tile.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              VAT is computed on the exclusive base (gross &divide; 1.075 &times; 7.5%) so the figure
              ties back to shelf prices charged on 80mm receipts. Digital share drives NIP webhook
              volume; anything above 60% is flagged for next-day settlement reconciliation.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Export &amp; Audit Controls
            </h3>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition text-left"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-800">Export Report to CSV</span>
                  <span className="block text-[10px] text-slate-500 truncate">
                    {trendRows.length} day ledger + totals + top sellers (UTF-8, Excel safe)
                  </span>
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={handlePrintSheet}
              className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition text-left"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Printer className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-800">
                    Print Daily Reconciliation Sheet
                  </span>
                  <span className="block text-[10px] text-slate-500 truncate">
                    Cash drawer, POS &amp; NIP totals with signature block
                  </span>
                </span>
              </span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-semibold">Rank top products by</span>
            <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-lg">
              {[
                { id: 'revenue', label: 'Revenue' },
                { id: 'volume', label: 'Volume' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRankBy(opt.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                    rankBy === opt.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Off-screen printable reconciliation sheet */}
      <ReconciliationSheet
        store={currentStore}
        storeSettings={storeSettings}
        rangeLabel={rangeLabel}
        window={windowRange}
        summary={summary}
        trendRows={trendRows}
      />
    </div>
  );
}
