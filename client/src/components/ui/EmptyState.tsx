import React from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`text-center py-12 px-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center ${className}`}
    >
      {icon && (
        <div className="text-slate-300 mb-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-subtle inline-flex">
          {icon}
        </div>
      )}
      <h4 className="text-base font-bold text-slate-700">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mt-1.5 mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
