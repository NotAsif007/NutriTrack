import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  TrendingUp,
  User,
  Plus,
} from "lucide-react";
import { useQuickLog } from "../../context/QuickLogContext";

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { openQuickLog } = useQuickLog();

  const leftItems = [
    { name: "Home", to: "/", icon: LayoutDashboard },
    { name: "Diary", to: "/diary", icon: UtensilsCrossed },
  ];

  const rightItems = [
    { name: "Analytics", to: "/progress", icon: TrendingUp },
    { name: "Profile", to: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none">
      {/* Floating container */}
      <div className="mx-4 mb-3 bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-200/70 px-3 py-2 flex items-center justify-between pointer-events-auto relative">
        {/* Left 2 items */}
        <div className="flex items-center justify-around flex-1">
          {leftItems.map((item) => {
            const isActive =
              item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);

            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className="flex-1">
                <div
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "text-emerald-600 font-extrabold"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${
                      isActive ? "scale-110 text-emerald-600" : ""
                    }`}
                  />
                  <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* Signature Elevated Center Circular Quick Log Button: opens popup */}
        <div className="relative px-2 -mt-7 shrink-0">
          <button
            type="button"
            onClick={openQuickLog}
            aria-label="Open quick log options"
            className="w-13 h-13 sm:w-14 sm:h-14 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/35 border-4 border-white flex items-center justify-center active:scale-90 transition-all hover:shadow-xl hover:shadow-emerald-500/50 group"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Right 2 items */}
        <div className="flex items-center justify-around flex-1">
          {rightItems.map((item) => {
            const isActive =
              item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);

            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className="flex-1">
                <div
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "text-emerald-600 font-extrabold"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${
                      isActive ? "scale-110 text-emerald-600" : ""
                    }`}
                  />
                  <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
