import React from 'react';
import {
  Wallet,
  AlertTriangle,
  ArrowLeftRight,
  MoreHorizontal,
  TrendingUp,
  Banknote,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

export default function MetricCards({
  metrics,
  onOpenLowStock,
  onOpenTransfers,
  onOpenNewSale
}) {
  const cards = [
    {
      id: 'sales',
      title: 'Total Sales Today',
      value: formatNaira(metrics.totalSalesToday),
      icon: Wallet,
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      badge: `+${metrics.salesGrowthPercent}% vs yesterday`,
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      subtext: `Cash: ${formatNaira(metrics.cashSales)} • Transfer/POS: ${formatNaira(metrics.transferPosSales)}`,
      action: onOpenNewSale,
      actionLabel: 'View Sales'
    },
    {
      id: 'low-stock',
      title: 'Low Stock Alerts',
      value: `${metrics.lowStockCount} Items`,
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-100',
      badge: `${metrics.criticalStockCount} Critical Reorders`,
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      subtext: 'Fast-moving provisions & gadgets below safety threshold',
      action: onOpenLowStock,
      actionLabel: 'Review Inventory'
    },
    {
      id: 'transfers',
      title: 'Pending Transfer Confirmations',
      value: `${metrics.pendingTransfersCount} Pending`,
      icon: ArrowLeftRight,
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-100',
      badge: `${formatNaira(metrics.pendingTransfersAmount)} unconfirmed`,
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      subtext: 'Awaiting customer NIP session webhook verification',
      action: onOpenTransfers,
      actionLabel: 'Verify Alerts'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-card transition-all duration-200"
          >
            {/* Top row: Icon Badge, Title, and More Button (Exact Reference UI Card Structure) */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{card.title}</p>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-0.5">
                    {card.value}
                  </h3>
                </div>
              </div>

              {/* Card Context Menu */}
              <button
                onClick={card.action}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition"
                aria-label="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Row: Subtext details & badges */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 truncate mr-2 font-medium">
                {card.subtext}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
