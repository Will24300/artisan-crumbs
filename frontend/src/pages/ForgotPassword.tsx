import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Sun, Moon, KeyRound, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import iconImg from "../assets/Icon.png";
import { useTheme } from "../features/theme";
import { API_BASE } from "../utils/api";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [demoResetUrl, setDemoResetUrl] = useState<string | null>(null);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to process request");
        return;
      }

      setSubmitted(true);
      if (data.resetUrl) {
        setDemoResetUrl(data.resetUrl);
      }
      toast.success("Password reset request sent! 🥖");
    } catch {
      setError("Unable to connect to the server. Please check your connection.");
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
          <Link to="/login" className="hover:text-[#D46211] transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Back to Sign In
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
              backgroundImage: `url('https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#241812]/90 via-[#241812]/40 to-transparent" />
            <div className="absolute top-8 left-8">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-[#F2A469] text-[11px] font-bold px-3 py-1.5 rounded-full tracking-widest border border-white/15 uppercase">
                <KeyRound size={13} /> Secure Account Recovery
              </span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 text-white">
              <h2 className="font-serif text-2xl md:text-[28px] font-bold leading-tight mb-2 tracking-tight">
                Don't worry,
                <br />
                we've got you covered.
              </h2>
              <p className="text-xs text-gray-200/90 leading-relaxed max-w-sm">
                Follow the simple steps to reset your password and get back to enjoying fresh bakes.
              </p>
            </div>
          </div>

          {/* Form / Success Card */}
          <div className="w-full md:w-1/2 px-4 py-8 md:p-10 flex flex-col justify-center bg-white dark:bg-stone-900">
            {!submitted ? (
              <>
                <motion.div className="mb-6" initial="initial" animate="animate" variants={fadeInUp}>
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#D46211] flex items-center justify-center mb-4">
                    <KeyRound size={24} />
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241812] dark:text-stone-100 tracking-tight">
                    Forgot password?
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748B] dark:text-stone-400 mt-1.5 font-medium leading-relaxed">
                    No problem! Enter the email address associated with your account and we&apos;ll send you instructions to reset your password.
                  </p>
                </motion.div>

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
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-stone-800 text-sm outline-none focus:border-[#D46211] focus:ring-4 focus:ring-[#D46211]/10 bg-[#FDFDFD] dark:bg-[#12100f] text-[#334155] dark:text-stone-200 transition-shadow"
                      />
                    </div>
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
                    disabled={loading}
                    className="w-full bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold py-3.5 rounded-xl transition-colors duration-200 shadow-md shadow-[#D46211]/15 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer text-sm tracking-wide"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending instructions...
                      </>
                    ) : (
                      "Send Reset Instructions"
                    )}
                  </button>
                </motion.form>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={30} />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#241812] dark:text-stone-100">
                    Check your inbox
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] dark:text-stone-400 mt-2 leading-relaxed">
                    If an account exists for <strong className="text-stone-800 dark:text-stone-200">{email}</strong>, we have sent instructions to reset your password.
                  </p>
                </div>

                {demoResetUrl && (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                    <p className="font-semibold flex items-center gap-1.5">
                      <KeyRound size={14} className="text-[#D46211]" /> Demo Password Reset Link:
                    </p>
                    <p className="text-[11px] opacity-80">
                      In local dev mode, click below to open the password reset page directly:
                    </p>
                    <Link
                      to={demoResetUrl}
                      className="inline-flex items-center gap-1.5 font-bold text-[#D46211] hover:underline pt-1"
                    >
                      Reset Password Now <ExternalLink size={13} />
                    </Link>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-3 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    Didn&apos;t get the email? Try again
                  </button>

                  <Link
                    to="/login"
                    className="w-full text-center py-3 rounded-xl bg-[#D46211] text-white text-xs font-bold hover:bg-[#b04f0b] transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}

            <p className="mt-8 text-xs text-center text-gray-500 dark:text-stone-400 font-medium">
              Remember your password?{" "}
              <Link to="/login" className="font-bold text-[#D46211] hover:text-[#b04f0b] hover:underline">
                Sign in here
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

export default ForgotPassword;
