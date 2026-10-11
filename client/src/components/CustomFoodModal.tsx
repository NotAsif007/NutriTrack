import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { api, getApiErrorMessage } from "../services/api";

interface CustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodCreated: () => void;
}

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

  const categories = [
    "Fruits",
    "Vegetables",
    "Grains",
    "Dairy",
    "Meat & Poultry",
    "Fish & Seafood",
    "Eggs",
    "Legumes",
    "Nuts & Seeds",
    "Snacks",
    "Beverages",
    "Mixed Meals",
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Food Item"
      description="Add a private custom recipe or packaged food to your library"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Food Name"
          placeholder="e.g. Homemade Mango Shake, High-Protein Salad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

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
              label="Unit"
              placeholder="g, ml, piece"
              value={servingUnit}
              onChange={(e) => setServingUnit(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
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

        <Input
          label="Fiber (g, optional)"
          type="number"
          step="any"
          min="0"
          value={fiber}
          onChange={(e) => setFiber(parseFloat(e.target.value) || 0)}
        />

        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
            Save Custom Food
          </Button>
        </div>
      </form>
    </Modal>
  );
};
