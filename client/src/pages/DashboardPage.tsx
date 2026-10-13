import React, { useState, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { api, getApiErrorMessage } from "../services/api";
import { cachedGet } from "../services/cache";
import {
  DailyNutritionSummary,
  DayDiarySummary,
  WeeklyNutritionSummary,
  MealType,
  ApiResponse,
} from "../types";
import { DateNavigator } from "../components/DateNavigator";
import { CalorieSummaryCard } from "../components/CalorieSummaryCard";
import { MacroProgressCard } from "../components/MacroProgressCard";
import { MealSection } from "../components/MealSection";
import { FoodSearchModal } from "../components/FoodSearchModal";
import { CustomFoodModal } from "../components/CustomFoodModal";
import { WaterTrackerCard } from "../components/WaterTrackerCard";
import { WeeklyIntakeCard } from "../components/WeeklyIntakeCard";
import { DayStreakCard } from "../components/DayStreakCard";
import { ExportSummaryModal } from "../components/ExportSummaryModal";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { useQuickLog } from "../context/QuickLogContext";
import {
  Utensils,
  AlertCircle,
  Share2,
  Calendar,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [summary, setSummary] = useState<DailyNutritionSummary | null>(null);
  const [diary, setDiary] = useState<DayDiarySummary | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyNutritionSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal triggers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("Breakfast");
  const [isCustomFoodOpen, setIsCustomFoodOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, diaryRes, weeklyRes] = await Promise.all([
        cachedGet(`dashboard:daily:${selectedDate}`, () => api.get<ApiResponse<DailyNutritionSummary>>(`/nutrition/daily?date=${selectedDate}`).then((res) => res.data)),
        cachedGet(`dashboard:diary:${selectedDate}`, () => api.get<ApiResponse<DayDiarySummary>>(`/food-logs?date=${selectedDate}`).then((res) => res.data)),
        cachedGet(`dashboard:weekly:${selectedDate}`, () => api.get<ApiResponse<WeeklyNutritionSummary>>(`/nutrition/weekly?endDate=${selectedDate}`).then((res) => res.data)),
      ]);

      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }
      if (diaryRes.success) {
        setDiary(diaryRes.data);
      }
      if (weeklyRes.success) {
        setWeeklyData(weeklyRes.data);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  const { refreshKey } = useQuickLog();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);

  const handleOpenSearch = (meal: MealType) => {
    setActiveMealType(meal);
    setIsSearchOpen(true);
  };

  const formattedDateTitle = format(parseISO(selectedDate), "EEEE, d MMMM yyyy");

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Sleek Subheader: Date title, Export, and Create Food buttons (top log button removed) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-700 tracking-tight">
            {formattedDateTitle}
          </h2>
          {selectedDate === format(new Date(), "yyyy-MM-dd") && (
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Today
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExportOpen(true)}
            className="border border-slate-200/80 bg-white text-xs h-8 px-2.5 shadow-2xs"
            title="Export / Share Daily Report"
          >
            <Share2 className="w-3.5 h-3.5 mr-1 text-slate-600" />
            <span>Export Report</span>
          </Button>

          <Button
            variant="soft"
            size="sm"
            onClick={() => setIsCustomFoodOpen(true)}
            className="text-xs h-8 px-2.5"
          >
            + Create Food
          </Button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center gap-2 animate-slide-up">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-44 w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-56 w-full rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-5">
            <Skeleton className="h-56 w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
        </div>
      ) : summary && diary ? (
        /* Main Grid: Responsive 2-Column Desktop & Tablet Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main / Primary Column (lg:col-span-7 xl:col-span-8) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* 1. Daily Calorie Budget HERO Card (Comes FIRST!) */}
            <CalorieSummaryCard
              targetCalories={summary.targetCalories}
              consumedCalories={summary.consumedCalories}
              remainingCalories={summary.remainingCalories}
              isOverTarget={summary.isOverTarget}
              overTargetCalories={summary.overTargetCalories}
              percentage={summary.percentage}
            />

            {/* 2. Macronutrient Targets Progress Card */}
            <MacroProgressCard
              protein={summary.macros.protein}
              carbs={summary.macros.carbs}
              fat={summary.macros.fat}
              fiber={summary.macros.fiber}
            />

            {/* 3. Interactive 7-Day Week Calendar Strip right above meals */}
            <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

            {/* 4. Planned Meals Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Planned Meals
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Daily food schedule & portion control
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                  {diary.totalCalories} kcal total
                </span>
              </div>

              <div className="space-y-3">
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
          </div>

          {/* Right Panel / Analytics & Challenges (lg:col-span-5 xl:col-span-4) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5">
            {/* Weekly Caloric Intake Bar Chart */}
            <WeeklyIntakeCard weeklyData={weeklyData} selectedDate={selectedDate} />

            {/* 7-Day Streak Challenge Card */}
            <DayStreakCard selectedDate={selectedDate} />

            {/* Drink Water Hydration Tracker */}
            <WaterTrackerCard selectedDate={selectedDate} />
          </div>
        </div>
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
