import React, { useState } from 'react';
import { BarChart3, TrendingUp, MoreHorizontal } from 'lucide-react';
import { formatNaira, formatCompactNaira } from '../utils/formatters';

/**
 * Grouped bar chart comparing Cash revenue against POS / Bank Transfer revenue
 * for each day in the selected reporting window. Intentionally a different
 * visualisation from the Dashboard's dual-line trend chart so the Sales Reports
 * page reads as its own analytics surface.
 */
export default function SalesChannelChart({ data, summary, windowLabel }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const width = Math.max(640, data.length * 44);
  const height = 260;
  const paddingLeft = 56;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 44;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(
    100000,
    ...data.flatMap((d) => [d.cash, d.transferPos])
  );
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxVal * f));

  const slot = data.length > 0 ? chartWidth / data.length : chartWidth;
  const barWidth = Math.max(4, Math.min(14, slot * 0.32));
  const gap = 3;

  const getX = (index) => paddingLeft + slot * index;
  const getY = (val) => paddingTop + chartHeight - (val / maxVal) * chartHeight;

  const labelStep = data.length > 16 ? 3 : data.length > 8 ? 2 : 1;
  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900">Revenue Channel Breakdown</h3>
            <p className="text-[11px] text-slate-500 truncate">
              Cash vs POS / Bank Transfer &middot; {windowLabel}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition shrink-0"
          aria-label="More"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ minWidth: `${Math.min(width, 1040)}px` }}
        >
          {/* Horizontal grid + y labels */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {val === 0 ? '\u20A60' : formatCompactNaira(val)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const x = getX(i);
            const cashH = paddingTop + chartHeight - getY(d.cash);
            const digH = paddingTop + chartHeight - getY(d.transferPos);
            const isHovered = hoveredIndex === i;
            return (
              <g key={d.date}>
                <rect
                  x={x + gap}
                  y={getY(d.cash)}
                  width={barWidth}
                  height={Math.max(1, cashH)}
                  rx="2"
                  fill="#64748B"
                  opacity={isHovered ? 1 : 0.75}
                  className="transition-opacity"
                />
                <rect
                  x={x + gap * 2 + barWidth}
                  y={getY(d.transferPos)}
                  width={barWidth}
                  height={Math.max(1, digH)}
                  rx="2"
                  fill="#047857"
                  opacity={isHovered ? 1 : 0.85}
                  className="transition-opacity"
                />
                {i % labelStep === 0 && (
                  <text
                    x={x + barWidth + gap}
                    y={height - 14}
                    textAnchor="middle"
                    className={`text-[10px] font-medium ${
                      isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-400'
                    }`}
                  >
                    {d.label}
                  </text>
                )}
                <rect
                  x={x}
                  y={paddingTop}
                  width={slot}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {hovered && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-150"
            style={{
              left: `${((getX(hoveredIndex) + barWidth) / width) * 100}%`,
              top: 4,
              transform:
                hoveredIndex > data.length / 2 ? 'translateX(-92%)' : 'translateX(-4%)',
            }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 p-2.5 shadow-xl min-w-[190px] text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5 gap-3">
                <span className="font-semibold text-slate-800 text-[11px]">
                  {hovered.label} ({hovered.weekday})
                </span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">
                  {formatCompactNaira(hovered.total)}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
                    <span className="text-slate-600">Cash</span>
                  </div>
                  <span className="font-mono font-medium text-slate-700">
                    {formatNaira(hovered.cash)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                    <span className="text-slate-600">POS / Transfer</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800">
                    {formatNaira(hovered.transferPos)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Channel share summary */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
        {[
          { label: 'POS / Bank Transfer', value: summary.digitalSales, pct: summary.digitalShare, color: 'bg-emerald-600' },
          { label: 'Cash Sales', value: summary.cashSales, pct: summary.cashShare, color: 'bg-slate-500' },
        ].map((row) => (
          <div key={row.label} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                {row.label}
              </span>
              <span className="font-mono text-slate-600">
                {formatNaira(row.value)}{' '}
                <span className="text-slate-400">({row.pct.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${row.color} transition-all duration-500`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
        <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          Best performing day: {summary.bestDay ? `${summary.bestDay.label} (${formatNaira(summary.bestDay.total)})` : 'n/a'}
        </p>
      </div>
    </div>
  );
}
