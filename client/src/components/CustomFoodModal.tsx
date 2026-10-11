import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { api, getApiErrorMessage } from "../services/api";
import { Sparkles, Info, X } from "lucide-react";

interface CustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodCreated: () => void;
}

const categories = [
  { value: "Fruits", label: "🍎 Fruits" },
  { value: "Vegetables", label: "🥦 Vegetables" },
  { value: "Grains", label: "🌾 Grains & Cereals" },
  { value: "Dairy", label: "🥛 Dairy & Alternatives" },
  { value: "Meat & Poultry", label: "🍗 Meat & Poultry" },
  { value: "Fish & Seafood", label: "🐟 Fish & Seafood" },
  { value: "Eggs", label: "🥚 Eggs" },
  { value: "Legumes", label: "🫘 Legumes & Pulses" },
  { value: "Nuts & Seeds", label: "🥜 Nuts & Seeds" },
  { value: "Snacks", label: "🥨 Snacks" },
  { value: "Beverages", label: "☕ Beverages" },
  { value: "Mixed Meals", label: "🍲 Mixed Dishes & Homemade" },
];

export const CustomFoodModal: React.FC<CustomFoodModalProps> = ({
  isOpen,
  onClose,
  onFoodCreated,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Mixed Meals");
  const [servingSize, setServingSize] = useState<number>(100);
  const [servingUnit, setServingUnit] = useState("g");
  const [calories, setCalories] = useState<number>(150);
  const [protein, setProtein] = useState<number>(10);
  const [carbs, setCarbs] = useState<number>(15);
  const [fat, setFat] = useState<number>(5);
  const [fiber, setFiber] = useState<number>(2);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculated approximate calories from macros (4P + 4C + 9F)
  const estimatedCals = Math.round(protein * 4 + carbs * 4 + fat * 9);
  const calDifference = Math.abs(calories - estimatedCals);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Food name is required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await api.post("/foods/custom", {
        name: name.trim(),
        category,
        servingSize,
        servingUnit: servingUnit.trim(),
        calories,
        protein,
        carbs,
        fat,
        fiber,
      });
      onFoodCreated();
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
      title="Create Custom Food Item"
      description="Add a custom recipe, homemade meal, or packaged food to your private library"
      maxWidth="md"
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

        <Input
          label="Food Name"
          placeholder="e.g. Grandma's Chicken Soup, High-Protein Protein Shake"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Serving Size"
              type="number"
              step="any"
              min="0.1"
              value={servingSize}
              onChange={(e) => setServingSize(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Serving Unit"
              placeholder="g, ml, cup, bowl"
              value={servingUnit}
              onChange={(e) => setServingUnit(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Nutritional Macronutrients */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nutritional Values (per {servingSize} {servingUnit})
            </span>
            {estimatedCals > 0 && (
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Macro Sum: ~{estimatedCals} kcal
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Input
              label="Calories (kcal)"
              type="number"
              min="0"
              value={calories}
              onChange={(e) => setCalories(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Protein (g)"
              type="number"
              step="any"
              min="0"
              value={protein}
              onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Carbs (g)"
              type="number"
              step="any"
              min="0"
              value={carbs}
              onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Fat (g)"
              type="number"
              step="any"
              min="0"
              value={fat}
              onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="pt-1">
            <Input
              label="Dietary Fiber (g, optional)"
              type="number"
              step="any"
              min="0"
              value={fiber}
              onChange={(e) => setFiber(parseFloat(e.target.value) || 0)}
            />
          </div>

          {calDifference > 30 && calories > 0 && estimatedCals > 0 && (
            <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              Note: Entered calories ({calories} kcal) differ by {calDifference} kcal from 4P+4C+9F
              formula (~{estimatedCals} kcal). Please verify serving facts.
            </p>
          )}
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
            Save Custom Food
          </Button>
        </div>
      </form>
    </Modal>
  );
};
