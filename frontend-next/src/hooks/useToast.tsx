"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ==================== TYPES ====================

export interface ToastProps {
  id: string;
  title?: string;
  description: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export type ToastOptions = Omit<ToastProps, "id">;

interface ToastContextType {
  toasts: ToastProps[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

interface ToastComponentProps extends ToastProps {
  onDismiss: () => void;
}

interface ToastContainerProps {
  children: ReactNode;
  className?: string;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

// ==================== TOAST CONTAINER ====================

export const ToastContainer: React.FC<ToastContainerProps> = ({
  children,
  className,
  position = "top-right",
}) => {
  const positionStyles = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 p-4 max-h-screen overflow-auto",
        positionStyles[position],
        className,
      )}
    >
      {children}
    </div>
  );
};

// ==================== TOAST COMPONENT ====================

export const Toast: React.FC<ToastComponentProps> = ({
  title,
  description,
  variant = "default",
  onDismiss,
}) => {
  const variantStyles = {
    default: "bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50",
    destructive: "bg-red-500 text-white dark:bg-red-900",
    success: "bg-green-500 text-white dark:bg-green-900",
  };

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full max-w-md items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full",
        variantStyles[variant],
        "border-slate-200 dark:border-slate-700",
      )}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <button
        onClick={onDismiss}
        className="absolute right-2 top-2 rounded-md p-1 text-slate-950/50 opacity-0 transition-opacity hover:text-slate-950 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 dark:text-slate-50/50 dark:hover:text-slate-50"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
};

// ==================== TOAST PROVIDER ====================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Define dismiss first to avoid the "used before declaration" error
  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastProps = {
        id,
        ...options,
        duration: options.duration ?? 5000,
      };

      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration !== Infinity) {
        setTimeout(() => {
          dismiss(id);
        }, newToast.duration);
      }

      return id;
    },
    [dismiss],
  ); // Include dismiss in the dependency array

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// ==================== HOOK ====================

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
