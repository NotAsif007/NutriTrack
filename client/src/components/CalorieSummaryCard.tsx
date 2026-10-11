import React from "react";
import { Card } from "./ui/Card";
import { Flame, AlertCircle, CheckCircle2 } from "lucide-react";

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
  // Clamped percentage for visual meter (max 100%)
  const meterWidth = Math.min(100, percentage);

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Flame className="w-5 h-5 fill-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Daily Calorie Budget</h3>
            <p className="text-xs text-gray-500">Target vs Consumed Energy</p>
          </div>
        </div>
        <div>
          {isOverTarget ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Over Budget (+{overTargetCalories} kcal)</span>
            </span>
          ) : percentage >= 90 ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>On Track ({remainingCalories} kcal left)</span>
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-500">
              {remainingCalories} kcal remaining
            </span>
          )}
        </div>
      </div>

      {/* Numerical Stats */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 my-2 text-center">
        <div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Budget</p>
          <p className="text-lg md:text-xl font-bold text-gray-900 mt-0.5">{targetCalories}</p>
          <span className="text-[10px] text-gray-400">kcal target</span>
        </div>
        <div className="border-x border-gray-100">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Consumed</p>
          <p className="text-lg md:text-xl font-bold text-emerald-600 mt-0.5">{consumedCalories}</p>
          <span className="text-[10px] text-gray-400">{percentage}% reached</span>
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            {isOverTarget ? "Over Limit" : "Remaining"}
          </p>
          <p
            className={`text-lg md:text-xl font-bold mt-0.5 ${
              isOverTarget ? "text-rose-600" : "text-gray-900"
            }`}
          >
            {isOverTarget ? `+${overTargetCalories}` : remainingCalories}
          </p>
          <span className="text-[10px] text-gray-400">kcal {isOverTarget ? "over" : "left"}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverTarget ? "bg-rose-500" : percentage >= 90 ? "bg-emerald-500" : "bg-emerald-600"
            }`}
            style={{ width: `${meterWidth}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
