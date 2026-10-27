import { motion, type Variants } from "framer-motion";
import { PawPrint, Home, Search, MapPin } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease },
  }),
};

type ErrorPageProps = {
  status?: number;
  title?: string;
  message?: string;
};

function ErrorPage({ status = 404, title, message }: ErrorPageProps) {
  const { user } = useAuthStore();
  // Default messages based on status code
  const displayTitle =
    title ||
    (status === 404
      ? "This page wandered off."
      : "Something slipped the leash.");
  const displayMessage =
    message ||
    (status === 404
      ? "We sniffed every corner, but this page doesn't live here anymore."
      : "Something went wrong on our end. Give it a moment and try again.");

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden flex flex-col">
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* scattered paw prints */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[
          {
            top: "12%",
            left: "8%",
            rotate: -25,
            size: "w-10 h-10",
            opacity: "opacity-[0.06]",
          },
          {
            top: "22%",
            left: "18%",
            rotate: 15,
            size: "w-6 h-6",
            opacity: "opacity-[0.08]",
          },
          {
            top: "70%",
            left: "12%",
            rotate: 40,
            size: "w-8 h-8",
            opacity: "opacity-[0.06]",
          },
          {
            top: "18%",
            right: "10%",
            rotate: 30,
            size: "w-9 h-9",
            opacity: "opacity-[0.07]",
          },
          {
            top: "76%",
            right: "14%",
            rotate: -20,
            size: "w-7 h-7",
            opacity: "opacity-[0.08]",
          },
        ].map((p, i) => (
          <PawPrint
            key={i}
            className={`absolute ${p.size} ${p.opacity} text-ink`}
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        ))}
      </div>

      {/* main content */}
      <main className="relative flex-1 max-w-[1400px] mx-auto w-full px-6 flex items-center justify-center py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full max-w-5xl">
          {/* LEFT — copy */}
          <div className="lg:col-span-7">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-burnt/10 text-burnt text-xs font-bold uppercase tracking-widest mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-burnt animate-pulse" />
              Error {status}
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="show"
              className="flex items-baseline gap-3"
            >
              <span className="font-display font-black text-[clamp(4rem,14vw,8rem)] leading-none tracking-[-0.04em] text-burnt">
                {status}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-4 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05]"
            >
              {displayTitle}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="show"
              className="mt-5 text-lg text-stone max-w-lg leading-relaxed"
            >
              {displayMessage}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to={!user ? "/" : "/dashboard"}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
              >
                <Home className="w-4 h-4" />
                Take me home
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium"
              >
                <Search className="w-4 h-4" />
                Browse the feed
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — sad pet poster */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-sm">
              <div className="relative rounded-[2rem] bg-ink text-bone p-6 pb-8 shadow-2xl shadow-ink/20 overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-bone/50">
                  <span>Lost page</span>
                  <span>#{status}</span>
                </div>

                <div className="mt-4 aspect-square rounded-2xl bg-amber/10 grid place-items-center overflow-hidden">
                  <SadPet />
                </div>

                <div className="mt-5">
                  <div className="font-display font-black text-3xl leading-none">
                    Last seen?
                  </div>
                  <div className="text-bone/60 text-sm mt-1">
                    Somewhere between /home and /login
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: -8 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="absolute top-5 right-5 w-14 h-14 rounded-full bg-burnt text-bone grid place-items-center shadow-lg"
                >
                  <MapPin className="w-6 h-6" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Sad pet illustration ---------- */
function SadPet() {
  return (
    <div className="relative w-[75%] aspect-square">
      <div className="absolute inset-0 rounded-[42%_58%_55%_45%/50%_45%_55%_50%] bg-bone/40" />

      <svg
        viewBox="0 0 300 300"
        className="absolute inset-0 w-full h-full animate-bob"
      >
        {/* body */}
        <ellipse cx="150" cy="215" rx="72" ry="54" fill="#E8A33D" />
        {/* head */}
        <circle cx="150" cy="132" r="58" fill="#E8A33D" />
        {/* snout */}
        <ellipse cx="150" cy="158" rx="32" ry="24" fill="#F5F1EA" />
        {/* nose */}
        <ellipse cx="150" cy="149" rx="9" ry="6" fill="#1A1A1A" />
        {/* eyes — looking down-left */}
        <g className="animate-blink" style={{ transformOrigin: "118px 120px" }}>
          <circle cx="118" cy="120" r="6" fill="#1A1A1A" />
        </g>
        <g className="animate-blink" style={{ transformOrigin: "176px 120px" }}>
          <circle cx="176" cy="120" r="6" fill="#1A1A1A" />
        </g>
        {/* ears — drooped */}
        <ellipse
          cx="105"
          cy="90"
          rx="20"
          ry="32"
          fill="#A63A1C"
          transform="rotate(-35 105 90)"
        />
        <ellipse
          cx="195"
          cy="92"
          rx="20"
          ry="30"
          fill="#A63A1C"
          transform="rotate(30 195 92)"
        />
        {/* tail — tucked low */}
        <g className="animate-wag" style={{ transformOrigin: "220px 215px" }}>
          <path
            d="M220 215 Q245 235 240 258"
            stroke="#E8A33D"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

export default ErrorPage;
