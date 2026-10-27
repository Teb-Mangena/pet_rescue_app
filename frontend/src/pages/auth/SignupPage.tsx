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
  Check,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
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

// Shared field styles to keep it clean and consistent
const fieldBase =
  "flex items-center gap-3 h-12 w-full rounded-xl bg-bone border px-4 transition-all";
const fieldIdle =
  "border-ink/10 focus-within:border-burnt focus-within:ring-4 focus-within:ring-burnt/10";
const fieldError = "border-burnt-deep/60";
const inputBase =
  "grow bg-transparent outline-none text-base text-ink placeholder:text-stone/60 min-w-0";

function SignupPage() {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Call the Zustand store action
    await signup({ email, password });

    // Note: The store handles the toast. If successful, the user object is set.
    // We redirect to the onboarding step.
    // (If your store handles the redirect, you can remove this line)
    navigate("/onboard");
  };

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;

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
            Join the network
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="font-display font-black text-4xl xl:text-5xl leading-[1.05] tracking-[-0.02em]"
          >
            Every sighting
            <br />
            <span className="text-amber">counts.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-5 text-bone/70 leading-relaxed"
          >
            Create an account to report missing pets, post found strays, and
            help reunite families in your community.
          </motion.p>

          <motion.ul
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-10 space-y-3"
          >
            {[
              "Report missing or found pets",
              "Track your hand-overs with SPCAs",
              "Share and comment on Happy Tails",
            ].map((line) => (
              <li
                key={line}
                className="flex items-center gap-3 text-sm text-bone/80"
              >
                <span className="grid place-items-center w-5 h-5 rounded-full bg-moss/25 text-moss">
                  <Check className="w-3 h-3" />
                </span>
                {line}
              </li>
            ))}
          </motion.ul>
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
            Create an account
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mt-2 text-stone">
            It only takes a minute to join the community.
          </motion.p>

          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            {/* EMAIL */}
            <motion.div variants={fadeUp} custom={3}>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email address
              </label>
              <label
                className={`${fieldBase} ${error ? fieldError : fieldIdle}`}
              >
                <Mail className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBase}
                />
              </label>
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={fadeUp} custom={4}>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <label
                className={`${fieldBase} ${error ? fieldError : fieldIdle}`}
              >
                <Lock className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Create a strong password"
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

            {/* CONFIRM PASSWORD */}
            <motion.div variants={fadeUp} custom={5}>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm password
              </label>
              <label
                className={`${fieldBase} ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? fieldError
                    : passwordsMatch
                      ? "border-moss/60"
                      : fieldIdle
                }`}
              >
                <Lock className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputBase}
                />
                {passwordsMatch && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="grid place-items-center w-4 h-4 rounded-full bg-moss text-bone shrink-0"
                  >
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </motion.span>
                )}
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

            {/* TERMS CHECKBOX */}
            <motion.label
              variants={fadeUp}
              custom={6}
              className="flex items-start gap-2.5 text-sm cursor-pointer select-none"
            >
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border border-ink/20 bg-base-200 accent-burnt cursor-pointer"
              />
              <span className="text-stone">
                I agree to the{" "}
                <a href="#" className="link link-hover text-ink font-medium">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="link link-hover text-ink font-medium">
                  Privacy Policy
                </a>
                .
              </span>
            </motion.label>

            {/* SUBMIT BUTTON */}
            <motion.button
              variants={fadeUp}
              custom={7}
              type="submit"
              disabled={isSigningUp || !passwordsMatch}
              className="inline-flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSigningUp ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <motion.p
            variants={fadeUp}
            custom={8}
            className="mt-8 text-center text-sm text-stone"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="link link-hover text-burnt font-medium"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}

export default SignupPage;
