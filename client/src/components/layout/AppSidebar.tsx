import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  TrendingUp,
  User,
  LogOut,
  Flame,
  Palette,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentTheme } = useTheme();

  const navItems = [
    { name: "Dashboard", to: "/", icon: LayoutDashboard, desc: "Overview" },
    { name: "Food Diary", to: "/diary", icon: UtensilsCrossed, desc: "Daily log" },
    { name: "Food Catalog", to: "/foods", icon: BookOpen, desc: "Browse & create" },
    { name: "Progress", to: "/progress", icon: TrendingUp, desc: "Charts & history" },
    { name: "Profile", to: "/profile", icon: User, desc: "Goals & settings" },
  ];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside className="hidden md:flex flex-col md:w-20 lg:w-64 xl:w-72 bg-white border-r border-slate-100 min-h-screen py-5 px-3 lg:px-4 shrink-0 select-none sticky top-0 h-screen overflow-y-auto no-scrollbar transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6 md:justify-center lg:justify-start">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
          <Flame className="w-5 h-5 fill-white" />
        </div>
        <div className="hidden lg:block min-w-0">
          <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
            NutriTrack
          </h1>
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">
            Smart Nutrition
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            title={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 group md:justify-center lg:justify-start ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <div className="hidden lg:block min-w-0">
                  <span className="block font-semibold leading-tight">{item.name}</span>
                  <span
                    className={`block text-[10px] font-normal leading-none mt-0.5 ${
                      isActive ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    {item.desc}
                  </span>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Active Theme Badge on Sidebar */}
      <NavLink
        to="/profile"
        title={`Active Theme: ${currentTheme.name}`}
        className="mx-1 mb-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors flex items-center gap-2.5 md:justify-center lg:justify-start group"
      >
        <div
          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-white"
          style={{ backgroundColor: currentTheme.primaryHex }}
        />
        <div className="hidden lg:block min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
            <Palette className="w-3 h-3 text-slate-400" />
            <span className="truncate">{currentTheme.name}</span>
          </div>
        </div>
      </NavLink>

      {/* Calorie Target Reminder (Expanded mode) */}
      {user?.nutritionTarget?.targetCalories && (
        <div className="hidden lg:block mx-1 mb-4 p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100">
          <p className="text-[11px] font-medium text-emerald-700">Daily target</p>
          <p className="text-lg font-black text-emerald-800 leading-tight">
            {user.nutritionTarget.targetCalories}
            <span className="text-xs font-medium ml-1">kcal</span>
          </p>
        </div>
      )}

      {/* User Footer Profile & Logout */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group md:justify-center lg:justify-between">
          <NavLink to="/profile" className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </NavLink>
          <button
            onClick={() => logout()}
            title="Log out"
            aria-label="Log out"
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-1 shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
