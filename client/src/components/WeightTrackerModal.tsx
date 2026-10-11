import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { api, getApiErrorMessage } from "../services/api";

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
      description="Track body weight measurements over time"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Measurement Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <Input
          label="Weight (kg)"
          type="number"
          step="0.1"
          min="20"
          max="400"
          value={weightKg}
          onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 'morning fasting weight'"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
            Save Measurement
          </Button>
        </div>
      </form>
    </Modal>
  );
};
