import React, { useState } from "react";
import { format, subDays } from "date-fns";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { api, getApiErrorMessage } from "../services/api";
import { Scale, Minus, Plus, X } from "lucide-react";

interface WeightTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate: string;
  onWeightLogged: () => void;
}

export const WeightTrackerModal: React.FC<WeightTrackerModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
  onWeightLogged,
}) => {
  const [weightKg, setWeightKg] = useState<number>(70);
  const [date, setDate] = useState(defaultDate);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");

  const adjustWeight = (delta: number) => {
    setWeightKg((prev) => {
      const next = parseFloat((prev + delta).toFixed(1));
      return next > 0 ? next : 0;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (weightKg <= 0) return;

    setIsLoading(true);
    setError(null);
    try {
      await api.post("/weight-logs", {
        weightKg,
        date,
        notes: notes.trim(),
      });
      onWeightLogged();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Body Weight"
      description="Log daily morning weigh-ins to track your body recomposition progress"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Date Selector with Quick Pills */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Measurement Date
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setDate(todayStr)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors ${
                  date === todayStr
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDate(yesterdayStr)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors ${
                  date === yesterdayStr
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                Yesterday
              </button>
            </div>
          </div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Weight with Nudge Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Weight (kg)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustWeight(-0.5)}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 transition-colors"
              title="-0.5 kg"
            >
              -0.5
            </button>
            <button
              type="button"
              onClick={() => adjustWeight(-0.1)}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 transition-colors"
              title="-0.1 kg"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <Input
                type="number"
                step="0.1"
                min="20"
                max="400"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="text-center text-lg font-black"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => adjustWeight(+0.1)}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 transition-colors"
              title="+0.1 kg"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => adjustWeight(+0.5)}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 transition-colors"
              title="+0.5 kg"
            >
              +0.5
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 'fasting morning weight', 'post-workout'..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isLoading}
            className="w-full sm:w-auto shadow-sm"
          >
            <Scale className="w-4 h-4 mr-1.5" />
            Save Measurement
          </Button>
        </div>
      </form>
    </Modal>
  );
};
