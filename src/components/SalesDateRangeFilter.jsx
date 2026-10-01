import React from 'react';
import { CalendarRange, CalendarDays } from 'lucide-react';
import { SALES_REPORT_DATE_RANGES, REPORT_MONTH_START, REPORT_MONTH_END } from '../data/salesReportsData';

export default function SalesDateRangeFilter({
  rangeId,
  setRangeId,
  customRange,
  setCustomRange,
  windowLabel,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          <CalendarRange className="w-4 h-4 text-emerald-700" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Reporting Period</h3>
          <p className="text-[11px] text-slate-500">{windowLabel}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
          {SALES_REPORT_DATE_RANGES.map((range) => {
            const isActive = rangeId === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => setRangeId(range.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {rangeId === 'custom' && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-150">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={customRange.start}
                min={REPORT_MONTH_START}
                max={REPORT_MONTH_END}
                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                className="px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 text-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <span className="text-slate-300 text-xs">&rarr;</span>
            <input
              type="date"
              value={customRange.end}
              min={REPORT_MONTH_START}
              max={REPORT_MONTH_END}
              onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
              className="px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 text-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        )}
      </div>
    </div>
  );
}
