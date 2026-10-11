import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  TrendingUp,
  User,
} from "lucide-react";

export const MobileNav: React.FC = () => {
  const navItems = [
    { name: "Dashboard", to: "/", icon: LayoutDashboard },
    { name: "Diary", to: "/diary", icon: UtensilsCrossed },
    { name: "Catalog", to: "/foods", icon: BookOpen },
    { name: "Progress", to: "/progress", icon: TrendingUp },
    { name: "Profile", to: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 px-2 py-1.5 flex justify-around items-center shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? "text-emerald-600 font-semibold" : "text-gray-500 hover:text-gray-900"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={`w-5 h-5 mb-0.5 ${
                  isActive ? "text-emerald-600" : "text-gray-400"
                }`}
              />
              <span>{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
