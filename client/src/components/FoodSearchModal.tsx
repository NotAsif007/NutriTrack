import React, { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import {
  Search,
  Plus,
  Utensils,
  ArrowLeft,
  Check,
  Sparkles,
  Flame,
  X,
} from "lucide-react";
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

const mealOptions: { type: MealType; emoji: string; label: string }[] = [
  { type: "Breakfast", emoji: "🌅", label: "Breakfast" },
  { type: "Lunch", emoji: "☀️", label: "Lunch" },
  { type: "Dinner", emoji: "🌙", label: "Dinner" },
  { type: "Snacks", emoji: "🍿", label: "Snacks" },
];

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

  // Active selected food for logging
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
  const previewProtein = activeFood ? +(activeFood.protein * scale).toFixed(1) : 0;
  const previewCarbs = activeFood ? +(activeFood.carbs * scale).toFixed(1) : 0;
  const previewFat = activeFood ? +(activeFood.fat * scale).toFixed(1) : 0;

  // Macro calorie ratios
  const proteinKcal = previewProtein * 4;
  const carbsKcal = previewCarbs * 4;
  const fatKcal = previewFat * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || 1;
  const proteinPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatPct = Math.round((fatKcal / totalMacroKcal) * 100);

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
          ? `Standard: ${activeFood.servingSize} ${activeFood.servingUnit} = ${activeFood.calories} kcal`
          : "Search from curated food database or custom library"
      }
      maxWidth="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!activeFood ? (
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search foods, brands, dishes (e.g. Boiled Egg, Oats, Apple)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium placeholder:text-slate-400"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Foods Result List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>Searching food catalog...</span>
              </div>
            ) : foods.length === 0 ? (
              <div className="py-10 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">No matching foods found</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Try another keyword or create a custom food item with your custom recipe.
                  </p>
                </div>
                {onOpenCustomFoodModal && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onOpenCustomFoodModal();
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Custom Food
                  </Button>
                )}
              </div>
            ) : (
              foods.map((food) => (
                <div
                  key={food._id}
                  onClick={() => handleSelectFood(food)}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 bg-white cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                        {food.name}
                      </span>
                      {food.isCustom && <Badge variant="info">Custom</Badge>}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {food.servingSize} {food.servingUnit} • {food.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      <Flame className="w-3.5 h-3.5" />
                      {food.calories} kcal
                    </div>
                    <div className="flex gap-2 mt-1 text-[10px] text-slate-400 justify-end font-medium">
                      <span>P: {food.protein}g</span>
                      <span>C: {food.carbs}g</span>
                      <span>F: {food.fat}g</span>
                    </div>
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
            className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to search list
          </button>

          {/* Active Food Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200/60">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-black text-slate-900">{activeFood.name}</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Standard: {activeFood.servingSize} {activeFood.servingUnit} contains{" "}
                  <span className="font-bold text-emerald-700">{activeFood.calories} kcal</span>
                </p>
              </div>
              <Badge variant="success">{activeFood.category}</Badge>
            </div>
          </div>

          {/* Meal Category Selection Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Meal Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {mealOptions.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setMealType(opt.type)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    mealType === opt.type
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Portion Size ({activeFood.servingUnit})
              </label>
              {/* Quick Multiplier Presets */}
              <div className="flex items-center gap-1">
                {[0.5, 1, 1.5, 2].map((mult) => (
                  <button
                    key={mult}
                    type="button"
                    onClick={() => setQuantity(Math.round(activeFood.servingSize * mult))}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors ${
                      quantity === Math.round(activeFood.servingSize * mult)
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>
            <Input
              type="number"
              min="0.1"
              step="any"
              value={quantity || ""}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              placeholder="Enter quantity"
            />
          </div>

          {/* Calculated Nutrition Preview Card */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Calculated for {quantity} {activeFood.servingUnit}:</span>
              </div>
              <div className="text-xs font-black text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-lg">
                {previewCalories} kcal
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-subtle">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">
                  Protein
                </span>
                <p className="text-sm font-black text-blue-700 mt-0.5">{previewProtein}g</p>
                <span className="text-[9px] text-slate-400 font-medium">{proteinPct}% cals</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-subtle">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                  Carbs
                </span>
                <p className="text-sm font-black text-amber-700 mt-0.5">{previewCarbs}g</p>
                <span className="text-[9px] text-slate-400 font-medium">{carbsPct}% cals</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-rose-100 shadow-subtle">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                  Fat
                </span>
                <p className="text-sm font-black text-rose-700 mt-0.5">{previewFat}g</p>
                <span className="text-[9px] text-slate-400 font-medium">{fatPct}% cals</span>
              </div>
            </div>

            {/* Micro Macro Split Bar */}
            <div className="mt-3 flex h-2 rounded-full overflow-hidden gap-0.5 bg-slate-200">
              <div
                className="bg-blue-500 rounded-full transition-all"
                style={{ width: `${proteinPct}%` }}
                title={`Protein: ${proteinPct}%`}
              />
              <div
                className="bg-amber-400 rounded-full transition-all"
                style={{ width: `${carbsPct}%` }}
                title={`Carbs: ${carbsPct}%`}
              />
              <div
                className="bg-rose-500 rounded-full transition-all"
                style={{ width: `${fatPct}%` }}
                title={`Fat: ${fatPct}%`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Personal Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 'with olive oil drizzle', 'cooked with spices'..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveFood(null)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleLogFood}
              isLoading={isSubmitting}
              disabled={quantity <= 0}
              className="w-full sm:w-auto shadow-sm"
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
