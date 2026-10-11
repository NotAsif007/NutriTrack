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
      className={`text-center py-10 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center ${className}`}
    >
      {icon && <div className="text-gray-400 mb-3">{icon}</div>}
      <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
