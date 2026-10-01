import React from 'react';
import { AlertTriangle, PackageX, Flame, ListFilter } from 'lucide-react';
import { STOCK_STATUS_FILTERS } from '../data/inventoryData';

const FILTER_META = {
  all: { icon: ListFilter, countKey: 'skuCount', tone: 'slate' },
  reorder: { icon: AlertTriangle, countKey: 'reorderCount', tone: 'amber' },
  out: { icon: PackageX, countKey: 'outOfStockCount', tone: 'red' },
  fast: { icon: Flame, countKey: 'fastMoverCount', tone: 'emerald' },
};

const TONE_CLASSES = {
  slate: {
    active: 'bg-slate-900 text-white shadow-sm',
    idle: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70',
    badgeActive: 'bg-slate-800 text-slate-100',
    badgeIdle: 'bg-slate-100 text-slate-500',
  },
  amber: {
    active: 'bg-amber-500 text-white shadow-sm',
    idle: 'text-slate-600 hover:text-slate-900 hover:bg-amber-50',
    badgeActive: 'bg-amber-400/30 text-white',
    badgeIdle: 'bg-amber-100 text-amber-700',
  },
  red: {
    active: 'bg-red-600 text-white shadow-sm',
    idle: 'text-slate-600 hover:text-slate-900 hover:bg-red-50',
    badgeActive: 'bg-red-500/40 text-white',
    badgeIdle: 'bg-red-100 text-red-700',
  },
  emerald: {
    active: 'bg-emerald-600 text-white shadow-sm',
    idle: 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50',
    badgeActive: 'bg-emerald-500/40 text-white',
    badgeIdle: 'bg-emerald-100 text-emerald-700',
  },
};

export default function StockStatusFilterTabs({
  activeFilter,
  setActiveFilter,
  summary,
  totalCount,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-1.5 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1 min-w-max">
        {STOCK_STATUS_FILTERS.map((filter) => {
          const meta = FILTER_META[filter.id];
          const Icon = meta.icon;
          const tone = TONE_CLASSES[meta.tone];
          const isActive = activeFilter === filter.id;
          const count = filter.id === 'all' ? totalCount ?? summary.skuCount : summary[meta.countKey];

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive ? tone.active : tone.idle
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-md font-mono font-bold ${
                  isActive ? tone.badgeActive : tone.badgeIdle
                }`}
              >
                {String(count).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
