import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

// Shared field styles to ensure text is always visible on the bone background
const fieldBase =
  "flex items-center gap-3 h-12 w-full rounded-xl bg-bone border px-4 transition-all";
const fieldIdle =
  "border-ink/10 focus-within:border-burnt focus-within:ring-4 focus-within:ring-burnt/10";
const fieldError = "border-burnt-deep/60";
const inputBase =
  "grow bg-transparent outline-none text-base text-ink placeholder:text-stone/60 min-w-0";

function LoginPage() {
  const { login, isLoggingIn } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await login({ identifier, password });
      // Note: App.tsx will automatically redirect the user based on their role
      // once the Zustand store updates the `user` object.
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-bone text-ink grid lg:grid-cols-2">
      {/* ============ LEFT — BRAND PANEL ============ */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-ink text-bone p-10 xl:p-14 overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.05]">
          <PawPrint
            className="absolute -top-16 -right-16 w-80 h-80 text-bone"
            strokeWidth={0.6}
          />
          <PawPrint
            className="absolute -bottom-20 -left-16 w-96 h-96 text-bone"
            strokeWidth={0.6}
          />
        </div>

        <div className="relative">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-bone text-ink group-hover:bg-amber transition-colors">
              <PawPrint className="w-4 h-4" />
            </span>
            <span className="font-display font-black text-lg tracking-tight">
              Pet Rescue
            </span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 text-amber text-[11px] font-bold uppercase tracking-widest mb-5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Welcome back
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="font-display font-black text-4xl xl:text-5xl leading-[1.05] tracking-[-0.02em]"
          >
            The rescue desk
            <br />
            <span className="text-amber">is ready.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-5 text-bone/70 leading-relaxed"
          >
            Sign in to report incidents, track hand-overs, and help reunite
            families in your community.
          </motion.p>
        </div>

        <div className="relative text-xs text-bone/40">
          © {new Date().getFullYear()} Pet Rescue · Web App
        </div>
      </aside>

      {/* ============ RIGHT — FORM ============ */}
      <main className="relative flex items-center justify-center p-6 sm:p-10">
        <Link
          to="/"
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-ink text-bone">
              <PawPrint className="w-4 h-4" />
            </span>
            <span className="font-display font-black text-lg tracking-tight">
              Pet Rescue
            </span>
          </div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]"
          >
            Sign in
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mt-2 text-stone">
            Use your email or username to continue.
          </motion.p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {/* IDENTIFIER */}
            <motion.div variants={fadeUp} custom={3}>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium mb-2"
              >
                Email or Username
              </label>
              <label
                className={`${fieldBase} ${error ? fieldError : fieldIdle}`}
              >
                <Mail className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="you@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={inputBase}
                />
              </label>
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={fadeUp} custom={4}>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-burnt hover:text-burnt-deep font-medium"
                >
                  Forgot?
                </a>
              </div>
              <label
                className={`${fieldBase} ${error ? fieldError : fieldIdle}`}
              >
                <Lock className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="grid place-items-center w-7 h-7 rounded-full text-stone hover:text-ink hover:bg-ink/5 transition-colors shrink-0"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </label>
            </motion.div>

            {/* ERROR BANNER */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-start gap-2 p-3 rounded-xl bg-burnt-deep/10 text-burnt-deep text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* REMEMBER ME */}
            <motion.div
              variants={fadeUp}
              custom={5}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2.5 text-sm text-stone cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border border-ink/20 bg-base-200 accent-burnt cursor-pointer"
                />
                Keep me signed in
              </label>
            </motion.div>

            {/* SUBMIT BUTTON */}
            <motion.button
              variants={fadeUp}
              custom={6}
              type="submit"
              disabled={isLoggingIn}
              className="inline-flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* DIVIDER */}
          <motion.div
            variants={fadeUp}
            custom={7}
            className="my-8 flex items-center gap-3 text-xs text-stone"
          >
            <span className="h-px flex-1 bg-ink/10" />
            NEW TO PET RESCUE?
            <span className="h-px flex-1 bg-ink/10" />
          </motion.div>

          {/* SIGN UP LINK */}
          <motion.p
            variants={fadeUp}
            custom={8}
            className="text-center text-sm text-stone"
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="link link-hover text-burnt font-medium"
            >
              Create one now
            </Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}

export default LoginPage;
