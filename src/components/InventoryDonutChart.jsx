import React, { useState } from 'react';
import {
  Boxes,
  MoreHorizontal,
  Layers,
  ArrowUpRight,
  PackageCheck
} from 'lucide-react';
import { INVENTORY_CATEGORIES } from '../data/mockData';

export default function InventoryDonutChart({ categories = INVENTORY_CATEGORIES, totalUnits = 4820, capacityPercent = 70 }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Arcs configuration matching the reference UI concentric gauge arcs
  // Arc 1: Groceries 40% (outermost)
  // Arc 2: Electronics 35% (middle)
  // Arc 3: Fashion 25% (inner)

  const radiusValues = [78, 62, 46];
  const strokeWidth = 8;
  const cx = 100;
  const cy = 100;

  // Calculate arc path for a gauge arc (240 degrees sweep from 150deg to 390deg / 30deg)
  const createArc = (r, percent) => {
    const startAngle = 135 * (Math.PI / 180);
    const totalAngle = 270 * (Math.PI / 180);
    const endAngle = startAngle + (percent / 100) * totalAngle;

    const startX = cx + r * Math.cos(startAngle);
    const startY = cy + r * Math.sin(startAngle);
    const endX = cx + r * Math.cos(endAngle);
    const endY = cy + r * Math.sin(endAngle);

    const largeArc = (percent / 100) * totalAngle > Math.PI ? 1 : 0;

    return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  const createTrack = (r) => {
    const startAngle = 135 * (Math.PI / 180);
    const totalAngle = 270 * (Math.PI / 180);
    const endAngle = startAngle + totalAngle;

    const startX = cx + r * Math.cos(startAngle);
    const startY = cy + r * Math.sin(startAngle);
    const endX = cx + r * Math.cos(endAngle);
    const endY = cy + r * Math.sin(endAngle);

    return `M ${startX} ${startY} A ${r} ${r} 0 1 1 ${endX} ${endY}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header matching Reference UI ("Task progress") */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Boxes className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Inventory Breakdown</h3>
            <p className="text-[11px] text-slate-500">Stock Volume by Category</p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition" aria-label="More">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Radial Arc Gauge Layout (Exact aesthetic from Reference UI right card) */}
      <div className="relative flex items-center justify-center my-auto py-2">
        <svg viewBox="0 0 200 200" className="w-56 h-56 max-h-[190px] overflow-visible">
          {/* Background gray tracks */}
          {radiusValues.map((r, i) => (
            <path
              key={`track-${i}`}
              d={createTrack(r)}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ))}

          {/* Active colored percentage arcs */}
          {categories.map((cat, i) => {
            const r = radiusValues[i] || 40;
            const isHovered = hoveredCategory === cat.name;
            return (
              <path
                key={cat.name}
                d={createArc(r, cat.percentage)}
                fill="none"
                stroke={cat.color}
                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}

          {/* Scale labels 0% and 100% */}
          <text x="42" y="172" className="text-[9px] fill-slate-400 font-mono font-medium" textAnchor="middle">0%</text>
          <text x="158" y="172" className="text-[9px] fill-slate-400 font-mono font-medium" textAnchor="middle">100%</text>
        </svg>

        {/* Center Percentage / Unit display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-3">
          <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {hoveredCategory
              ? `${categories.find((c) => c.name === hoveredCategory)?.percentage}%`
              : `${capacityPercent}%`}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {hoveredCategory
              ? hoveredCategory.split('&')[0]
              : 'Warehouse Load'}
          </span>
          <span className="text-[10px] text-emerald-700 font-mono font-medium">
            {hoveredCategory
              ? `${categories.find((c) => c.name === hoveredCategory)?.units.toLocaleString()} Units`
              : `${totalUnits.toLocaleString()} Total Units`}
          </span>
        </div>
      </div>

      {/* Categorical Legend list matching reference UI bottom dots */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-3 border-t border-slate-100 text-xs">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onMouseEnter={() => setHoveredCategory(cat.name)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`flex items-center gap-2 px-1.5 py-1 rounded-lg transition cursor-pointer ${
              hoveredCategory === cat.name ? 'bg-slate-50 font-semibold' : ''
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-slate-700 text-[11px] truncate flex-1">{cat.name}</span>
            <span className="font-mono text-[11px] font-bold text-slate-900 shrink-0">{cat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
