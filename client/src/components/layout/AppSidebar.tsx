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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", to: "/", icon: LayoutDashboard },
    { name: "Food Diary", to: "/diary", icon: UtensilsCrossed },
    { name: "Food Catalog", to: "/foods", icon: BookOpen },
    { name: "Progress & History", to: "/progress", icon: TrendingUp },
    { name: "Profile & Goals", to: "/profile", icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200/80 min-h-screen p-5 shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 px-2 py-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
          <Flame className="w-6 h-6 fill-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900 tracking-tight leading-none">
            NutriTrack
          </h1>
          <span className="text-[11px] font-medium text-emerald-600 tracking-wide uppercase">
            Smart Nutrition
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="pt-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/80 mb-2">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {user?.name?.slice(0, 2) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            title="Log out"
            aria-label="Log out"
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
