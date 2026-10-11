import React from "react";
import { WeeklyNutritionSummary } from "../types";
import { format, parseISO } from "date-fns";
import { useTheme } from "../context/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  CartesianGrid,
} from "recharts";
import { BarChart2 } from "lucide-react";

interface WeeklyIntakeCardProps {
  weeklyData: WeeklyNutritionSummary | null;
  selectedDate: string;
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl px-3 py-2 text-xs border border-slate-800">
        <p className="font-bold text-slate-300 mb-0.5">{label}</p>
        <p className="font-black text-emerald-400 text-sm">
          {payload[0].value} <span className="text-[10px] text-slate-400 font-normal">kcal</span>
        </p>
      </div>
    );
  }
  return null;
};

export const WeeklyIntakeCard: React.FC<WeeklyIntakeCardProps> = ({
  weeklyData,
  selectedDate,
}) => {
  const { currentTheme } = useTheme();
  if (!weeklyData) return null;

  const chartData = (weeklyData.days || []).map((item) => {
    const d = parseISO(item.date);
    const dayName = format(d, "EEE");
    const isSelected = item.date === selectedDate;
    return {
      date: item.date,
      name: dayName,
      Calories: item.hasLogs ? item.calories : 0,
      isSelected,
    };
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-5 sm:p-6 transition-all">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Weekly Intake
            </h3>
            <p className="text-xs text-slate-400 font-medium">7-Day caloric trend</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
            Avg: {weeklyData.averageCalories} kcal
          </span>
        </div>
      </div>

      {/* Bar Chart with Pill Rounded Bars */}
      <div className="h-48 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
            {weeklyData.targetCalories > 0 && (
              <ReferenceLine
                y={weeklyData.targetCalories}
                stroke="#EF4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
            )}
            <Bar dataKey="Calories" radius={[10, 10, 10, 10]} maxBarSize={32}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isSelected
                      ? currentTheme.primaryHex
                      : entry.Calories > 0
                      ? currentTheme.previewColors[1] || currentTheme.primaryHex
                      : "#F1F5F9"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-2 pt-2 border-t border-slate-50">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Active Day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 inline-block" /> Logged Days
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-rose-500 inline-block" /> Target ({weeklyData.targetCalories})
        </span>
      </div>
    </div>
  );
};
