import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { HiCheckCircle, HiHeart, HiSparkles, HiX } from "react-icons/hi";

const ToastContext = createContext();

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, { type = "success", icon = null, duration = 3000 } = {}) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, icon, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const iconMap = {
    success: <HiCheckCircle className="text-lg text-emerald-400 flex-shrink-0" />,
    favorite: <HiHeart className="text-lg text-fuchsia-400 flex-shrink-0" />,
    unfavorite: <HiHeart className="text-lg text-gray-400 flex-shrink-0" />,
    welcome: <HiSparkles className="text-lg text-amber-400 flex-shrink-0" />,
    login: (
      <svg className="w-[18px] h-[18px] text-fuchsia-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  };

  const bgMap = {
    success: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/20",
    favorite: "from-fuchsia-500/15 to-fuchsia-500/5 border-fuchsia-500/20",
    unfavorite: "from-gray-500/15 to-gray-500/5 border-gray-500/20",
    welcome: "from-amber-500/15 to-amber-500/5 border-amber-500/20",
    login: "from-fuchsia-500/15 to-purple-500/5 border-fuchsia-500/20",
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl bg-gradient-to-r shadow-2xl shadow-black/30 min-w-[280px] max-w-[380px] transition-all duration-300 ease-out
        ${bgMap[toast.type] || bgMap.success}
        ${visible && !exiting ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
      `}
    >
      {toast.icon || iconMap[toast.type] || iconMap.success}
      <p className="text-sm text-white font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
      >
        <HiX className="text-sm" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
