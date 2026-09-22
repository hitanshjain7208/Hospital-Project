import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (title: string, message?: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-[var(--r-md)] shadow-[var(--shadow-lg)] border ${
                toast.type === 'success'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--green)]/30'
                  : toast.type === 'error'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--red)]/30'
                  : toast.type === 'warning'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--gold)]/30'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--sage)]/30'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--green)' }} />}
                {toast.type === 'error' && <XCircle className="w-5 h-5" style={{ color: 'var(--red)' }} />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" style={{ color: 'var(--gold)' }} />}
                {toast.type === 'info' && <Info className="w-5 h-5" style={{ color: 'var(--sage)' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="transition-colors hover:opacity-70"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
