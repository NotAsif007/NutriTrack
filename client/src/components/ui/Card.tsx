import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  hover = false,
  glass = false,
}) => {
  const base = glass
    ? "bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-card p-5"
    : "bg-white rounded-2xl border border-slate-100 shadow-card p-5";

  const hoverClass = hover || onClick
    ? "hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer transition-all duration-300"
    : "transition-shadow duration-300";

  return (
    <div
      onClick={onClick}
      className={`${base} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};
