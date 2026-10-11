import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  icon?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  icon,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      // Focus the panel for accessibility
      setTimeout(() => panelRef.current?.focus(), 50);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative w-full ${maxWidthClass} bg-white
          rounded-t-3xl sm:rounded-2xl shadow-float border border-slate-100/50
          overflow-hidden z-10 flex flex-col
          max-h-[95vh] sm:max-h-[90vh]
          animate-slide-up outline-none`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h3 id="modal-title" className="text-base font-bold text-slate-900 truncate">
                {title}
              </h3>
              {description && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">{description}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-3 text-slate-400 hover:text-slate-600 rounded-xl p-1.5 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag Handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-2 pb-0 order-first absolute top-2 left-0 right-0 z-10">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto scrollbar-thin flex-1">{children}</div>
      </div>
    </div>
  );
};
