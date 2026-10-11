import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { api, getApiErrorMessage } from "../services/api";
import { DayDiarySummary, MealType, ApiResponse } from "../types";
import { DateNavigator } from "../components/DateNavigator";
import { MealSection } from "../components/MealSection";
import { FoodSearchModal } from "../components/FoodSearchModal";
import { CustomFoodModal } from "../components/CustomFoodModal";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Plus, AlertCircle } from "lucide-react";

export const FoodDiaryPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [diary, setDiary] = useState<DayDiarySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("Breakfast");
  const [isCustomFoodOpen, setIsCustomFoodOpen] = useState(false);

  const fetchDiary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse<DayDiarySummary>>(`/food-logs?date=${selectedDate}`);
      if (res.data.success) {
        setDiary(res.data.data);
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Food Diary
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Log and review your meals, serving portions, and nutritional breakdown for any date.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
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
            <Plus className="w-4 h-4 mr-1.5" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Date Navigator */}
      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Day Macro Totals Banner */}
      {diary && (
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Day Intake
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              {diary.totalCalories}{" "}
              <span className="text-sm font-semibold text-gray-500">kcal</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
              Protein: {diary.totalProtein}g
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
              Carbs: {diary.totalCarbs}g
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-100">
              Fat: {diary.totalFat}g
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              Fiber: {diary.totalFiber}g
            </div>
          </div>
        </div>
      )}

      {/* Diary Meal Categories */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : diary ? (
        <div className="space-y-4">
          <MealSection
            mealType="Breakfast"
            summary={diary.meals.Breakfast}
            onOpenSearch={handleOpenSearch}
            onDiaryUpdated={fetchDiary}
          />
          <MealSection
            mealType="Lunch"
            summary={diary.meals.Lunch}
            onOpenSearch={handleOpenSearch}
            onDiaryUpdated={fetchDiary}
          />
          <MealSection
            mealType="Dinner"
            summary={diary.meals.Dinner}
            onOpenSearch={handleOpenSearch}
            onDiaryUpdated={fetchDiary}
          />
          <MealSection
            mealType="Snacks"
            summary={diary.meals.Snacks}
            onOpenSearch={handleOpenSearch}
            onDiaryUpdated={fetchDiary}
          />
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
    </div>
  );
};
