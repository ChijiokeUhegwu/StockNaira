import React from 'react';
import { Wallet, Boxes, AlertTriangle, PackageX, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCompactNaira } from '../utils/formatters';

function WidgetCard({ icon: Icon, iconBg, title, value, subtext, badge, badgeColor }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-card transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">{title}</p>
            <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 font-mono mt-0.5 truncate">
              {value}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <span className="text-[11px] text-slate-500 font-medium truncate">{subtext}</span>
        {badge && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${badgeColor}`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export default function InventorySummaryWidgets({
  summary,
  categoryBreakdown = [],
  onSelectCategory,
  activeCategory,
}) {
  const marginPct =
    summary.valuationAtRetail > 0
      ? ((summary.valuationAtRetail - summary.valuationAtCost) / summary.valuationAtRetail) * 100
      : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        <WidgetCard
          icon={Wallet}
          iconBg="bg-emerald-50 text-emerald-700 border border-emerald-100"
          title="Total Inventory Valuation (Cost)"
          value={formatCompactNaira(summary.valuationAtCost)}
          subtext={`${summary.skuCount} active SKUs at wholesale cost`}
          badge={`Retail ${formatCompactNaira(summary.valuationAtRetail)}`}
          badgeColor="text-emerald-700 bg-emerald-50 border-emerald-200"
        />
        <WidgetCard
          icon={Boxes}
          iconBg="bg-blue-50 text-blue-700 border border-blue-100"
          title="Total Stock Count"
          value={`${summary.totalUnits.toLocaleString('en-NG')} units`}
          subtext={`${summary.fastMoverCount} fast movers in trailing 30 days`}
          badge={`${Math.round(marginPct)}% margin`}
          badgeColor="text-blue-700 bg-blue-50 border-blue-200"
        />
        <WidgetCard
          icon={AlertTriangle}
          iconBg="bg-amber-50 text-amber-700 border border-amber-100"
          title="Reorder Needed"
          value={`${summary.reorderCount} SKUs`}
          subtext="At or below reorder point, still with stock"
          badge="Raise PO"
          badgeColor="text-amber-700 bg-amber-50 border-amber-200"
        />
        <WidgetCard
          icon={PackageX}
          iconBg="bg-red-50 text-red-700 border border-red-100"
          title="Out of Stock"
          value={`${summary.outOfStockCount} SKUs`}
          subtext="Zero units on hand - immediate supply gap"
          badge="Urgent"
          badgeColor="text-red-700 bg-red-50 border-red-200"
        />
      </div>

      {/* Department mix strip: doubles as a category quick filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900">Department Stock Mix</h3>
            <span className="text-[11px] text-slate-400 font-normal">
              {onSelectCategory ? 'Select a department to filter the table below' : ''}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Warehouse load:{' '}
            <strong className="font-mono text-slate-700">
              {summary.totalUnits.toLocaleString('en-NG')}
            </strong>{' '}
            units
          </span>
        </div>

        <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-100">
          {categoryBreakdown.map((cat) => (
            <div
              key={cat.name}
              className="h-full transition-all duration-300"
              style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
              title={`${cat.name}: ${cat.percentage}%`}
            />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {categoryBreakdown.map((cat) => {
            const isActive = activeCategory === cat.shortName;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory?.(isActive ? 'all' : cat.shortName)}
                className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-left transition ${
                  isActive
                    ? 'border-slate-300 bg-slate-50'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-[11px] font-semibold text-slate-700 truncate">
                    {cat.name}
                  </span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-500">
                    {cat.units.toLocaleString('en-NG')} u
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-900">
                    {cat.percentage}%
                  </span>
                  {isActive ? (
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-slate-300" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
