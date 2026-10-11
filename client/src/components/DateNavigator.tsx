import React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import {
  format,
  parseISO,
  addDays,
  subDays,
  isToday,
  isSameDay,
  startOfWeek,
} from "date-fns";

interface DateNavigatorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, onDateChange }) => {
  const currentDate = parseISO(selectedDate);

  // Compute 7 days of the current week (starting on Monday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const handlePrevWeek = () => {
    onDateChange(format(subDays(currentDate, 7), "yyyy-MM-dd"));
  };

  const handleNextWeek = () => {
    onDateChange(format(addDays(currentDate, 7), "yyyy-MM-dd"));
  };

  const handleToday = () => {
    onDateChange(format(new Date(), "yyyy-MM-dd"));
  };

  const handleDirectPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onDateChange(e.target.value);
    }
  };

  const isCurrentDayToday = isToday(currentDate);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-4 sm:p-5 transition-all">
      {/* Top Header: Month & Navigation */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100/80 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight block">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {format(currentDate, "EEEE, d MMM")}
            </span>
          </div>
          {isCurrentDayToday && (
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
              Today
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {!isCurrentDayToday && (
            <button
              onClick={handleToday}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Today
            </button>
          )}

          <button
            onClick={handlePrevWeek}
            aria-label="Previous week"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors active:scale-90"
            title="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNextWeek}
            aria-label="Next week"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors active:scale-90"
            title="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <label className="relative cursor-pointer p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors" title="Select specific date">
            <CalendarIcon className="w-4 h-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDirectPicker}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Pick date"
            />
          </label>
        </div>
      </div>

      {/* 7-Day Interactive Week Calendar Strip */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, currentDate);
          const isDayToday = isToday(day);
          const dayDateStr = format(day, "yyyy-MM-dd");

          return (
            <button
              key={dayDateStr}
              type="button"
              onClick={() => onDateChange(dayDateStr)}
              className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-2xl transition-all duration-200 group ${
                isSelected
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 scale-[1.03]"
                  : isDayToday
                  ? "bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/80 border border-emerald-200/50"
                  : "bg-slate-50/60 hover:bg-slate-100/80 text-slate-600 border border-transparent"
              }`}
            >
              <span
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 ${
                  isSelected ? "text-slate-300" : isDayToday ? "text-emerald-700 font-extrabold" : "text-slate-400"
                }`}
              >
                {format(day, "EEE")}
              </span>
              <span
                className={`text-sm sm:text-base font-black leading-tight ${
                  isSelected ? "text-white" : isDayToday ? "text-emerald-800" : "text-slate-800"
                }`}
              >
                {format(day, "d")}
              </span>
              {/* Active / Today Indicator Dot */}
              <div className="h-1.5 flex items-center justify-center mt-1">
                {isSelected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                ) : isDayToday ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
