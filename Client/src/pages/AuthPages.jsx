import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { TrendingUp, Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import { forgotPasswordApi, resetPasswordApi } from "../api";

// ── Shared card shell ─────────────────────────────────────────────────────────
const AuthCard = ({ darkMode, children }) => (
  <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
    <div className={`w-full max-w-md rounded-2xl border p-8 shadow-lg ${
      darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-100 text-gray-900"
    }`}>
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg">SmartTechFinance</span>
      </div>
      {children}
    </div>
  </div>
);

// ── Input field ───────────────────────────────────────────────────────────────
const Field = ({ label, darkMode, ...props }) => (
  <div className="space-y-1.5">
    <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
      {label}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition
        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
        ${darkMode
          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
        }`}
    />
  </div>
);

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
const ForgotPassword = ({ darkMode, onBack }) => {
  const [email, setEmail]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      setSubmitted(true);
    } catch (err) {
      toast.error("Could not send reset email. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthCard darkMode={darkMode}>
        <div className="flex flex-col items-center text-center py-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            darkMode ? "bg-indigo-900/40" : "bg-indigo-50"
          }`}>
            <Mail className="w-7 h-7 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          <p className={`text-sm mb-3 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            If <span className="font-medium text-indigo-500">{email}</span> is registered,
            you'll receive a password reset link shortly.
          </p>
          <p className={`text-xs mb-6 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Didn't receive it? Check your spam folder or try again.
          </p>
          <button
            onClick={() => { setSubmitted(false); setEmail(""); }}
            className="text-sm font-medium text-indigo-500 hover:underline mb-3"
          >
            Try a different email
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard darkMode={darkMode}>
      <button
        onClick={onBack}
        className={`flex items-center gap-1.5 text-xs font-medium mb-6 transition ${
          darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
      </button>

      <h2 className="text-2xl font-bold mb-1">Forgot password?</h2>
      <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Enter your email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Email address"
          darkMode={darkMode}
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-medium text-sm transition mt-2"
        >
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
    </AuthCard>
  );
};

// ── RESET PASSWORD ────────────────────────────────────────────────────────────
export const ResetPassword = ({ darkMode, token }) => {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordApi(token, password);

      if (res.token && res.user) {
        // ✅ Use AuthContext to properly set token + user — no manual localStorage
        localStorage.setItem("et_token", res.token);
        setSuccess(true);
        toast.success("Password reset! Signing you in…");

        // Small delay so toast is visible, then reload to dashboard
        setTimeout(() => {
          window.history.replaceState({}, "", "/");
          window.location.reload();
        }, 1500);
      } else {
        toast.error(res.message || "Reset failed. The link may have expired.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard darkMode={darkMode}>
        <div className="flex flex-col items-center text-center py-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            darkMode ? "bg-emerald-900/40" : "bg-emerald-50"
          }`}>
            <Lock className="w-7 h-7 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Password updated!</h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Signing you in to your dashboard…
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard darkMode={darkMode}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${
        darkMode ? "bg-indigo-900/40" : "bg-indigo-50"
      }`}>
        <Lock className="w-6 h-6 text-indigo-500" />
      </div>

      <h2 className="text-2xl font-bold mb-1">Set new password</h2>
      <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Choose a strong password — at least 6 characters.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New password */}
        <div className="space-y-1.5">
          <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min. 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none transition
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Confirm Password
          </label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Re-enter your password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              ${darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
              }
              ${confirm && password !== confirm ? "border-red-400 focus:ring-red-400" : ""}
            `}
          />
          {confirm && password !== confirm && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || (confirm.length > 0 && password !== confirm)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-medium text-sm transition mt-2"
        >
          {loading ? "Resetting…" : "Reset Password"}
        </button>
      </form>
    </AuthCard>
  );
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const Login = ({ darkMode, onSwitch }) => {
  const { login } = useAuth();
  const [form, setForm]             = useState({ email: "", password: "" });
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  if (showForgot) {
    return <ForgotPassword darkMode={darkMode} onBack={() => setShowForgot(false)} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard darkMode={darkMode}>
      <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
      <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Email"
          darkMode={darkMode}
          type="email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-xs text-indigo-500 hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none transition
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-medium text-sm transition mt-2"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className={`mt-6 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Don't have an account?{" "}
        <button onClick={onSwitch} className="text-indigo-500 font-semibold hover:underline">
          Register
        </button>
      </p>
    </AuthCard>
  );
};

// ── REGISTER ──────────────────────────────────────────────────────────────────
export const Register = ({ darkMode, onSwitch }) => {
  const { register } = useAuth();
  const [form, setForm]         = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard darkMode={darkMode}>
      <h2 className="text-2xl font-bold mb-1">Create account</h2>
      <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Start tracking your finances
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Full Name"
          darkMode={darkMode}
          type="text"
          placeholder="John Doe"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Field
          label="Email"
          darkMode={darkMode}
          type="email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="space-y-1.5">
          <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min. 6 characters"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none transition
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-medium text-sm transition mt-2"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className={`mt-6 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-indigo-500 font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </AuthCard>
  );
};