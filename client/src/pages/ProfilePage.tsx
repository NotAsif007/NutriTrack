import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api, getApiErrorMessage } from "../services/api";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { User, Calculator, Trash2, Check, AlertCircle, Info } from "lucide-react";
import { Gender, ActivityLevel, NutritionGoal } from "../types";

export const ProfilePage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState<number>(user?.profile?.age || 25);
  const [gender, setGender] = useState<Gender>(user?.profile?.gender || "prefer_not_to_say");
  const [heightCm, setHeightCm] = useState<number>(user?.profile?.heightCm || 170);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(user?.profile?.currentWeightKg || 70);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    user?.profile?.activityLevel || "sedentary"
  );
  const [goal, setGoal] = useState<NutritionGoal>(user?.profile?.goal || "maintain");
  const [dietaryPreference, setDietaryPreference] = useState(user?.profile?.dietaryPreference || "none");

  // Calculation mode state
  const [calcMode, setCalcMode] = useState<"automated" | "manual">(
    user?.nutritionTarget?.calculationMode || "automated"
  );
  const [customTarget, setCustomTarget] = useState<number>(
    user?.nutritionTarget?.targetCalories || 2000
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Account deletion modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await api.patch("/profile", {
        name,
        age,
        gender,
        heightCm,
        currentWeightKg,
        activityLevel,
        goal,
        dietaryPreference,
        calculationMode: calcMode,
        customTargetCalories: calcMode === "manual" ? customTarget : null,
      });
      await refreshUser();
      setMessage({ type: "success", text: "Profile and nutrition targets successfully updated." });
    } catch (err) {
      setMessage({ type: "error", text: getApiErrorMessage(err) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete("/profile");
      await logout();
    } catch (err) {
      setMessage({ type: "error", text: getApiErrorMessage(err) });
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
          User Profile & Nutrition Goals
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mt-0.5">
          Manage your biometrics, activity levels, and daily energy expenditure targets.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center space-x-2 border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Biometrics Card */}
        <Card className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Physical Metrics & Biometrics</h3>
              <p className="text-xs text-gray-500">Used for Mifflin-St Jeor metabolic calculations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3.5 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <Input
              label="Age (Years)"
              type="number"
              min="10"
              max="120"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Biological Sex (Optional)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="male">Male (+5 kcal factor)</option>
                <option value="female">Female (-161 kcal factor)</option>
                <option value="other">Other / Neutral (-78 kcal factor)</option>
                <option value="prefer_not_to_say">Prefer not to say (Neutral midpoint)</option>
              </select>
            </div>

            <Input
              label="Height (Centimetres)"
              type="number"
              min="50"
              max="250"
              value={heightCm}
              onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
              required
            />

            <Input
              label="Current Weight (Kilograms)"
              type="number"
              step="0.1"
              min="20"
              max="400"
              value={currentWeightKg}
              onChange={(e) => setCurrentWeightKg(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
        </Card>

        {/* Energy Target & Strategy Card */}
        <Card className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Activity Level & Fitness Goals</h3>
              <p className="text-xs text-gray-500">Estimates your Total Daily Energy Expenditure (TDEE)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Activity Multiplier
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sedentary">Sedentary (1.2x) — Little or no exercise</option>
                <option value="lightly_active">Lightly Active (1.375x) — Light exercise 1–3 days/wk</option>
                <option value="moderately_active">Moderately Active (1.55x) — Exercise 3–5 days/wk</option>
                <option value="very_active">Very Active (1.725x) — Heavy exercise 6–7 days/wk</option>
                <option value="extra_active">Extra Active (1.9x) — Physical job or athletic training</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Weight Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as NutritionGoal)}
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="maintain">Maintain Weight (TDEE equilibrium)</option>
                <option value="lose">Lose Weight (Moderate 500 kcal deficit)</option>
                <option value="gain">Gain Weight (Lean 350 kcal surplus)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Dietary Preference
              </label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="none">No Specific Preference / Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="keto">Ketogenic</option>
              </select>
            </div>
          </div>

          {/* Scientific Methodology Explainer */}
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start space-x-2.5 text-xs text-blue-900 leading-relaxed">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Evidence-Based Estimation:</strong> NutriTrack calculates your Resting Energy
              Expenditure using the Mifflin-St Jeor equation (10 &times; weight_kg + 6.25 &times; height_cm - 5 &times; age + gender offset),
              scaled by your activity factor. This figure represents an empirical estimate, not medical advice.
            </div>
          </div>

          {/* Target Calculation Mode Selection */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Target Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start space-x-3 transition-colors ${
                  calcMode === "automated"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="calcMode"
                  value="automated"
                  checked={calcMode === "automated"}
                  onChange={() => setCalcMode("automated")}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-gray-900 block">
                    Automated (Recommended)
                  </span>
                  <span className="text-xs text-gray-500">
                    Target dynamically updates whenever your weight or activity changes.
                  </span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start space-x-3 transition-colors ${
                  calcMode === "manual"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="calcMode"
                  value="manual"
                  checked={calcMode === "manual"}
                  onChange={() => setCalcMode("manual")}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-gray-900 block">Manual Override</span>
                  <span className="text-xs text-gray-500">
                    Fix your daily target to an exact calorie count of your choice.
                  </span>
                </div>
              </label>
            </div>

            {calcMode === "manual" && (
              <div className="pt-2 max-w-xs">
                <Input
                  label="Custom Calorie Target (kcal)"
                  type="number"
                  min="800"
                  max="10000"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(parseInt(e.target.value, 10) || 0)}
                  required
                />
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="danger"
            size="md"
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="text-xs"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete Account
          </Button>

          <Button variant="primary" size="lg" type="submit" isLoading={isSaving}>
            <Check className="w-4 h-4 mr-1.5" />
            Save Profile & Goals
          </Button>
        </div>
      </form>

      {/* Account Deletion Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Permanently Delete Account"
        message="This operation will permanently purge your user profile, all historical food diary entries, custom foods, and weight records. This action cannot be reversed."
        confirmText="Permanently Delete"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};
