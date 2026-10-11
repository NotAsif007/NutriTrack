import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Flame, AlertCircle, Mail, Lock, ArrowRight, TrendingUp, Target, Zap } from "lucide-react";

const features = [
  { icon: Target, label: "Smart calorie targets", desc: "Mifflin-St Jeor powered TDEE" },
  { icon: TrendingUp, label: "Progress tracking", desc: "Charts & weight history" },
  { icon: Zap, label: "Instant food logging", desc: "Searchable nutrition database" },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Gradient Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 xl:w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-10 xl:p-14 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl" />
          {/* Grid dots */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Brand */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Flame className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">NutriTrack</span>
              <div className="text-emerald-300 text-xs font-semibold tracking-wider uppercase">Smart Nutrition</div>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative space-y-6">
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight">
            Fuel your body,<br />
            <span className="text-emerald-300">own your goals.</span>
          </h2>
          <p className="text-emerald-100/80 text-base leading-relaxed max-w-sm">
            Science-backed calorie tracking with personalized macronutrient targets. 
            Join thousands who've transformed their nutrition.
          </p>

          {/* Feature list */}
          <div className="space-y-4 pt-2">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <span className="text-white text-sm font-semibold block leading-none">{f.label}</span>
                  <span className="text-emerald-300/70 text-xs">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
          <p className="text-white/90 text-sm italic">
            "NutriTrack helped me lose 8kg in 3 months by finally understanding what I was actually eating."
          </p>
          <p className="text-emerald-300 text-xs font-semibold mt-2">— Priya, 28, Software Engineer</p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 bg-[#F0FDF8]">
        <div className="w-full max-w-md space-y-7">
          {/* Mobile brand */}
          <div className="lg:hidden text-center space-y-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <Flame className="w-7 h-7 fill-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">NutriTrack</h1>
            <p className="text-sm text-slate-500">Smart calorie & macro tracking</p>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to continue tracking your nutrition</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2.5 animate-slide-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#F0FDF8] px-3 text-slate-400 font-medium">Don't have an account?</span>
            </div>
          </div>

          <Link
            to="/register"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
          >
            Create free account
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Tip */}
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-xs text-emerald-800">
            💡 <strong>Quick start:</strong> Register in seconds — no credit card needed.
          </div>
        </div>
      </div>
    </div>
  );
};
