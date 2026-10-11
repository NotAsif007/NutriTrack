import React, { useState } from "react";
import { MealSummary, IFoodLog, MealType } from "../types";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "./ui/Button";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { api, getApiErrorMessage } from "../services/api";

interface MealSectionProps {
  mealType: MealType;
  summary: MealSummary;
  onOpenSearch: (mealType: MealType) => void;
  onDiaryUpdated: () => void;
}

export const MealSection: React.FC<MealSectionProps> = ({
  mealType,
  summary,
  onOpenSearch,
  onDiaryUpdated,
}) => {
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(100);
  const [isUpdating, setIsUpdating] = useState(false);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<IFoodLog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h4 className="text-sm font-bold text-gray-900">{mealType}</h4>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/40">
            {summary.calories} kcal
          </span>
          <span className="text-[11px] text-gray-400 hidden sm:inline">
            P: {summary.protein}g • C: {summary.carbs}g • F: {summary.fat}g
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onOpenSearch(mealType)}
          className="text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Food
        </Button>
      </div>

      {actionError && (
        <div className="mx-4 mt-3 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg">
          {actionError}
        </div>
      )}

      {/* Food Entries List */}
      <div className="divide-y divide-gray-100">
        {summary.items.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400">
            No foods logged for {mealType.toLowerCase()} yet.
          </div>
        ) : (
          summary.items.map((log) => {
            const isEditing = editingLogId === log._id;

            return (
              <div
                key={log._id}
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50/50 transition-colors"
              >
                {/* Food Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {log.foodNameSnapshot}
                    </span>
                    {log.notes && (
                      <span className="text-[11px] text-gray-400 italic">({log.notes})</span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                      <span className="text-xs text-gray-500">{log.servingUnit}</span>
                      <button
                        onClick={() => saveEditing(log._id)}
                        disabled={isUpdating}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Save quantity"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {log.quantity} {log.servingUnit} • P: {log.protein}g • C: {log.carbs}g • F:{" "}
                      {log.fat}g
                    </p>
                  )}
                </div>

                {/* Numerical Subtotal & Controls */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-800">{log.calories} kcal</span>
                  <div className="flex items-center space-x-1">
                    {!isEditing && (
                      <button
                        onClick={() => startEditing(log)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit quantity"
                        aria-label="Edit quantity"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteTarget(log)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete entry"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Dialog for Log Deletion */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Food Log Entry"
        message={`Are you sure you want to remove "${deleteTarget?.foodNameSnapshot}" from your ${mealType.toLowerCase()}? This action cannot be undone.`}
        confirmText="Remove Entry"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};
