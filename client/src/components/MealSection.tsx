import React, { useState } from "react";
import { MealSummary, IFoodLog, MealType } from "../types";
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { api, getApiErrorMessage } from "../services/api";

interface MealSectionProps {
  mealType: MealType;
  summary: MealSummary;
  onOpenSearch: (mealType: MealType) => void;
  onDiaryUpdated: () => void;
}

const mealDetails: Record<
  MealType,
  {
    icon: string;
    targetRange: string;
    accentColor: string;
    bgAccent: string;
    borderAccent: string;
    badgeColor: string;
  }
> = {
  Breakfast: {
    icon: "🍳",
    targetRange: "Recommended: 400 – 600 kcal",
    accentColor: "text-amber-600",
    bgAccent: "bg-amber-50/70",
    borderAccent: "border-amber-100",
    badgeColor: "bg-amber-100/70 text-amber-800",
  },
  Lunch: {
    icon: "🥗",
    targetRange: "Recommended: 500 – 750 kcal",
    accentColor: "text-emerald-600",
    bgAccent: "bg-emerald-50/70",
    borderAccent: "border-emerald-100",
    badgeColor: "bg-emerald-100/70 text-emerald-800",
  },
  Dinner: {
    icon: "🍲",
    targetRange: "Recommended: 500 – 700 kcal",
    accentColor: "text-indigo-600",
    bgAccent: "bg-indigo-50/70",
    borderAccent: "border-indigo-100",
    badgeColor: "bg-indigo-100/70 text-indigo-800",
  },
  Snacks: {
    icon: "🍎",
    targetRange: "Recommended: 150 – 300 kcal",
    accentColor: "text-rose-600",
    bgAccent: "bg-rose-50/70",
    borderAccent: "border-rose-100",
    badgeColor: "bg-rose-100/70 text-rose-800",
  },
};

export const MealSection: React.FC<MealSectionProps> = ({
  mealType,
  summary,
  onOpenSearch,
  onDiaryUpdated,
}) => {
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(100);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<IFoodLog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const meta = mealDetails[mealType];
  const hasItems = summary.items.length > 0;

  const startEditing = (log: IFoodLog) => {
    setEditingLogId(log._id);
    setEditQuantity(log.quantity);
  };

  const cancelEditing = () => {
    setEditingLogId(null);
  };

  const saveEditing = async (logId: string) => {
    if (editQuantity <= 0) return;
    setIsUpdating(true);
    setActionError(null);
    try {
      await api.patch(`/food-logs/${logId}`, { quantity: editQuantity });
      setEditingLogId(null);
      onDiaryUpdated();
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await api.delete(`/food-logs/${deleteTarget._id}`);
      setDeleteTarget(null);
      onDiaryUpdated();
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:border-slate-200/80">
      {/* Header Row */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3.5 flex-1 cursor-pointer select-none"
        >
          {/* Meal Icon Thumbnail */}
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-subtle shrink-0">
            {meta.icon}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-slate-900 tracking-tight">{mealType}</h4>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  hasItems ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-500"
                }`}
              >
                {summary.calories} kcal
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
              {hasItems
                ? `${summary.items.length} item${summary.items.length > 1 ? "s" : ""} · P: ${summary.protein}g, C: ${summary.carbs}g, F: ${summary.fat}g`
                : meta.targetRange}
            </p>
          </div>
        </div>

        {/* Circular '+' Log Button and Expand Chevron */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenSearch(mealType)}
            className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm group"
            title={`Log food to ${mealType}`}
            aria-label={`Log food to ${mealType}`}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {hasItems && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Expand or collapse meal entries"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div className="mx-4 mb-3 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-100">
          {actionError}
        </div>
      )}

      {/* Expanded Food Items List */}
      {isExpanded && (
        <div className="border-t border-slate-50">
          {!hasItems ? (
            <div
              onClick={() => onOpenSearch(mealType)}
              className="py-6 px-4 text-center cursor-pointer hover:bg-slate-50/50 transition-colors group"
            >
              <p className="text-xs text-slate-400 group-hover:text-emerald-700 transition-colors font-medium">
                No items logged yet. Tap here to add {mealType.toLowerCase()} foods.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50/80">
              {summary.items.map((log) => {
                const isEditing = editingLogId === log._id;

                return (
                  <div
                    key={log._id}
                    className="px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Food Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {log.foodNameSnapshot}
                        </span>
                        {log.notes && (
                          <span className="text-[11px] text-slate-400 italic truncate">
                            ({log.notes})
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-bold"
                          />
                          <span className="text-xs text-slate-500 font-semibold">{log.servingUnit}</span>
                          <button
                            onClick={() => saveEditing(log._id)}
                            disabled={isUpdating}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Save quantity"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-medium">
                          <span>
                            {log.quantity} {log.servingUnit}
                          </span>
                          <span>•</span>
                          <span className="text-blue-600 font-semibold">P: {log.protein}g</span>
                          <span>•</span>
                          <span className="text-amber-600 font-semibold">C: {log.carbs}g</span>
                          <span>•</span>
                          <span className="text-rose-600 font-semibold">F: {log.fat}g</span>
                        </div>
                      )}
                    </div>

                    {/* Calories & Action Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-sm font-black text-slate-900">{log.calories} kcal</span>
                      <div className="flex items-center gap-1">
                        {!isEditing && (
                          <button
                            onClick={() => startEditing(log)}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                            title="Edit portion"
                            aria-label="Edit portion"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(log)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete entry"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Remove Food Entry"
        message={`Are you sure you want to remove "${deleteTarget?.foodNameSnapshot}" from your ${mealType.toLowerCase()}?`}
        confirmText="Remove"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};
