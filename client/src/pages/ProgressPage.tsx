import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { api, getApiErrorMessage } from "../services/api";
import { WeeklyNutritionSummary, MonthlyNutritionSummary, IWeightLog, ApiResponse } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { WeightTrackerModal } from "../components/WeightTrackerModal";
import { Skeleton } from "../components/ui/Skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Scale, Calendar, AlertCircle, Plus } from "lucide-react";

export const ProgressPage: React.FC = () => {
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
        api.get<ApiResponse<WeeklyNutritionSummary>>(`/nutrition/weekly?endDate=${todayStr}`),
        api.get<ApiResponse<MonthlyNutritionSummary>>(`/nutrition/monthly?endDate=${todayStr}`),
        api.get<ApiResponse<{ logs: IWeightLog[] }>>("/weight-logs"),
      ]);

      if (weekRes.data.success) setWeeklyData(weekRes.data.data);
      if (monthRes.data.success) setMonthlyData(monthRes.data.data);
      if (weightRes.data.success) setWeightLogs(weightRes.data.data.logs);
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
      name: format(new Date(d.date), "EEE (d)"),
      Calories: d.hasLogs ? d.calories : 0,
      Target: d.targetCalories,
      Status: d.hasLogs ? "Logged" : "No Log",
    })) || [];

  // Format weight trend data
  const chartWeightData = weightLogs.map((w) => ({
    date: format(new Date(w.date), "MMM d"),
    Weight: w.weightKg,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Nutrition Progress & History
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Evaluate your weekly intake consistency and track body weight trends over time.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsWeightModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Log Weight
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      ) : (
        <>
          {/* Weekly Calorie Intake Chart */}
          <Card className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Last 7 Days Caloric Intake</h3>
                  <p className="text-xs text-gray-500">Daily intake compared to your target</p>
                </div>
              </div>

              {weeklyData && (
                <div className="flex items-center space-x-4 text-xs font-semibold text-gray-600">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">
                    Avg: <span className="text-emerald-600 font-bold">{weeklyData.averageCalories}</span> kcal/day
                  </span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">
                    Logged: <span className="text-gray-900 font-bold">{weeklyData.loggedDaysCount} / 7</span> days
                  </span>
                </div>
              )}
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartWeekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "0.75rem",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                      fontSize: "12px",
                    }}
                  />
                  {weeklyData && (
                    <ReferenceLine
                      y={weeklyData.targetCalories}
                      stroke="#EF4444"
                      strokeDasharray="4 4"
                      label={{
                        value: `Target (${weeklyData.targetCalories})`,
                        position: "insideTopRight",
                        fill: "#EF4444",
                        fontSize: 10,
                      }}
                    />
                  )}
                  <Bar dataKey="Calories" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-gray-400 text-center">
              * Note: Days with zero recorded entries reflect unlogged periods, not zero-calorie fasting.
            </p>
          </Card>

          {/* 30-Day Monthly Summary Statistics */}
          {monthlyData && (
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">30-Day Nutrition Highlights</h3>
                  <p className="text-xs text-gray-500">Summary metrics across the past month</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[11px] text-gray-500 uppercase font-medium">Logged Days</span>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {monthlyData.loggedDaysCount} <span className="text-xs text-gray-400">/ 30</span>
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[11px] text-gray-500 uppercase font-medium">Average Intake</span>
                  <p className="text-lg font-bold text-emerald-600 mt-1">
                    {monthlyData.averageCalories} <span className="text-xs text-gray-400">kcal</span>
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[11px] text-gray-500 uppercase font-medium">Highest Intake</span>
                  <p className="text-lg font-bold text-amber-600 mt-1">
                    {monthlyData.highestCalories} <span className="text-xs text-gray-400">kcal</span>
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[11px] text-gray-500 uppercase font-medium">Lowest Intake</span>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {monthlyData.lowestCalories} <span className="text-xs text-gray-400">kcal</span>
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Body Weight Trend Chart */}
          <Card className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Body Weight History</h3>
                  <p className="text-xs text-gray-500">Logged weigh-ins and progress curve</p>
                </div>
              </div>

              <Button variant="secondary" size="sm" onClick={() => setIsWeightModalOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Weigh-in
              </Button>
            </div>

            {chartWeightData.length === 0 ? (
              <div className="text-center py-10 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                <Scale className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No weight records logged yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setIsWeightModalOpen(true)}
                >
                  Record Initial Weight
                </Button>
              </div>
            ) : (
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartWeightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} />
                    <YAxis
                      domain={["dataMin - 2", "dataMax + 2"]}
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                      unit="kg"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "0.75rem",
                        border: "1px solid #E5E7EB",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Weight"
                      stroke="#D97706"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#D97706" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="text-[11px] text-gray-400 text-center">
              * Daily weight fluctuations reflect hydration, glycogen, and sodium balance rather than immediate adipose tissue changes.
            </p>
          </Card>
        </>
      )}

      {/* Weight Tracker Modal */}
      <WeightTrackerModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        defaultDate={todayStr}
        onWeightLogged={fetchProgressData}
      />
    </div>
  );
};
