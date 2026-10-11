import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { format } from "date-fns";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { QuickLogPopup } from "../QuickLogPopup";
import { FoodSearchModal } from "../FoodSearchModal";
import { CustomFoodModal } from "../CustomFoodModal";
import { WeightTrackerModal } from "../WeightTrackerModal";
import {
  Coffee,
  Sun,
  Moon,
  Plus,
  Palette,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useQuickLog } from "../../context/QuickLogContext";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", icon: Coffee };
  if (hour < 17) return { text: "Good afternoon", icon: Sun };
  return { text: "Good evening", icon: Moon };
};

export const AppLayout: React.FC = () => {
  const { currentTheme } = useTheme();
  const {
    openQuickLog,
    isFoodSearchOpen,
    closeFoodSearch,
    activeMeal,
    openFoodSearch,
    isWeightOpen,
    closeWeightModal,
    isCustomFoodOpen,
    openCustomFoodModal,
    closeCustomFoodModal,
    triggerRefresh,
  } = useQuickLog();

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const todayStr = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900 overflow-x-hidden">
      {/* Sidebar: Icon-rail on tablet (md), Full width on desktop (lg) */}
      <AppSidebar />

      {/* Mobile Top Header (md:hidden) - Instagram style: NutriTrack & Greeting, nothing else */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-subtle">
        <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent select-none">
          NutriTrack
        </h1>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100/80 px-2.5 py-1 rounded-full">
          <GreetingIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>{greeting.text}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        {/* Desktop / Tablet Header Bar (hidden on mobile) */}
        <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3.5 bg-white/70 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent select-none">
              NutriTrack
            </h1>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              <GreetingIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{greeting.text}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/profile"
              title={`Switch Theme (Current: ${currentTheme.name})`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all border border-slate-200/60"
            >
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <div
                className="w-2.5 h-2.5 rounded-full border border-white"
                style={{ backgroundColor: currentTheme.primaryHex }}
              />
              <span className="hidden xl:inline">{currentTheme.name}</span>
            </NavLink>

            <button
              type="button"
              onClick={openQuickLog}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Log Food</span>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 px-4 pt-4 md:px-6 lg:px-8 lg:pt-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation */}
      <MobileNav />

      {/* Global Quick Log Popup & Associated Modals */}
      <QuickLogPopup />

      <FoodSearchModal
        isOpen={isFoodSearchOpen}
        onClose={closeFoodSearch}
        selectedDate={todayStr}
        defaultMeal={activeMeal}
        onFoodLogged={triggerRefresh}
        onOpenCustomFoodModal={openCustomFoodModal}
      />

      <CustomFoodModal
        isOpen={isCustomFoodOpen}
        onClose={closeCustomFoodModal}
        onFoodCreated={() => openFoodSearch(activeMeal)}
      />

      <WeightTrackerModal
        isOpen={isWeightOpen}
        onClose={closeWeightModal}
        defaultDate={todayStr}
        onWeightLogged={triggerRefresh}
      />
    </div>
  );
};
