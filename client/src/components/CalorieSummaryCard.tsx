import React, { useEffect, useRef } from "react";
import { Flame, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface CalorieSummaryCardProps {
  targetCalories: number;
  consumedCalories: number;
  remainingCalories: number;
  isOverTarget: boolean;
  overTargetCalories: number;
  percentage: number;
}

export const CalorieSummaryCard: React.FC<CalorieSummaryCardProps> = ({
  targetCalories,
  consumedCalories,
  remainingCalories,
  isOverTarget,
  overTargetCalories,
  percentage,
}) => {
  const { currentTheme } = useTheme();
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPct / 100) * circumference;

  const ringColor = isOverTarget
    ? "#EF4444"
    : currentTheme.primaryHex;

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = String(circumference);
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (circleRef.current) {
            circleRef.current.style.strokeDashoffset = String(offset);
          }
        }, 100);
      });
    }
  }, [offset, circumference]);

  const statusBadge = isOverTarget
    ? {
        Icon: AlertTriangle,
        text: `+${overTargetCalories} kcal over`,
        cls: "bg-rose-50 text-rose-600 border-rose-200",
      }
    : percentage >= 90
    ? {
        Icon: CheckCircle2,
        text: `On track (${remainingCalories} left)`,
        cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      }
    : {
        Icon: Flame,
        text: `${remainingCalories} kcal remaining`,
        cls: "bg-slate-50 text-slate-700 border-slate-200",
      };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-5 sm:p-6 transition-all relative overflow-hidden">
      {/* Background soft ambient gradient */}
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/25">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Daily Calorie Budget
            </h3>
            <p className="text-xs text-slate-400 font-medium">Energy consumption vs target</p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.cls}`}
        >
          <statusBadge.Icon className="w-3.5 h-3.5" />
          {statusBadge.text}
        </span>
      </div>

      {/* Main Stats + Circular Ring */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Circular Donut Ring */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="14"
            />
            {/* Animated Progress Ring */}
            <circle
              ref={circleRef}
              cx="88"
              cy="88"
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              style={{
                transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease",
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.06))",
              }}
            />
          </svg>

          {/* Donut Center Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span
              className={`text-3xl font-black tracking-tight leading-none ${
                isOverTarget ? "text-rose-600" : "text-slate-900"
              }`}
            >
              {isOverTarget ? `+${overTargetCalories}` : remainingCalories}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              {isOverTarget ? "Over Limit" : "kcal left"}
            </span>
            <span className="mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
              {clampedPct}%
            </span>
          </div>
        </div>

        {/* 3 Metric Pills (Target, Consumed, Remaining) */}
        <div className="flex-1 w-full space-y-2.5">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-xs font-bold text-slate-600">Daily Target</span>
            </div>
            <p className="text-base font-black text-slate-900">
              {targetCalories} <span className="text-xs font-semibold text-slate-400">kcal</span>
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-800">Eaten</span>
            </div>
            <p className="text-base font-black text-emerald-700">
              {consumedCalories} <span className="text-xs font-semibold text-emerald-500">kcal</span>
            </p>
          </div>

          <div
            className={`flex items-center justify-between p-3 rounded-2xl border ${
              isOverTarget
                ? "bg-rose-50/70 border-rose-100"
                : "bg-blue-50/60 border-blue-100/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOverTarget ? "bg-rose-500" : "bg-blue-500"
                }`}
              />
              <span
                className={`text-xs font-bold ${
                  isOverTarget ? "text-rose-800" : "text-blue-800"
                }`}
              >
                {isOverTarget ? "Over Limit" : "Remaining"}
              </span>
            </div>
            <p
              className={`text-base font-black ${
                isOverTarget ? "text-rose-700" : "text-blue-700"
              }`}
            >
              {isOverTarget ? `+${overTargetCalories}` : remainingCalories}{" "}
              <span className="text-xs font-semibold opacity-70">kcal</span>
            </p>
          </div>
        </div>
      </div>

      {/* Motivational Day Challenge footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Day Calories Challenge
        </span>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
          {isOverTarget ? "Adjust in next meal" : "On track for your goal"}
        </span>
      </div>
    </div>
  );
};
