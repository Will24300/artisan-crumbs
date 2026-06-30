import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../features/auth";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitText = mode === "login" ? "Sign In" : "Create Account";
  const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = mode === "login" ? { email, password } : { name, email, password };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Authentication failed");
        return;
      }
      dispatch(setCredentials({ token: data.token, user: data.user }));
      navigate(mode === "login" ? "/" : "/");
    } catch (fetchError) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F8F7F5] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-4xl p-8 shadow-xl shadow-black/5">
        <div className="mb-6 text-center">
          <p className="text-[#F59E0B] font-bold uppercase tracking-[0.3em] text-xs mb-2">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </p>
          <h1 className="text-3xl font-bold text-gray-900">{submitText}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <label className="block">
              <span className="text-sm text-gray-700">Full Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B]"
                placeholder="John Doe"
                required
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B]"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B]"
              placeholder="Enter your password"
              required
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F59E0B] py-3 text-sm font-bold text-black transition hover:bg-[#dca022] disabled:opacity-70"
          >
            {loading ? "Please wait..." : submitText}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-[#64748B]">
          {mode === "login" ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setMode("register")} className="font-semibold text-[#F59E0B] underline">
                Register
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button onClick={() => setMode("login")} className="font-semibold text-[#F59E0B] underline">
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Login;
