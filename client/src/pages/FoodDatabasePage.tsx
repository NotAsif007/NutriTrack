import React, { useState, useEffect, useCallback } from "react";
import { api, getApiErrorMessage } from "../services/api";
import { IFood, ApiResponse } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { CustomFoodModal } from "../components/CustomFoodModal";
import { Search, Plus, Trash2, BookOpen, AlertCircle } from "lucide-react";

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

  const categories = [
    "All",
    "Grains",
    "Dairy",
    "Eggs",
    "Legumes",
    "Meat & Poultry",
    "Fish & Seafood",
    "Fruits",
    "Vegetables",
    "Nuts & Seeds",
    "Snacks",
    "Beverages",
    "Mixed Meals",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Food Catalog & Library
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Explore verified standard nutrition datasets and manage your personal custom foods.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsCustomModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Custom Food
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Controls: Search & Category Filter */}
      <Card className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search foods by name or alias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Food Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 rounded-xl animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h4 className="text-sm font-semibold text-gray-700">No foods found</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your search terms or create a new custom food item.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setIsCustomModalOpen(true)}>
            Add Custom Food
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <Card key={food._id} className="flex flex-col justify-between hover:border-emerald-200 transition-colors">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{food.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Serving: {food.servingSize} {food.servingUnit}
                    </p>
                  </div>
                  {food.isCustom ? (
                    <Badge variant="info">Custom</Badge>
                  ) : (
                    <Badge variant="default">{food.category}</Badge>
                  )}
                </div>

                {/* Energy & Macros Grid */}
                <div className="grid grid-cols-4 gap-1 py-2 my-2 bg-gray-50/80 rounded-lg text-center text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Kcal</span>
                    <span className="font-bold text-emerald-700">{food.calories}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Protein</span>
                    <span className="font-semibold text-blue-700">{food.protein}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Carbs</span>
                    <span className="font-semibold text-amber-700">{food.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Fat</span>
                    <span className="font-semibold text-rose-700">{food.fat}g</span>
                  </div>
                </div>
              </div>

              {/* Source & Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span className="truncate max-w-[180px]">{food.dataSource}</span>
                {food.isCustom && (
                  <button
                    onClick={() => setDeleteTarget(food)}
                    className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
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
        message={`Are you sure you want to delete "${deleteTarget?.name}"? You will no longer be able to log this food in future entries.`}
        confirmText="Delete Food"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};
