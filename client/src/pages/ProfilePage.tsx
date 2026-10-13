import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { api, getApiErrorMessage } from "../services/api";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { User, Trash2, Check, AlertCircle, Info, Flame, Activity, Target, ChevronRight, Palette, LogOut } from "lucide-react";
import { Gender, ActivityLevel, NutritionGoal } from "../types";

const sectionHeader = (icon: React.ReactNode, title: string, subtitle: string, iconBg: string) => (
  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-4">
    <div className={`p-2 rounded-xl ${iconBg}`}>{icon}</div>
    <div>
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 hover:border-slate-300 transition-all"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

export const ProfilePage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const { theme, setTheme, availableThemes } = useTheme();

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

  const [calcMode, setCalcMode] = useState<"automated" | "manual">(
    user?.nutritionTarget?.calculationMode || "automated"
  );
  const [customTarget, setCustomTarget] = useState<number>(
    user?.nutritionTarget?.targetCalories || 2000
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      setMessage({ type: "success", text: "Profile and nutrition targets updated successfully!" });
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="space-y-5 max-w-3xl animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Profile &amp; Goals
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your biometrics, activity levels, and calorie targets.
        </p>
      </div>

      {/* User avatar card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-2xl font-black shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-black leading-none">{user?.name}</h3>
          <p className="text-emerald-200 text-sm mt-0.5 truncate">{user?.email}</p>
          {user?.nutritionTarget?.targetCalories && (
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {user.nutritionTarget.targetCalories} kcal/day
              </span>
              <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize">
                {user.profile?.goal || "maintain"}
              </span>
            </div>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-emerald-300 ml-auto" />
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center gap-2.5 border animate-slide-up ${
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

      {/* Appearance & Color Theme Customization Card */}
      <Card>
        {sectionHeader(
          <Palette className="w-5 h-5 text-emerald-600" />,
          "App Appearance & Color Theme",
          "Choose your preferred accent palette across all dashboards, charts, and controls",
          "bg-emerald-50"
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {availableThemes.map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {/* Color Swatch Pills */}
                    <div className="flex items-center gap-1.5">
                      {t.previewColors.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Radio / Check indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 group-hover:border-slate-400"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <span className="font-black text-sm text-slate-900 block leading-tight">
                    {t.name}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {t.subtitle}
                  </p>
                </div>

                {isSelected && (
                  <span className="inline-block mt-3 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md self-start">
                    Active Theme
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        {/* Biometrics Card */}
        <Card>
          {sectionHeader(
            <User className="w-5 h-5 text-emerald-600" />,
            "Physical Metrics & Biometrics",
            "Used for Mifflin-St Jeor metabolic calculations",
            "bg-emerald-50"
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              leftIcon={<User className="w-4 h-4" />}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed"
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

            <SelectField
              label="Biological Sex"
              value={gender}
              onChange={(v) => setGender(v as Gender)}
              options={[
                { value: "male", label: "Male (+5 kcal factor)" },
                { value: "female", label: "Female (-161 kcal factor)" },
                { value: "other", label: "Other / Neutral (-78 kcal factor)" },
                { value: "prefer_not_to_say", label: "Prefer not to say (Neutral midpoint)" },
              ]}
            />

            <Input
              label="Height (cm)"
              type="number"
              min="50"
              max="250"
              value={heightCm}
              onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
              required
            />

            <Input
              label="Current Weight (kg)"
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
        <Card>
          {sectionHeader(
            <Activity className="w-5 h-5 text-blue-600" />,
            "Activity Level & Fitness Goals",
            "Estimates your Total Daily Energy Expenditure (TDEE)",
            "bg-blue-50"
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <SelectField
              label="Activity Multiplier"
              value={activityLevel}
              onChange={(v) => setActivityLevel(v as ActivityLevel)}
              options={[
                { value: "sedentary", label: "Sedentary (1.2×) — Little/no exercise" },
                { value: "lightly_active", label: "Lightly Active (1.375×) — 1–3 days/wk" },
                { value: "moderately_active", label: "Moderately Active (1.55×) — 3–5 days/wk" },
                { value: "very_active", label: "Very Active (1.725×) — 6–7 days/wk" },
                { value: "extra_active", label: "Extra Active (1.9×) — Physical job / athlete" },
              ]}
            />

            <SelectField
              label="Weight Goal"
              value={goal}
              onChange={(v) => setGoal(v as NutritionGoal)}
              options={[
                { value: "maintain", label: "Maintain Weight (TDEE equilibrium)" },
                { value: "lose", label: "Lose Weight (−500 kcal deficit)" },
                { value: "gain", label: "Gain Weight (+350 kcal surplus)" },
              ]}
            />

            <SelectField
              label="Dietary Preference"
              value={dietaryPreference}
              onChange={(v) => setDietaryPreference(v)}
              options={[
                { value: "none", label: "No Specific Preference / Omnivore" },
                { value: "vegetarian", label: "Vegetarian" },
                { value: "vegan", label: "Vegan" },
                { value: "eggetarian", label: "Eggetarian" },
                { value: "keto", label: "Ketogenic" },
              ]}
            />
          </div>

          {/* Scientific Explainer */}
          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Evidence-Based:</strong> NutriTrack uses the Mifflin-St Jeor equation
              (10 × weight_kg + 6.25 × height_cm − 5 × age + gender offset), scaled by your
              activity factor. This is an empirical estimate, not medical advice.
            </div>
          </div>

          {/* Target Mode */}
          <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Calorie Target Mode
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  value: "automated",
                  title: "Automated (Recommended)",
                  desc: "Target updates automatically when your weight or activity changes.",
                },
                {
                  value: "manual",
                  title: "Manual Override",
                  desc: "Fix your daily target to an exact calorie count of your choice.",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                    calcMode === option.value
                      ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-400"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="calcMode"
                    value={option.value}
                    checked={calcMode === option.value}
                    onChange={() => setCalcMode(option.value as "automated" | "manual")}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{option.title}</span>
                    <span className="text-xs text-slate-500">{option.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            {calcMode === "manual" && (
              <div className="pt-2 max-w-xs animate-slide-up">
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
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="danger"
            size="md"
            type="button"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>

          <Button variant="primary" size="lg" type="submit" isLoading={isSaving}>
            <Check className="w-4 h-4" />
            Save Profile &amp; Goals
          </Button>
        </div>
      </form>

      {/* Session controls */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Account session</h3>
            <p className="text-xs text-slate-500 mt-1">Sign out on this device and return to the login screen.</p>
          </div>
          <Button variant="secondary" type="button" onClick={() => logout()}>
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </Card>

      {/* Account Deletion Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Permanently Delete Account"
        message="This will permanently delete your profile, all food diary entries, custom foods, and weight records. This action cannot be reversed."
        confirmText="Permanently Delete"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};
