import React, { useState } from "react";
import { format } from "date-fns";
import {
  X,
  Plus,
  Scale,
  Droplets,
  Check,
  Utensils,
  ChevronRight,
} from "lucide-react";
import { MealType } from "../types";
import { api } from "../services/api";
import { useQuickLog } from "../context/QuickLogContext";

interface MealOption {
  type: MealType;
  title: string;
  subtitle: string;
  caloriesHint: string;
  emoji: string;
  bgGradient: string;
}

const mealOptions: MealOption[] = [
  {
    type: "Breakfast",
    title: "Breakfast",
    subtitle: "Morning energy & coffee",
    caloriesHint: "450–650 kcal",
    emoji: "🍳",
    bgGradient: "from-amber-400/20 to-orange-400/10 border-amber-200/50 text-amber-700",
  },
  {
    type: "Lunch",
    title: "Lunch",
    subtitle: "Midday balanced meal",
    caloriesHint: "500–750 kcal",
    emoji: "🥗",
    bgGradient: "from-emerald-400/20 to-teal-400/10 border-emerald-200/50 text-emerald-700",
  },
  {
    type: "Dinner",
    title: "Dinner",
    subtitle: "Evening nourishment & protein",
    caloriesHint: "500–700 kcal",
    emoji: "🍲",
    bgGradient: "from-indigo-400/20 to-blue-400/10 border-indigo-200/50 text-indigo-700",
  },
  {
    type: "Snacks",
    title: "Snacks",
    subtitle: "Fruits, nuts & quick bites",
    caloriesHint: "150–300 kcal",
    emoji: "🍎",
    bgGradient: "from-rose-400/20 to-pink-400/10 border-rose-200/50 text-rose-700",
  },
];

export const QuickLogPopup: React.FC = () => {
  const {
    isQuickLogOpen,
    closeQuickLog,
    openFoodSearch,
    openWeightModal,
    openCustomFoodModal,
    triggerRefresh,
  } = useQuickLog();

  const [waterLoggedSuccess, setWaterLoggedSuccess] = useState(false);
  const [isLoggingWater, setIsLoggingWater] = useState(false);

  if (!isQuickLogOpen) return null;

  const today = format(new Date(), "yyyy-MM-dd");

  const handleQuickWater = async () => {
    if (isLoggingWater) return;
    setIsLoggingWater(true);
    try {
      await api.post("/water-logs", { amountMl: 250, date: today });
      setWaterLoggedSuccess(true);
      triggerRefresh();
      setTimeout(() => {
        setWaterLoggedSuccess(false);
        closeQuickLog();
      }, 700);
    } catch {
      // Ignore
    } finally {
      setIsLoggingWater(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={closeQuickLog}
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-6 z-10 animate-slide-up max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight leading-none">
                Quick Log
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Choose a meal or instant entry
              </p>
            </div>
          </div>

          <button
            onClick={closeQuickLog}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Meal Options */}
        <div className="mt-4 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Meals &amp; Dishes
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mealOptions.map((meal) => (
              <button
                key={meal.type}
                type="button"
                onClick={() => openFoodSearch(meal.type)}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-400 hover:bg-slate-50/70 transition-all duration-200 text-left group shadow-2xs hover:shadow-sm"
              >
                <span className="text-2xl shrink-0 p-2 rounded-xl bg-slate-100/70 group-hover:scale-110 transition-transform">
                  {meal.emoji}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 leading-tight">
                      {meal.title}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium block truncate mt-0.5">
                    {meal.caloriesHint}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-2.5">
            Quick Actions
          </span>

          <div className="grid grid-cols-3 gap-2">
            {/* Quick Water Button */}
            <button
              type="button"
              onClick={handleQuickWater}
              disabled={isLoggingWater}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                waterLoggedSuccess
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-cyan-50/60 border-cyan-200/60 text-cyan-800 hover:bg-cyan-100/70"
              }`}
            >
              {waterLoggedSuccess ? (
                <Check className="w-5 h-5 mb-1" />
              ) : (
                <Droplets className="w-5 h-5 mb-1 text-cyan-600" />
              )}
              <span className="text-xs font-bold leading-tight">
                {waterLoggedSuccess ? "Logged!" : "+250ml"}
              </span>
              <span className="text-[10px] opacity-75">Water</span>
            </button>

            {/* Quick Weight Button */}
            <button
              type="button"
              onClick={openWeightModal}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-amber-800 hover:bg-amber-100/70 text-center transition-all"
            >
              <Scale className="w-5 h-5 mb-1 text-amber-600" />
              <span className="text-xs font-bold leading-tight">Weight</span>
              <span className="text-[10px] opacity-75">Weigh-in</span>
            </button>

            {/* Quick Custom Food Button */}
            <button
              type="button"
              onClick={openCustomFoodModal}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100 text-center transition-all"
            >
              <Utensils className="w-5 h-5 mb-1 text-slate-500" />
              <span className="text-xs font-bold leading-tight">Custom</span>
              <span className="text-[10px] opacity-75">Add Food</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
