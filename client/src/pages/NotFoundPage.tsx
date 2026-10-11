import React from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowLeft, Home } from "lucide-react";
import { Button } from "../components/ui/Button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0FDF8] flex flex-col items-center justify-center p-6 text-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-emerald-100 blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-100 blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 space-y-6 max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <span className="text-lg font-black text-slate-900">NutriTrack</span>
        </div>

        {/* 404 */}
        <div>
          <p className="text-8xl font-black text-emerald-500 leading-none">404</p>
          <h1 className="text-2xl font-black text-slate-900 mt-3">Page not found</h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Looks like this page went missing — just like those calories you forgot to log. 🙈
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="soft" size="lg">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
};
