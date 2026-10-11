import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { api, getApiErrorMessage } from "../services/api";
import { DayDiarySummary, DailyNutritionSummary, MealType, ApiResponse } from "../types";
import { DateNavigator } from "../components/DateNavigator";
import { MealSection } from "../components/MealSection";
import { FoodSearchModal } from "../components/FoodSearchModal";
import { CustomFoodModal } from "../components/CustomFoodModal";
import { ExportSummaryModal } from "../components/ExportSummaryModal";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Plus, AlertCircle, Flame, Beef, Wheat, Droplets, Leaf, Share2 } from "lucide-react";

export const FoodDiaryPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [diary, setDiary] = useState<DayDiarySummary | null>(null);
  const [summary, setSummary] = useState<DailyNutritionSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("Breakfast");
  const [isCustomFoodOpen, setIsCustomFoodOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const fetchDiary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [diaryRes, summaryRes] = await Promise.all([
        api.get<ApiResponse<DayDiarySummary>>(`/food-logs?date=${selectedDate}`),
        api.get<ApiResponse<DailyNutritionSummary>>(`/nutrition/daily?date=${selectedDate}`),
      ]);

      if (diaryRes.data.success) {
        setDiary(diaryRes.data.data);
      }
      if (summaryRes.data.success) {
        setSummary(summaryRes.data.data);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchDiary();
  }, [fetchDiary]);

  const handleOpenSearch = (meal: MealType) => {
    setActiveMealType(meal);
    setIsSearchOpen(true);
  };

  const macroItems = diary
    ? [
        { label: "Calories", value: diary.totalCalories, unit: "kcal", icon: Flame, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        { label: "Protein", value: diary.totalProtein, unit: "g", icon: Beef, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        { label: "Carbs", value: diary.totalCarbs, unit: "g", icon: Wheat, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
        { label: "Fat", value: diary.totalFat, unit: "g", icon: Droplets, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
        { label: "Fiber", value: diary.totalFiber, unit: "g", icon: Leaf, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100" },
      ]
    : [];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Food Diary
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Log meals, review portions, and track nutritional breakdown for any date.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            onClick={() => setIsExportOpen(true)}
            className="border border-slate-200"
            title="Share or Export Daily Diary"
          >
            <Share2 className="w-4 h-4 mr-1 text-slate-600" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="soft"
            size="md"
            onClick={() => setIsCustomFoodOpen(true)}
          >
            Create Food
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleOpenSearch("Breakfast")}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Date Navigator */}
      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center gap-2 animate-slide-up">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Day Macro Totals Banner */}
      {diary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-slide-up">
          {macroItems.map((item) => (
            <div
              key={item.label}
              className={`p-3.5 rounded-2xl border ${item.bg} ${item.border} flex flex-col`}
            >
              <div className={`flex items-center gap-1.5 ${item.color} mb-1`}>
                <item.icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
              </div>
              <p className={`text-xl font-black ${item.color} leading-none`}>
                {item.value}
                <span className={`text-xs font-medium opacity-70 ml-1`}>{item.unit}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Diary Meal Categories */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : diary ? (
        <div className="space-y-3">
          <MealSection mealType="Breakfast" summary={diary.meals.Breakfast} onOpenSearch={handleOpenSearch} onDiaryUpdated={fetchDiary} />
          <MealSection mealType="Lunch" summary={diary.meals.Lunch} onOpenSearch={handleOpenSearch} onDiaryUpdated={fetchDiary} />
          <MealSection mealType="Dinner" summary={diary.meals.Dinner} onOpenSearch={handleOpenSearch} onDiaryUpdated={fetchDiary} />
          <MealSection mealType="Snacks" summary={diary.meals.Snacks} onOpenSearch={handleOpenSearch} onDiaryUpdated={fetchDiary} />
        </div>
      ) : null}

      {/* Search & Log Modal */}
      <FoodSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        selectedDate={selectedDate}
        defaultMeal={activeMealType}
        onFoodLogged={fetchDiary}
        onOpenCustomFoodModal={() => setIsCustomFoodOpen(true)}
      />

      {/* Custom Food Creation Modal */}
      <CustomFoodModal
        isOpen={isCustomFoodOpen}
        onClose={() => setIsCustomFoodOpen(false)}
        onFoodCreated={fetchDiary}
      />

      {/* Export & Share Daily Summary Modal */}
      <ExportSummaryModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        selectedDate={selectedDate}
        summary={summary}
        diary={diary}
      />
    </div>
  );
};
