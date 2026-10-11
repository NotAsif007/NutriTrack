import React, { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Search, Plus, Utensils, ArrowLeft, Check, Sparkles } from "lucide-react";
import { api, getApiErrorMessage } from "../services/api";
import { IFood, MealType, ApiResponse } from "../types";

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  defaultMeal?: MealType;
  onFoodLogged: () => void;
  onOpenCustomFoodModal?: () => void;
}

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  defaultMeal = "Breakfast",
  onFoodLogged,
  onOpenCustomFoodModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [foods, setFoods] = useState<IFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected food for logging configuration
  const [activeFood, setActiveFood] = useState<IFood | null>(null);
  const [quantity, setQuantity] = useState<number>(100);
  const [mealType, setMealType] = useState<MealType>(defaultMeal);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultMeal) {
      setMealType(defaultMeal);
    }
  }, [defaultMeal]);

  useEffect(() => {
    if (!isOpen) {
      setActiveFood(null);
      setSearchQuery("");
      return;
    }

    const fetchFoods = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = {};
        if (searchQuery.trim()) params.q = searchQuery.trim();
        if (selectedCategory !== "All") params.category = selectedCategory;

        const res = await api.get<ApiResponse<{ foods: IFood[] }>>("/foods", { params });
        if (res.data.success) {
          setFoods(res.data.data.foods);
        }
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchFoods, 200);
    return () => clearTimeout(debounceTimer);
  }, [isOpen, searchQuery, selectedCategory]);

  const handleSelectFood = (food: IFood) => {
    setActiveFood(food);
    setQuantity(food.servingSize);
    setNotes("");
  };

  // Live client-side preview calculations
  const scale = activeFood && activeFood.servingSize > 0 ? quantity / activeFood.servingSize : 1;
  const previewCalories = activeFood ? Math.round(activeFood.calories * scale) : 0;
  const previewProtein = activeFood ? (activeFood.protein * scale).toFixed(1) : "0";
  const previewCarbs = activeFood ? (activeFood.carbs * scale).toFixed(1) : "0";
  const previewFat = activeFood ? (activeFood.fat * scale).toFixed(1) : "0";

  const handleLogFood = async () => {
    if (!activeFood || quantity <= 0) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await api.post("/food-logs", {
        foodId: activeFood._id,
        date: selectedDate,
        mealType,
        quantity,
        notes: notes.trim(),
      });
      onFoodLogged();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "All",
    "Grains",
    "Dairy",
    "Eggs",
    "Legumes",
    "Meat & Poultry",
    "Fruits",
    "Vegetables",
    "Nuts & Seeds",
    "Beverages",
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activeFood ? `Log ${activeFood.name}` : "Search & Log Food"}
      description={
        activeFood
          ? `Serving: ${activeFood.servingSize} ${activeFood.servingUnit} = ${activeFood.calories} kcal`
          : "Search our standard library or your custom foods"
      }
      maxWidth="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      {!activeFood ? (
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search e.g. 'Boiled Egg', 'Cooked White Rice', 'Apple'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              autoFocus
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white font-medium shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Foods Result List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-gray-500">Searching food database...</div>
            ) : foods.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Utensils className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500">No foods matched your query.</p>
                {onOpenCustomFoodModal && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onOpenCustomFoodModal();
                    }}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Create Custom Food
                  </Button>
                )}
              </div>
            ) : (
              foods.map((food) => (
                <div
                  key={food._id}
                  onClick={() => handleSelectFood(food)}
                  className="p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {food.name}
                      </span>
                      {food.isCustom && <Badge variant="info">Custom</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {food.servingSize} {food.servingUnit} • {food.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-emerald-600 group-hover:scale-105 transition-transform inline-block">
                      {food.calories} kcal
                    </span>
                    <p className="text-[10px] text-gray-400">
                      P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Serving & Quantity Calculator View */
        <div className="space-y-4">
          <button
            onClick={() => setActiveFood(null)}
            className="inline-flex items-center text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to search
          </button>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <h4 className="text-sm font-bold text-gray-900">{activeFood.name}</h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              Reference standard: {activeFood.servingSize} {activeFood.servingUnit} contains{" "}
              {activeFood.calories} kcal ({activeFood.protein}g P, {activeFood.carbs}g C,{" "}
              {activeFood.fat}g F)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Meal Category
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Quantity ({activeFood.servingUnit})
              </label>
              <Input
                type="number"
                min="0.1"
                step="any"
                value={quantity || ""}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Live Calculated Nutrition Preview Box */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-gray-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Calculated Nutrition Preview for {quantity} {activeFood.servingUnit}:</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase">Calories</span>
                <p className="text-sm font-bold text-emerald-600">{previewCalories} kcal</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase">Protein</span>
                <p className="text-sm font-bold text-blue-600">{previewProtein}g</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase">Carbs</span>
                <p className="text-sm font-bold text-amber-600">{previewCarbs}g</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase">Fat</span>
                <p className="text-sm font-bold text-rose-600">{previewFat}g</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Optional Note
            </label>
            <input
              type="text"
              placeholder="e.g. 'with black pepper', 'half cup'..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setActiveFood(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleLogFood}
              isLoading={isSubmitting}
              disabled={quantity <= 0}
            >
              <Check className="w-4 h-4 mr-1.5" />
              Add to {mealType}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
