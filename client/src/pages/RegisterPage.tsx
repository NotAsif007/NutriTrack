import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Flame, AlertCircle, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";

const passwordStrength = (password: string): { score: number; label: string; color: string } => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: "Too short", color: "bg-rose-500" },
    { label: "Weak", color: "bg-rose-400" },
    { label: "Fair", color: "bg-amber-400" },
    { label: "Good", color: "bg-emerald-400" },
    { label: "Strong", color: "bg-emerald-500" },
    { label: "Very strong", color: "bg-emerald-600" },
  ];
  return { score, ...map[score] };
};

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const strength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    setIsLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Science-based calorie targets (Mifflin-St Jeor)",
    "Real-time macro tracking with visual progress",
    "7-day & 30-day nutrition history charts",
    "Custom food creation & personal library",
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 xl:w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-10 xl:p-14 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />
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
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Flame className="w-6 h-6 fill-white text-white" />
          </div>
          <div>
            <span className="text-2xl font-black text-white tracking-tight">NutriTrack</span>
            <div className="text-emerald-300 text-xs font-semibold tracking-wider uppercase">Smart Nutrition</div>
          </div>
        </div>

        {/* Content */}
        <div className="relative space-y-6">
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight">
            Your nutrition,<br />
            <span className="text-emerald-300">finally clear.</span>
          </h2>
          <p className="text-emerald-100/80 text-base leading-relaxed max-w-sm">
            Stop guessing. Start knowing. Track every meal with
            precision and let data drive your health decisions.
          </p>

          <div className="space-y-3 pt-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                </div>
                <span className="text-emerald-100/90 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: "100+", label: "Foods tracked" },
            { value: "Free", label: "No cost ever" },
            { value: "Secure", label: "JWT HttpOnly" },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-emerald-300/80 text-[11px] font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 bg-[#F0FDF8]">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile brand */}
          <div className="lg:hidden text-center space-y-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <Flame className="w-7 h-7 fill-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">NutriTrack</h1>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create your account</h2>
            <p className="text-sm text-slate-500">Start your nutrition journey in under a minute</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2.5 animate-slide-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 alphanumeric characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
              {/* Password strength meter */}
              {password && (
                <div className="space-y-1 animate-fade-in">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength.score >= 3 ? "text-emerald-600" : "text-amber-600"}`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4" />}
              error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
            />

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Create Account & Start Tracking
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#F0FDF8] px-3 text-slate-400 font-medium">Already have an account?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
          >
            Sign in instead
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
