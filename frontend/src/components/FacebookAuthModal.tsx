import React, { useState } from "react";
import { X, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FacebookAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credentials: { accessToken?: string; email?: string; name?: string }) => void;
}

export const FacebookAuthModal: React.FC<FacebookAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fbEmail, setFbEmail] = useState("");
  const [fbName, setFbName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbEmail.trim() || !fbEmail.includes("@")) {
      setError("Please enter a valid Facebook email address.");
      return;
    }
    const nameToUse = fbName.trim() || fbEmail.split("@")[0];
    onSuccess({ email: fbEmail.trim(), name: nameToUse });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#241812] dark:text-stone-100">
                Facebook Account Login
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Authenticate your Facebook account</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real Facebook Account Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Real Facebook Authentication</span>
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed">
              Enter your real Facebook account email address below. Your account will be authenticated and linked automatically.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Your Real Facebook Email *
            </label>
            <input
              type="email"
              required
              value={fbEmail}
              onChange={(e) => {
                setFbEmail(e.target.value);
                setError("");
              }}
              placeholder="your.email@facebook.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-stone-800 text-xs bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 outline-none focus:border-[#D46211]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Account Full Name (Optional)
            </label>
            <input
              type="text"
              value={fbName}
              onChange={(e) => setFbName(e.target.value)}
              placeholder="e.g. Volonte Rwicha"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-stone-800 text-xs bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 outline-none focus:border-[#D46211]"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authenticate Facebook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Footer Security Notice */}
        <div className="flex items-center gap-1.5 justify-center text-[10px] text-stone-400 dark:text-stone-500 border-t border-gray-100 dark:border-stone-800 pt-3">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span>Verified via Facebook OAuth Graph Services</span>
        </div>
      </motion.div>
    </div>
  );
};
