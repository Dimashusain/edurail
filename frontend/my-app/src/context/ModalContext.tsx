"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "alert" | "confirm";

interface ModalOptions {
  title?: string;
  message: string;
  type: ModalType;
  resolve?: (value: boolean) => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "info" | "danger" | "success" | "warning";
}

interface ModalContextType {
  showAlert: (message: string, options?: Omit<ModalOptions, "message" | "type" | "resolve">) => Promise<void>;
  showConfirm: (message: string, options?: Omit<ModalOptions, "message" | "type" | "resolve">) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const showAlert = (message: string, options?: Omit<ModalOptions, "message" | "type" | "resolve">): Promise<void> => {
    return new Promise((resolve) => {
      setModal({
        message,
        type: "alert",
        resolve: () => {
          setModal(null);
          resolve();
        },
        title: options?.title || "Notifikasi",
        confirmText: options?.confirmText || "OK",
        variant: options?.variant || "info",
      });
    });
  };

  const showConfirm = (message: string, options?: Omit<ModalOptions, "message" | "type" | "resolve">): Promise<boolean> => {
    return new Promise((resolve) => {
      setModal({
        message,
        type: "confirm",
        resolve: (value: boolean) => {
          setModal(null);
          resolve(value);
        },
        title: options?.title || "Konfirmasi",
        confirmText: options?.confirmText || "Ya, Lanjutkan",
        cancelText: options?.cancelText || "Batal",
        variant: options?.variant || "warning",
      });
    });
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {modal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#161e22] border border-white/10 rounded-2xl p-6 shadow-2xl animate-scale-up space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${
                modal.variant === "danger"
                  ? "bg-red-500/10 text-red-500"
                  : modal.variant === "success"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : modal.variant === "warning"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-blue-500/10 text-blue-400"
              }`}>
                {modal.variant === "danger" ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : modal.variant === "success" ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : modal.variant === "warning" ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold text-white tracking-wide">{modal.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{modal.message}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              {modal.type === "confirm" && (
                <button
                  onClick={() => modal.resolve?.(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all cursor-pointer"
                >
                  {modal.cancelText}
                </button>
              )}
              <button
                onClick={() => modal.resolve?.(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all cursor-pointer ${
                  modal.variant === "danger"
                    ? "bg-red-600 hover:bg-red-500 shadow-red-500/10"
                    : modal.variant === "success"
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10"
                    : modal.variant === "warning"
                    ? "bg-amber-600 hover:bg-amber-500 shadow-amber-500/10"
                    : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/10"
                }`}
              >
                {modal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
