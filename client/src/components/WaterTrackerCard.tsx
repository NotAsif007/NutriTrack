import React, { useState, useEffect } from "react";
import { Droplets, Minus, RotateCcw, Award } from "lucide-react";

interface WaterTrackerCardProps {
  selectedDate: string;
}

export const WaterTrackerCard: React.FC<WaterTrackerCardProps> = ({ selectedDate }) => {
  const defaultTarget = 2500; // ml
  const storageKey = `nutritrack_water_${selectedDate}`;

  const [currentWater, setCurrentWater] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCurrentWater(saved ? parseInt(saved, 10) : 0);
    } catch {
      setCurrentWater(0);
    }
  }, [storageKey]);

  const updateWater = (amount: number) => {
    setCurrentWater((prev) => {
      const next = Math.max(0, prev + amount);
      try {
        localStorage.setItem(storageKey, next.toString());
      } catch {
        // Fallback
      }
      return next;
    });
  };

  const resetWater = () => {
    setCurrentWater(0);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Fallback
    }
  };

  const percentage = Math.min(100, Math.round((currentWater / defaultTarget) * 100));
  const isGoalReached = currentWater >= defaultTarget;
  const glasses = (currentWater / 250).toFixed(0);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-5 sm:p-6 transition-all relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Droplets className="w-5 h-5 fill-cyan-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 tracking-tight">Drink Water</h3>
              {isGoalReached && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-100 text-cyan-800 border border-cyan-200">
                  <Award className="w-3 h-3 text-cyan-600" /> Goal Reached!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">{glasses} of 10 glasses logged</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-lg font-black text-cyan-700">{currentWater}</span>
            <span className="text-xs font-bold text-slate-400 ml-1">/ {defaultTarget} ml</span>
          </div>
          {currentWater > 0 && (
            <button
              onClick={resetWater}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              title="Reset water log"
              aria-label="Reset water log"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar with Water Gradient */}
      <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isGoalReached
              ? "bg-gradient-to-r from-cyan-400 to-emerald-400"
              : "bg-gradient-to-r from-cyan-500 to-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => updateWater(250)}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-cyan-300 hover:bg-cyan-50/50 text-slate-700 transition-all group"
        >
          <span className="text-base group-hover:scale-110 transition-transform">🥛</span>
          <span className="text-xs font-black text-cyan-700 mt-0.5">+250 ml</span>
          <span className="text-[10px] text-slate-400 font-semibold">1 Glass</span>
        </button>

        <button
          type="button"
          onClick={() => updateWater(500)}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-cyan-300 hover:bg-cyan-50/50 text-slate-700 transition-all group"
        >
          <span className="text-base group-hover:scale-110 transition-transform">💧</span>
          <span className="text-xs font-black text-cyan-700 mt-0.5">+500 ml</span>
          <span className="text-[10px] text-slate-400 font-semibold">1 Bottle</span>
        </button>

        <button
          type="button"
          onClick={() => updateWater(750)}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-cyan-300 hover:bg-cyan-50/50 text-slate-700 transition-all group"
        >
          <span className="text-base group-hover:scale-110 transition-transform">🧊</span>
          <span className="text-xs font-black text-cyan-700 mt-0.5">+750 ml</span>
          <span className="text-[10px] text-slate-400 font-semibold">Flask</span>
        </button>

        <button
          type="button"
          disabled={currentWater <= 0}
          onClick={() => updateWater(-250)}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <Minus className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600 mt-0.5">-250 ml</span>
          <span className="text-[10px] text-slate-400 font-semibold">Undo</span>
        </button>
      </div>
    </div>
  );
};
