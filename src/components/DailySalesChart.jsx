import React, { useState } from 'react';
import {
  TrendingUp,
  MoreHorizontal,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { formatNaira, formatCompactNaira } from '../utils/formatters';

export default function DailySalesChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(4); // Default hover on Fri / active point like reference
  const [activeFilter, setActiveFilter] = useState('all'); // all, transfer, cash

  // Chart dimensions & scaling
  const width = 640;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = 350000; // max scale ₦350k
  const yTicks = [0, 100000, 200000, 300000];

  const getX = (index) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val) => paddingTop + chartHeight - (val / maxVal) * chartHeight;

  // Generate smooth SVG cubic Bezier path
  const createSmoothPath = (points) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const transferPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.transfer) }));
  const cashPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.cash) }));

  const transferPath = createSmoothPath(transferPoints);
  const cashPath = createSmoothPath(cashPoints);

  // Gradient area closed paths
  const transferAreaPath = `${transferPath} L ${transferPoints[transferPoints.length - 1].x} ${paddingTop + chartHeight} L ${transferPoints[0].x} ${paddingTop + chartHeight} Z`;
  const cashAreaPath = `${cashPath} L ${cashPoints[cashPoints.length - 1].x} ${paddingTop + chartHeight} L ${cashPoints[0].x} ${paddingTop + chartHeight} Z`;

  const hoveredItem = data[hoveredIndex] || data[data.length - 1];
  const hoveredTransferPoint = transferPoints[hoveredIndex];
  const hoveredCashPoint = cashPoints[hoveredIndex];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Chart Header matching Reference UI ("Hours per week") */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daily Sales Trends</h3>
            <p className="text-[11px] text-slate-500">Cash Payments vs POS / Bank Transfers</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveFilter(activeFilter === 'all' ? 'transfer' : activeFilter === 'transfer' ? 'cash' : 'all')}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition"
          >
            <Filter className="w-3 h-3 text-slate-400" />
            <span className="capitalize">{activeFilter === 'all' ? 'All Channels' : activeFilter === 'transfer' ? 'Transfers Only' : 'Cash Only'}</span>
          </button>
          <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => {}}
        >
          <defs>
            {/* Emerald Gradient for Transfers */}
            <linearGradient id="transferGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>

            {/* Slate Gradient for Cash */}
            <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748B" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Y-axis labels */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val} className="text-slate-300">
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
                  {val === 0 ? '₦0' : formatCompactNaira(val)}
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          {(activeFilter === 'all' || activeFilter === 'transfer') && (
            <path d={transferAreaPath} fill="url(#transferGrad)" />
          )}
          {(activeFilter === 'all' || activeFilter === 'cash') && (
            <path d={cashAreaPath} fill="url(#cashGrad)" />
          )}

          {/* Cash Curve (Dashed line like reference non-billable) */}
          {(activeFilter === 'all' || activeFilter === 'cash') && (
            <path
              d={cashPath}
              fill="none"
              stroke="#64748B"
              strokeWidth="2.2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          )}

          {/* Transfer/POS Curve (Solid emerald green line like reference billable) */}
          {(activeFilter === 'all' || activeFilter === 'transfer') && (
            <path
              d={transferPath}
              fill="none"
              stroke="#047857"
              strokeWidth="2.8"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          )}

          {/* X-axis tick labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            return (
              <g key={d.day}>
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[10px] font-medium transition-colors ${
                    isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {d.shortDay}
                </text>

                {/* Vertical hover guide bar */}
                <rect
                  x={x - 20}
                  y={paddingTop}
                  width="40"
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              </g>
            );
          })}

          {/* Hover indicator vertical line & points */}
          {hoveredIndex !== null && (
            <g>
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={paddingTop + chartHeight}
                stroke="#047857"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity="0.6"
              />

              {/* Cash Point */}
              {(activeFilter === 'all' || activeFilter === 'cash') && (
                <circle
                  cx={hoveredCashPoint.x}
                  cy={hoveredCashPoint.y}
                  r="4.5"
                  fill="#FFFFFF"
                  stroke="#64748B"
                  strokeWidth="2.5"
                />
              )}

              {/* Transfer Point */}
              {(activeFilter === 'all' || activeFilter === 'transfer') && (
                <circle
                  cx={hoveredTransferPoint.x}
                  cy={hoveredTransferPoint.y}
                  r="5.5"
                  fill="#047857"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="shadow-sm"
                />
              )}
            </g>
          )}
        </svg>

        {/* Floating Reference UI Style Tooltip Box */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-150 ease-out"
            style={{
              left: `${(getX(hoveredIndex) / width) * 100}%`,
              top: `${(Math.min(hoveredTransferPoint.y, hoveredCashPoint.y) / height) * 100 - 18}%`,
              transform: hoveredIndex > 4 ? 'translate(-92%, -85%)' : 'translate(-10%, -85%)',
            }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 p-2.5 shadow-xl min-w-[170px] text-xs font-sans">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                <span className="font-semibold text-slate-800 text-[11px]">{hoveredItem.day}</span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">
                  Total: {formatCompactNaira(hoveredItem.total)}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                    <span className="text-slate-600">POS / Transfers</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800">
                    {formatNaira(hoveredItem.transfer)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
                    <span className="text-slate-600">Cash Sales</span>
                  </div>
                  <span className="font-mono font-medium text-slate-700">
                    {formatNaira(hoveredItem.cash)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend at bottom matching reference UI (● POS / Bank transfers ● Cash payments) */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-100 text-xs">
        <button
          onClick={() => setActiveFilter(activeFilter === 'transfer' ? 'all' : 'transfer')}
          className={`flex items-center gap-2 transition ${
            activeFilter === 'transfer' || activeFilter === 'all'
              ? 'text-slate-800 font-semibold'
              : 'text-slate-400 opacity-50'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
          <span>POS / Bank Transfers</span>
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'cash' ? 'all' : 'cash')}
          className={`flex items-center gap-2 transition ${
            activeFilter === 'cash' || activeFilter === 'all'
              ? 'text-slate-800 font-semibold'
              : 'text-slate-400 opacity-50'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300" />
          <span>Cash Payments</span>
        </button>
      </div>
    </div>
  );
}
