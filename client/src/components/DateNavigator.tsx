import React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO, addDays, subDays, isToday } from "date-fns";

interface DateNavigatorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, onDateChange }) => {
  const currentDate = parseISO(selectedDate);

  const handlePrev = () => {
    onDateChange(format(subDays(currentDate, 1), "yyyy-MM-dd"));
  };

  const handleNext = () => {
    onDateChange(format(addDays(currentDate, 1), "yyyy-MM-dd"));
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
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 md:p-4 rounded-xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrev}
          aria-label="Previous day"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 px-2">
          <CalendarIcon className="w-4 h-4 text-emerald-600 hidden sm:block" />
          <span className="text-sm md:text-base font-semibold text-gray-900">
            {format(currentDate, "EEEE, MMM d, yyyy")}
          </span>
          {isCurrentDayToday && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full uppercase tracking-wider">
              Today
            </span>
          )}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next day"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        {!isCurrentDayToday && (
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            Jump to Today
          </button>
        )}
        <label className="relative cursor-pointer">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDirectPicker}
            className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
