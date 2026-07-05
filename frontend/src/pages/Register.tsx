import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setCredentials } from "../features/auth";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import iconImg from "../assets/Icon.png";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      dispatch(setCredentials({ token: data.token, user: data.user }));
      toast.success(`Account created! Welcome, ${data.user.name}! 🍰`, { autoClose: 5000 });
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (fetchError) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#F9F9F8] flex flex-col justify-between px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden">
      <header className="w-full max-w-5xl mx-auto py-3.5 flex items-center justify-between border-b border-gray-100 px-2 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3">
          <img src={iconImg} alt="Artisan Crumbs Logo" className="h-8 w-8 object-contain" />
          <span className="font-bold text-[19px] text-[#0F172A] font-sans">Artisan Crumbs</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold text-[#475569]">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-3 md:p-6">
        <div className="max-w-5xl w-full bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.05)] border border-gray-100/80 flex flex-col md:flex-row">
          {/* Mobile hero */}
          <div className="md:hidden w-full h-40 bg-cover bg-center rounded-t-[32px]" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop')` }} />

          <div className="hidden md:block w-1/2 relative bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 text-white">
              <h2 className="text-2xl md:text-[28px] font-extrabold leading-tight mb-2 tracking-tight font-sans">
                Authentic Flavors,<br />Handcrafted Daily.
              </h2>
              <p className="text-xs text-gray-200/90 leading-relaxed max-w-sm">
                Join our community of bread lovers and sweet enthusiasts.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 px-4 py-8 md:p-10 flex flex-col justify-center bg-white">
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight break-words">Create an Account</h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium break-words">
                Please enter your details to register.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Volonte Rwicha"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#FEF3C7] bg-[#FDFDFD] text-[#334155] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#FEF3C7] bg-[#FDFDFD] text-[#334155] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#FEF3C7] bg-[#FDFDFD] text-[#334155] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#94A3B8] hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-600 font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F59E0B] hover:bg-[#E5A10F] text-black font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer text-sm tracking-wide"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">or continue with</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer bg-white"
                onClick={() => toast.success("Google integration demo success!")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer bg-white"
                onClick={() => toast.success("Facebook integration demo success!")}
              >
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <p className="mt-8 text-sm text-center text-gray-500 font-medium">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-[#F59E0B] hover:text-[#D97706] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto py-3.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#94A3B8] px-2 flex-shrink-0">
        <p>© 2024 Artisan Crumbs Bakery. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="cursor-pointer hover:text-gray-600 transition-colors">Privacy Policy</span>
          <span className="cursor-pointer hover:text-gray-600 transition-colors">Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}

export default Register;
