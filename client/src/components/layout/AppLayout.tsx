import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { Flame, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AppLayout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9F7] flex flex-col md:flex-row text-gray-900">
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-base">NutriTrack</span>
        </div>
        <button
          onClick={() => logout()}
          title="Log out"
          aria-label="Log out"
          className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
