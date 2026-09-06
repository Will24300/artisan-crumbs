import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setCredentials } from "../features/auth";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import iconImg from "../assets/Icon.png";
import { useTheme } from "../features/theme";
import { API_BASE } from "../utils/api";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Authentication failed");
        return;
      }
      dispatch(setCredentials({ token: data.token, user: data.user }));
      toast.success(`Welcome back, ${data.user.name}! 🎂`, { autoClose: 5000 });
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#F9F9F8] dark:bg-[#0f0d0c] flex flex-col justify-between px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden transition-colors duration-300">


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
          <Link to="/" className="hover:text-[#D46211] transition-colors">
            Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-3 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-5xl w-full bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(36,24,18,0.06)] border border-gray-100/80 flex flex-col md:flex-row"
        >
          {/* Mobile hero */}
          <div
            className="md:hidden w-full h-40 bg-cover bg-center rounded-t-[32px]"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop')` }}
          />

          <div
            className="hidden md:block w-1/2 relative bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#241812]/85 via-[#241812]/30 to-transparent" />
            <div className="absolute top-8 left-8">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-[#F2A469] text-[11px] font-bold px-3 py-1.5 rounded-full tracking-widest border border-white/15 uppercase">
                <span className="w-1 h-1 rounded-full bg-[#F2A469]" />
                Since 1994
              </span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 text-white">
              <h2 className="font-serif text-2xl md:text-[28px] font-bold leading-tight mb-2 tracking-tight">
                Authentic flavors,
                <br />
                handcrafted daily.
              </h2>
              <p className="text-xs text-gray-200/90 leading-relaxed max-w-sm">
                Join our community of bread lovers and sweet enthusiasts.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 px-4 py-8 md:p-10 flex flex-col justify-center bg-white dark:bg-stone-900">
            <motion.div
              className="mb-5"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241812] dark:text-stone-100 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-stone-400 mt-1 font-medium">
                Enter your details to sign in.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <div>
                <label className="block text-xs font-bold text-[#334155] dark:text-stone-300 mb-2 uppercase tracking-wide">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-stone-850 text-sm outline-none focus:border-[#D46211] focus:ring-4 focus:ring-[#D46211]/10 bg-[#FDFDFD] dark:bg-[#12100f] text-[#334155] dark:text-stone-200 transition-shadow"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-[#334155] dark:text-stone-300 uppercase tracking-wide">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-bold text-[#D46211] hover:text-[#b04f0b] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-stone-850 text-sm outline-none focus:border-[#D46211] focus:ring-4 focus:ring-[#D46211]/10 bg-[#FDFDFD] dark:bg-[#12100f] text-[#334155] dark:text-stone-200 transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#D46211] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                  <button
                    type="button"
                    className="ml-auto text-red-400 hover:text-red-600 shrink-0"
                    onClick={() => setError(null)}
                    aria-label="Dismiss error"
                  >
                    ✕
                  </button>
                </motion.div>
              )}

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold py-3.5 rounded-xl transition-colors duration-200 shadow-md shadow-[#D46211]/15 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer text-sm tracking-wide"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </motion.form>

            <p className="mt-8 text-sm text-center text-gray-500 dark:text-stone-400 font-medium">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-bold text-[#D46211] hover:text-[#b04f0b] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

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

export default Login;