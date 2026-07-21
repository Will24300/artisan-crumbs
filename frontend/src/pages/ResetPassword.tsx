import { useState, useMemo, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Sun, Moon, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import iconImg from "../assets/Icon.png";
import { useTheme } from "../features/theme";
import { API_BASE } from "../utils/api";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const isLengthValid = useMemo(() => newPassword.length >= 6, [newPassword]);
  const isMatchValid = useMemo(() => newPassword === confirmPassword && confirmPassword.length > 0, [newPassword, confirmPassword]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    if (!isLengthValid) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!isMatchValid) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setResetSuccess(true);
      toast.success("Password reset successfully! 🎉");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#F9F9F8] dark:bg-[#0f0d0c] flex flex-col justify-between px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto py-3.5 flex items-center justify-between border-b border-gray-100 dark:border-stone-800 px-2 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FFF4EB] overflow-hidden shrink-0">
            <img src={iconImg} alt="" className="h-6 w-6 object-contain" />
          </span>
          <span className="font-serif font-bold text-[19px] text-[#241812] dark:text-stone-100">Artisan Crumbs</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-semibold text-[#475569] dark:text-stone-400">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:text-[#D46211] transition-colors"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link to="/login" className="hover:text-[#D46211] transition-colors">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-3 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-5xl w-full bg-white dark:bg-stone-900 rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(36,24,18,0.06)] border border-gray-100/80 dark:border-stone-800 flex flex-col md:flex-row"
        >
          {/* Side Hero Banner */}
          <div
            className="hidden md:block w-1/2 relative bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1000&auto=format&fit=crop')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#241812]/90 via-[#241812]/40 to-transparent" />
            <div className="absolute top-8 left-8">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-[#F2A469] text-[11px] font-bold px-3 py-1.5 rounded-full tracking-widest border border-white/15 uppercase">
                <ShieldCheck size={13} /> Reset Your Password
              </span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 text-white">
              <h2 className="font-serif text-2xl md:text-[28px] font-bold leading-tight mb-2 tracking-tight">
                Create a fresh,
                <br />
                strong password.
              </h2>
              <p className="text-xs text-gray-200/90 leading-relaxed max-w-sm">
                Ensure your account is protected with a secure password of at least 6 characters.
              </p>
            </div>
          </div>

          {/* Form / Success Card */}
          <div className="w-full md:w-1/2 px-4 py-8 md:p-10 flex flex-col justify-center bg-white dark:bg-stone-900">
            {!resetSuccess ? (
              <>
                <motion.div className="mb-5" initial="initial" animate="animate" variants={fadeInUp}>
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#D46211] flex items-center justify-center mb-4">
                    <Lock size={24} />
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241812] dark:text-stone-100 tracking-tight">
                    Set new password
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748B] dark:text-stone-400 mt-1 font-medium">
                    Enter your new password below to reset your credentials.
                  </p>
                </motion.div>

                {!token ? (
                  <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 space-y-3 text-xs text-amber-900 dark:text-amber-200">
                    <p className="font-semibold flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-600 shrink-0" />
                      Missing Reset Token
                    </p>
                    <p>No password reset token was provided in the link. Please request a new password reset email.</p>
                    <Link
                      to="/forgot-password"
                      className="inline-flex items-center gap-1 font-bold text-[#D46211] hover:underline pt-1"
                    >
                      Request Password Reset <ArrowRight size={13} />
                    </Link>
                  </div>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial="initial"
                    animate="animate"
                    variants={fadeInUp}
                    transition={{ delay: 0.05 }}
                  >
                    <div>
                      <label className="block text-xs font-bold text-[#334155] dark:text-stone-300 mb-2 uppercase tracking-wide">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-stone-800 text-sm outline-none focus:border-[#D46211] focus:ring-4 focus:ring-[#D46211]/10 bg-[#FDFDFD] dark:bg-[#12100f] text-[#334155] dark:text-stone-200 transition-shadow"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#D46211] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {newPassword.length > 0 && (
                        <p className={`text-[11px] mt-1 font-medium ${isLengthValid ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {isLengthValid ? "✓ At least 6 characters" : "Must be at least 6 characters"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] dark:text-stone-300 mb-2 uppercase tracking-wide">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-stone-800 text-sm outline-none focus:border-[#D46211] focus:ring-4 focus:ring-[#D46211]/10 bg-[#FDFDFD] dark:bg-[#12100f] text-[#334155] dark:text-stone-200 transition-shadow"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#D46211] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPassword.length > 0 && (
                        <p className={`text-[11px] mt-1 font-medium ${isMatchValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                          {isMatchValid ? "✓ Passwords match" : "Passwords do not match"}
                        </p>
                      )}
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2"
                      >
                        <AlertCircle size={14} className="shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !isLengthValid || !isMatchValid}
                      className="w-full bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold py-3.5 rounded-xl transition-colors duration-200 shadow-md shadow-[#D46211]/15 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm tracking-wide"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Resetting password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </motion.form>
                )}
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto md:mx-0">
                  <CheckCircle2 size={30} />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#241812] dark:text-stone-100">
                    Password Reset Complete!
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] dark:text-stone-400 mt-2 leading-relaxed">
                    Your password has been successfully updated. You can now log in using your new credentials.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-[#D46211]/15 flex items-center justify-center gap-2 text-sm"
                  >
                    Sign In Now <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            <p className="mt-8 text-xs text-center text-gray-500 dark:text-stone-400 font-medium">
              Back to{" "}
              <Link to="/login" className="font-bold text-[#D46211] hover:text-[#b04f0b] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto py-3.5 border-t border-gray-100 dark:border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#94A3B8] dark:text-stone-500 px-2 flex-shrink-0">
        <p>© 2026 Artisan Crumbs Bakery. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="cursor-pointer hover:text-[#D46211] transition-colors">Privacy Policy</span>
          <span className="cursor-pointer hover:text-[#D46211] transition-colors">Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}

export default ResetPassword;
