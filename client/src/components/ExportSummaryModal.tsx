import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { DailyNutritionSummary, DayDiarySummary } from "../types";
import { Copy, Check, Download } from "lucide-react";

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  summary: DailyNutritionSummary | null;
  diary: DayDiarySummary | null;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  summary,
  diary,
}) => {
  const [copied, setCopied] = useState(false);

  const generateReportText = () => {
    if (!summary || !diary) return "";

    let text = `🥗 NutriTrack Daily Nutrition Report - ${selectedDate}\n`;
    text += `=========================================\n\n`;
    text += `📊 CALORIES SUMMARY\n`;
    text += `• Target: ${summary.targetCalories} kcal\n`;
    text += `• Consumed: ${summary.consumedCalories} kcal (${summary.percentage}%)\n`;
    text += `• Status: ${
      summary.isOverTarget
        ? `Over by ${summary.overTargetCalories} kcal`
        : `${summary.remainingCalories} kcal remaining`
    }\n\n`;

    text += `⚡ MACRONUTRIENTS\n`;
    text += `• Protein: ${summary.macros.protein.consumed}g / ${summary.macros.protein.target}g\n`;
    text += `• Carbs: ${summary.macros.carbs.consumed}g / ${summary.macros.carbs.target}g\n`;
    text += `• Fat: ${summary.macros.fat.consumed}g / ${summary.macros.fat.target}g\n`;
    text += `• Fiber: ${summary.macros.fiber.consumed}g / ${summary.macros.fiber.target}g\n\n`;

    text += `🍽️ MEALS LOGGED\n`;
    const mealKeys: (keyof typeof diary.meals)[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];
    mealKeys.forEach((key) => {
      const meal = diary.meals[key];
      text += `\n[${key.toUpperCase()}] - ${meal.calories} kcal\n`;
      if (meal.items.length === 0) {
        text += `  (No items recorded)\n`;
      } else {
        meal.items.forEach((item) => {
          text += `  • ${item.foodNameSnapshot} (${item.quantity}${item.servingUnit}): ${item.calories} kcal [P:${item.protein}g, C:${item.carbs}g, F:${item.fat}g]\n`;
        });
      }
    });

    text += `\nGenerated via NutriTrack\n`;
    return text;
  };

  const handleCopy = async () => {
    const report = generateReportText();
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadJson = () => {
    if (!summary || !diary) return;
    const data = {
      date: selectedDate,
      summary,
      diary,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutritrack-summary-${selectedDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reportText = generateReportText();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export & Share Daily Nutrition"
      description={`Export formatted meal diary for ${selectedDate}`}
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {/* Preview Container */}
        <div className="relative">
          <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl text-xs font-mono max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
            {reportText || "Loading daily data..."}
          </pre>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJson}
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download JSON
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-1 sm:flex-initial">
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-emerald-300" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  Copy Report Text
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
