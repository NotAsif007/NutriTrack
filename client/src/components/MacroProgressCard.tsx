import React from "react";
import { Activity } from "lucide-react";

interface MacroProgressCardProps {
  protein: { consumed: number; target: number };
  carbs: { consumed: number; target: number };
  fat: { consumed: number; target: number };
  fiber: { consumed: number; target: number };
}

interface MacroRingProps {
  name: string;
  consumed: number;
  target: number;
  unit: string;
  color: string;
  emoji: string;
  bgLight: string;
}

const MacroRing: React.FC<MacroRingProps> = ({
  name,
  consumed,
  target,
  unit,
  color,
  emoji,
  bgLight,
}) => {
  const radius = 24;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const percentage = target > 0 ? Math.round((consumed / target) * 100) : 0;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPct / 100) * circumference;
  const isOver = consumed > target && target > 0;

  return (
    <div className={`flex flex-col items-center p-3 sm:p-3.5 rounded-2xl ${bgLight} border border-slate-100/80 transition-all`}>
      {/* SVG Circular Donut Ring */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg width="64" height="64" viewBox="0 0 64 64" className="transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={isOver ? "#EF4444" : color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>

        {/* Center emoji & % */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs leading-none">{emoji}</span>
          <span className="text-[10px] font-black text-slate-800 mt-0.5">{clampedPct}%</span>
        </div>
      </div>

      {/* Info labels */}
      <span className="text-xs font-bold text-slate-900 mt-2 text-center">{name}</span>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-xs font-black text-slate-900">
          {consumed}{unit}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">/ {target}{unit}</span>
      </div>

      <span className="text-[10px] text-slate-400 font-medium mt-0.5">
        {isOver ? (
          <span className="text-rose-600 font-bold">+{consumed - target}g over</span>
        ) : (
          <span>{Math.max(0, target - consumed)}g left</span>
        )}
      </span>
    </div>
  );
};

export const MacroProgressCard: React.FC<MacroProgressCardProps> = ({
  protein,
  carbs,
  fat,
  fiber,
}) => {
  const totalGrams = (protein.consumed || 0) + (carbs.consumed || 0) + (fat.consumed || 0) || 1;
  const pPct = Math.round(((protein.consumed || 0) / totalGrams) * 100);
  const cPct = Math.round(((carbs.consumed || 0) / totalGrams) * 100);
  const fPct = Math.round(((fat.consumed || 0) / totalGrams) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-5 sm:p-6 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Macronutrient Targets
            </h3>
            <p className="text-xs text-slate-400 font-medium">Daily goals & distribution</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl">
          <span>Split: {pPct}P / {cPct}C / {fPct}F</span>
        </div>
      </div>

      {/* 4 Circular Macro Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <MacroRing
          name="Carbohydrates"
          consumed={carbs.consumed}
          target={carbs.target}
          unit="g"
          color="#F59E0B"
          emoji="🍚"
          bgLight="bg-amber-50/50"
        />
        <MacroRing
          name="Protein"
          consumed={protein.consumed}
          target={protein.target}
          unit="g"
          color="#3B82F6"
          emoji="🥩"
          bgLight="bg-blue-50/50"
        />
        <MacroRing
          name="Fat"
          consumed={fat.consumed}
          target={fat.target}
          unit="g"
          color="#EF4444"
          emoji="🥑"
          bgLight="bg-rose-50/50"
        />
        <MacroRing
          name="Fiber"
          consumed={fiber.consumed}
          target={fiber.target}
          unit="g"
          color="#10B981"
          emoji="🥦"
          bgLight="bg-emerald-50/50"
        />
      </div>

      {/* Macro Split Proportion Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Today's Macronutrient Split
          </span>
          <span className="text-[10px] font-semibold text-slate-500">
            {protein.consumed + carbs.consumed + fat.consumed}g total
          </span>
        </div>

        <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 bg-slate-100">
          <div
            className="bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${cPct}%` }}
            title={`Carbs: ${cPct}%`}
          />
          <div
            className="bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pPct}%` }}
            title={`Protein: ${pPct}%`}
          />
          <div
            className="bg-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${fPct}%` }}
            title={`Fat: ${fPct}%`}
          />
        </div>

        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] font-bold text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Carbs ({cPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Protein ({pPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Fat ({fPct}%)
          </span>
        </div>
      </div>
    </div>
  );
};
