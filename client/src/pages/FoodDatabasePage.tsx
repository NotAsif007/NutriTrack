import React, { useState, useEffect, useCallback } from "react";
import { api, getApiErrorMessage } from "../services/api";
import { IFood, ApiResponse } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { CustomFoodModal } from "../components/CustomFoodModal";
import { Search, Plus, Trash2, BookOpen, AlertCircle, Filter, Sparkles } from "lucide-react";

const categories = [
  { name: "All", emoji: "🍽️" },
  { name: "Grains", emoji: "🌾" },
  { name: "Dairy", emoji: "🥛" },
  { name: "Eggs", emoji: "🥚" },
  { name: "Legumes", emoji: "🫘" },
  { name: "Meat & Poultry", emoji: "🍗" },
  { name: "Fish & Seafood", emoji: "🐟" },
  { name: "Fruits", emoji: "🍎" },
  { name: "Vegetables", emoji: "🥦" },
  { name: "Nuts & Seeds", emoji: "🥜" },
  { name: "Snacks", emoji: "🍿" },
  { name: "Beverages", emoji: "☕" },
  { name: "Mixed Meals", emoji: "🥘" },
];

export const FoodDatabasePage: React.FC = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IFood | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFoods = useCallback(async () => {
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
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(fetchFoods, 200);
    return () => clearTimeout(timer);
  }, [fetchFoods]);

  const handleDeleteCustomFood = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/foods/custom/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchFoods();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const customCount = foods.filter((f) => f.isCustom).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Food Catalog
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore verified nutrition data and manage your custom foods.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCustomModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Custom Food
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Foods</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {isLoading ? "—" : foods.length}
            <span className="text-xs font-medium text-slate-400 ml-1">items</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Custom Foods</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {isLoading ? "—" : customCount}
            <span className="text-xs font-medium text-emerald-400 ml-1">created</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-subtle hidden sm:block">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Data Sources</p>
          <p className="text-sm font-bold text-slate-700 mt-1">IFCT &amp; USDA</p>
          <p className="text-[10px] text-slate-400">Verified datasets</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Controls: Search & Category Filter */}
      <Card className="space-y-4">
        {/* Search box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search foods by name, e.g. 'Boiled Egg', 'Brown Rice', 'Apple'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Category filter pills */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filter by category</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat.name
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Food Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 rounded-2xl animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-subtle">
          <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">No foods found</h4>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search or create a new custom food item.
          </p>
          <Button variant="primary" size="md" className="mt-4" onClick={() => setIsCustomModalOpen(true)}>
            <Sparkles className="w-4 h-4" />
            Create Custom Food
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <Card
              key={food._id}
              className="flex flex-col justify-between hover:border-emerald-200 group"
              hover
            >
              {/* Top section */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight truncate group-hover:text-emerald-700 transition-colors">
                      {food.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      per {food.servingSize} {food.servingUnit}
                    </p>
                  </div>
                  {food.isCustom ? (
                    <Badge variant="info" dot>Custom</Badge>
                  ) : (
                    <Badge variant="default">{food.category}</Badge>
                  )}
                </div>

                {/* Energy & Macros Grid */}
                <div className="grid grid-cols-4 gap-1.5 p-3 bg-slate-50 rounded-xl text-center">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wide block font-semibold">kcal</span>
                    <span className="text-sm font-black text-emerald-700">{food.calories}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-blue-400 uppercase tracking-wide block font-semibold">Prot</span>
                    <span className="text-sm font-bold text-blue-700">{food.protein}g</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-amber-400 uppercase tracking-wide block font-semibold">Carbs</span>
                    <span className="text-sm font-bold text-amber-700">{food.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-rose-400 uppercase tracking-wide block font-semibold">Fat</span>
                    <span className="text-sm font-bold text-rose-700">{food.fat}g</span>
                  </div>
                </div>
              </div>

              {/* Source & Actions */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 truncate max-w-[170px]">{food.dataSource}</span>
                {food.isCustom && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(food); }}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete custom food"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Custom Food Creation Modal */}
      <CustomFoodModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onFoodCreated={fetchFoods}
      />

      {/* Delete Custom Food Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCustomFood}
        title="Delete Custom Food"
        message={`Delete "${deleteTarget?.name}"? You won't be able to log this food in future entries.`}
        confirmText="Delete Food"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};
