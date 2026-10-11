import React from "react";
import { Card } from "./ui/Card";
import { PieChart } from "lucide-react";

interface MacroItem {
  name: string;
  consumed: number;
  target: number;
  unit: string;
  color: string;
  bgColor: string;
}

interface MacroProgressCardProps {
  protein: { consumed: number; target: number };
  carbs: { consumed: number; target: number };
  fat: { consumed: number; target: number };
  fiber: { consumed: number; target: number };
}

export const MacroProgressCard: React.FC<MacroProgressCardProps> = ({
  protein,
  carbs,
  fat,
  fiber,
}) => {
  const macros: MacroItem[] = [
    {
      name: "Protein",
      consumed: protein.consumed,
      target: protein.target,
      unit: "g",
      color: "bg-blue-600",
      bgColor: "bg-blue-50 text-blue-700",
    },
    {
      name: "Carbohydrates",
      consumed: carbs.consumed,
      target: carbs.target,
      unit: "g",
      color: "bg-amber-500",
      bgColor: "bg-amber-50 text-amber-700",
    },
    {
      name: "Fat",
      consumed: fat.consumed,
      target: fat.target,
      unit: "g",
      color: "bg-rose-500",
      bgColor: "bg-rose-50 text-rose-700",
    },
    {
      name: "Dietary Fiber",
      consumed: fiber.consumed,
      target: fiber.target,
      unit: "g",
      color: "bg-emerald-600",
      bgColor: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <Card>
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <PieChart className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Macronutrient Distribution</h3>
          <p className="text-xs text-gray-500">Daily targets and current intake</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {macros.map((macro) => {
          const percentage =
            macro.target > 0 ? Math.round((macro.consumed / macro.target) * 100) : 0;
          const progressWidth = Math.min(100, percentage);

          return (
            <div key={macro.name} className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-800">{macro.name}</span>
                <span className="text-xs font-bold text-gray-900">
                  {macro.consumed}
                  <span className="text-gray-400 font-normal"> / {macro.target}{macro.unit}</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200/80 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${macro.color}`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-1 text-[10px] text-gray-400">
                <span>{percentage}% reached</span>
                <span>{Math.max(0, macro.target - macro.consumed).toFixed(1)}{macro.unit} left</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
