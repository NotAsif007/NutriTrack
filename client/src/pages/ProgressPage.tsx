import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useTheme } from "../context/ThemeContext";
import { api, getApiErrorMessage } from "../services/api";
import { cachedGet } from "../services/cache";
import { WeeklyNutritionSummary, MonthlyNutritionSummary, IWeightLog, ApiResponse } from "../types";
import { Button } from "../components/ui/Button";
import { WeightTrackerModal } from "../components/WeightTrackerModal";
import { DayStreakCard } from "../components/DayStreakCard";
import { Skeleton } from "../components/ui/Skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Area,
  AreaChart,
  Cell,
} from "recharts";
import {
  Scale,
  AlertCircle,
  Plus,
  Flame,
} from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl px-3.5 py-2.5 text-xs border border-slate-800">
        <p className="font-bold text-slate-300 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="font-black text-emerald-400">
            {p.name}: {p.value} {p.name === "Weight" ? "kg" : "kcal"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ProgressPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<"Day" | "Week" | "Month" | "Year">("Week");
  const [weeklyData, setWeeklyData] = useState<WeeklyNutritionSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyNutritionSummary | null>(null);
  const [weightLogs, setWeightLogs] = useState<IWeightLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const fetchProgressData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [weekRes, monthRes, weightRes] = await Promise.all([
        cachedGet(`progress:weekly:${todayStr}`, () => api.get<ApiResponse<WeeklyNutritionSummary>>(`/nutrition/weekly?endDate=${todayStr}`).then((res) => res.data)),
        cachedGet(`progress:monthly:${todayStr}`, () => api.get<ApiResponse<MonthlyNutritionSummary>>(`/nutrition/monthly?endDate=${todayStr}`).then((res) => res.data)),
        cachedGet("progress:weights", () => api.get<ApiResponse<{ logs: IWeightLog[] }>>("/weight-logs").then((res) => res.data)),
      ]);

      if (weekRes.success) setWeeklyData(weekRes.data);
      if (monthRes.success) setMonthlyData(monthRes.data);
      if (weightRes.success) setWeightLogs(weightRes.data.logs);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [todayStr]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  // Format 7-day chart data
  const chartWeekData =
    weeklyData?.days.map((d) => ({
      name: format(new Date(d.date), "EEE"),
      Calories: d.hasLogs ? d.calories : 0,
      Target: d.targetCalories,
      hasLogs: d.hasLogs,
    })) || [];

  // Format weight trend data
  const chartWeightData = weightLogs.map((w) => ({
    date: format(new Date(w.date), "MMM d"),
    Weight: w.weightKg,
  }));

  const loggedDays = weeklyData?.loggedDaysCount ?? 0;
  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weightKg : null;

  return (
    <div className="space-y-6 animate-fade-in pb-16 lg:pb-8">
      {/* Top Header + Segmented Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Detailed caloric patterns, weekly trends, and body recomposition
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Time Range Switcher (Day / Week / Month / Year) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
            {(["Day", "Week", "Month", "Year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === range
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsWeightModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Log Weight
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center gap-2 animate-slide-up">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-3xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      ) : (
        <>
          {/* Hero Caloric Intake Bar Chart Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-5 sm:p-6 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">
                  {weeklyData?.averageCalories || 0}{" "}
                  <span className="text-base sm:text-lg font-bold text-slate-400">kcal avg</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Past 7 days · Daily target: {weeklyData?.targetCalories || 0} kcal
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <Flame className="w-3.5 h-3.5 text-emerald-600" />
                  {loggedDays}/7 Days Logged
                </span>
              </div>
            </div>

            {/* Recharts Bar Chart with Pill Rounded Bars */}
            <div className="h-60 sm:h-64 w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartWeekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                  {weeklyData && (
                    <ReferenceLine
                      y={weeklyData.targetCalories}
                      stroke="#EF4444"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `Target: ${weeklyData.targetCalories}`,
                        position: "insideTopRight",
                        fill: "#EF4444",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    />
                  )}
                  <Bar dataKey="Calories" radius={[12, 12, 12, 12]} maxBarSize={44}>
                    {chartWeekData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.hasLogs ? currentTheme.primaryHex : "#F1F5F9"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-2">
              * Bars represent daily logged caloric intake against your Mifflin-St Jeor target line.
            </p>
          </div>

          {/* 4 Quick Stat Metric Cards (Inspired by Image 1 & 3) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-4 sm:p-5">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Days
              </span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 leading-none">
                {monthlyData?.loggedDaysCount || loggedDays}
              </p>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 block">
                this month
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-4 sm:p-5">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Peak Intake
              </span>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 leading-none">
                {monthlyData?.highestCalories || 0}
              </p>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 block">
                kcal max
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-4 sm:p-5">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Current Weight
              </span>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1 leading-none">
                {currentWeight ? `${currentWeight} kg` : "—"}
              </p>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 block">
                body weight
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-4 sm:p-5">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Lowest Day
              </span>
              <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 leading-none">
                {monthlyData?.lowestCalories || 0}
              </p>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 block">
                kcal min
              </span>
            </div>
          </div>

          {/* 7-Day Challenge Streak */}
          <DayStreakCard selectedDate={todayStr} />

          {/* Body Weight History Trend Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-5 sm:p-6 transition-all space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Body Weight Trend
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Historical weigh-ins and trajectory</p>
                </div>
              </div>

              <Button variant="secondary" size="sm" onClick={() => setIsWeightModalOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Weigh-in
              </Button>
            </div>

            {chartWeightData.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/60 rounded-3xl border border-dashed border-slate-200">
                <Scale className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                <p className="text-sm font-bold text-slate-700">No weight records yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Start tracking morning weigh-ins to plot your body weight curve here.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={() => setIsWeightModalOpen(true)}
                >
                  Record First Weigh-in
                </Button>
              </div>
            ) : (
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartWeightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={["dataMin - 1", "dataMax + 1"]}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      unit="kg"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="Weight"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      fill="url(#weightGrad)"
                      dot={{ r: 4, fill: "#F59E0B", stroke: "white", strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: "white", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      <WeightTrackerModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        defaultDate={todayStr}
        onWeightLogged={fetchProgressData}
      />
    </div>
  );
};
