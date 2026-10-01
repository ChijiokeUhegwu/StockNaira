import React from 'react';
import { Wallet, BadgePercent, Banknote, CreditCard, TrendingUp, Receipt } from 'lucide-react';
import { formatNaira } from '../utils/formatters';
import { VAT_RATE } from '../data/salesReportsData';

export default function FinancialSummaryCards({ summary, rangeLabel }) {
  const cards = [
    {
      id: 'gross',
      title: 'Total Gross Sales',
      value: formatNaira(summary.grossSales),
      icon: Wallet,
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      badge: `${rangeLabel}`,
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      subtext: `${summary.transactions} transactions at ${formatNaira(summary.avgBasket)} avg basket`,
    },
    {
      id: 'vat',
      title: 'Total VAT Collected (7.5%)',
      value: formatNaira(summary.vat),
      icon: BadgePercent,
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-100',
      badge: `Net ${formatNaira(summary.netSales)}`,
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
      subtext: `Nigerian VAT computed on the exclusive base of ${VAT_RATE * 100}%`,
    },
    {
      id: 'cash',
      title: 'Cash Sales Volume',
      value: formatNaira(summary.cashSales),
      icon: Banknote,
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      badge: `${summary.cashShare.toFixed(1)}% of gross`,
      badgeColor: 'text-slate-700 bg-slate-100 border-slate-200',
      subtext: 'Physical naira at the counter, reconciled against drawer float',
    },
    {
      id: 'digital',
      title: 'POS / Bank Transfer Volume',
      value: formatNaira(summary.digitalSales),
      icon: CreditCard,
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-100',
      badge: `${summary.digitalShare.toFixed(1)}% of gross`,
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      subtext: `POS ${formatNaira(summary.posSales)} • NIP transfer ${formatNaira(summary.transferSales)}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-card transition-all duration-200 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${card.iconBg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 truncate">{card.title}</p>
                  <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 font-mono mt-0.5 truncate">
                    {card.value}
                  </h3>
                </div>
              </div>
              <Receipt className="w-4 h-4 text-slate-200 shrink-0" />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-500 font-medium truncate">{card.subtext}</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${card.badgeColor}`}
              >
                <TrendingUp className="w-3 h-3" />
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
