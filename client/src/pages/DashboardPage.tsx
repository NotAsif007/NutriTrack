import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { api, getApiErrorMessage } from "../services/api";
import { DailyNutritionSummary, DayDiarySummary, MealType, ApiResponse } from "../types";
import { DateNavigator } from "../components/DateNavigator";
import { CalorieSummaryCard } from "../components/CalorieSummaryCard";
import { MacroProgressCard } from "../components/MacroProgressCard";
import { MealSection } from "../components/MealSection";
import { FoodSearchModal } from "../components/FoodSearchModal";
import { CustomFoodModal } from "../components/CustomFoodModal";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Plus, Utensils, AlertCircle } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [summary, setSummary] = useState<DailyNutritionSummary | null>(null);
  const [diary, setDiary] = useState<DayDiarySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal triggers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("Breakfast");
  const [isCustomFoodOpen, setIsCustomFoodOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, diaryRes] = await Promise.all([
        api.get<ApiResponse<DailyNutritionSummary>>(`/nutrition/daily?date=${selectedDate}`),
        api.get<ApiResponse<DayDiarySummary>>(`/food-logs?date=${selectedDate}`),
      ]);

      if (summaryRes.data.success) {
        setSummary(summaryRes.data.data);
      }
      if (diaryRes.data.success) {
        setDiary(diaryRes.data.data);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenSearch = (meal: MealType) => {
    setActiveMealType(meal);
    setIsSearchOpen(true);
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Friend";

  return (
    <div className="space-y-6">
      {/* Top Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, {firstName} 👋
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Track today&apos;s nutritional intake and stay in alignment with your calorie goals.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => handleOpenSearch("Breakfast")}
            className="shadow-sm shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Log Food
          </Button>
        </div>
      </div>

      {/* Date Navigator */}
      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        </div>
      ) : summary && diary ? (
        <>
          {/* Daily Calorie & Macronutrient Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CalorieSummaryCard
              targetCalories={summary.targetCalories}
              consumedCalories={summary.consumedCalories}
              remainingCalories={summary.remainingCalories}
              isOverTarget={summary.isOverTarget}
              overTargetCalories={summary.overTargetCalories}
              percentage={summary.percentage}
            />

            <MacroProgressCard
              protein={summary.macros.protein}
              carbs={summary.macros.carbs}
              fat={summary.macros.fat}
              fiber={summary.macros.fiber}
            />
          </div>

          {/* Meals Breakdown Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Daily Food Diary
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {diary.totalCalories} kcal total consumed
              </span>
            </div>

            <div className="space-y-4">
              <MealSection
                mealType="Breakfast"
                summary={diary.meals.Breakfast}
                onOpenSearch={handleOpenSearch}
                onDiaryUpdated={fetchDashboardData}
              />

              <MealSection
                mealType="Lunch"
                summary={diary.meals.Lunch}
                onOpenSearch={handleOpenSearch}
                onDiaryUpdated={fetchDashboardData}
              />

              <MealSection
                mealType="Dinner"
                summary={diary.meals.Dinner}
                onOpenSearch={handleOpenSearch}
                onDiaryUpdated={fetchDashboardData}
              />

              <MealSection
                mealType="Snacks"
                summary={diary.meals.Snacks}
                onOpenSearch={handleOpenSearch}
                onDiaryUpdated={fetchDashboardData}
              />
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Utensils className="w-10 h-10" />}
          title="No Data Available"
          description="Could not load your diary data for this date."
          actionText="Retry"
          onAction={fetchDashboardData}
        />
      )}

      {/* Search & Log Food Modal */}
      <FoodSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        selectedDate={selectedDate}
        defaultMeal={activeMealType}
        onFoodLogged={fetchDashboardData}
        onOpenCustomFoodModal={() => setIsCustomFoodOpen(true)}
      />

      {/* Custom Food Creation Modal */}
      <CustomFoodModal
        isOpen={isCustomFoodOpen}
        onClose={() => setIsCustomFoodOpen(false)}
        onFoodCreated={() => {
          setIsSearchOpen(true);
        }}
      />
    </div>
  );
};
