import React from "react";
import { CheckCircle2, Trophy } from "lucide-react";
import { format, startOfWeek, addDays, isPast, isToday } from "date-fns";

interface DayStreakCardProps {
  selectedDate: string;
}

export const DayStreakCard: React.FC<DayStreakCardProps> = ({ selectedDate }) => {
  const currentDate = new Date(selectedDate);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  // Determine completed days for challenge demonstration
  // Past days in week count as logged targets
  const completedCount = daysOfWeek.filter((d) => isPast(d) || isToday(d)).length;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-5 sm:p-6 transition-all">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Day Calories Challenge
            </h3>
            <p className="text-xs text-slate-400 font-medium">Weekly consistency challenge</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100/70 text-amber-800 border border-amber-200">
          🔥 {completedCount} Days Streak
        </span>
      </div>

      {/* 7 Checkmark Circles for Mon-Sun */}
      <div className="grid grid-cols-7 gap-2 text-center py-2">
        {daysOfWeek.map((day) => {
          const isDone = isPast(day) || isToday(day);
          const isCurrent = isToday(day);

          return (
            <div key={day.toISOString()} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
                {format(day, "EEE")}
              </span>
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 scale-100"
                    : "bg-slate-100 text-slate-300"
                } ${isCurrent ? "ring-2 ring-indigo-400 ring-offset-2" : ""}`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Completed {completedCount} of 7 daily goals</span>
        <span className="text-indigo-600 font-bold hover:underline cursor-pointer">
          View details →
        </span>
      </div>
    </div>
  );
};
