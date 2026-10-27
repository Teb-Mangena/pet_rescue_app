import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Search,
  Heart,
  MapPin,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease },
  }),
};

const STATS = [
  { value: "1,204", label: "Pets reunited" },
  { value: "87", label: "Found this week" },
  { value: "12", label: "Partner shelters" },
];

const STEPS = [
  {
    num: "01",
    title: "Report",
    desc: "Snap a photo, drop a pin, and let the community know. Takes 30 seconds.",
    icon: MapPin,
  },
  {
    num: "02",
    title: "Match",
    desc: "Our local SPCA branches and neighbors cross-check missing and found reports.",
    icon: Search,
  },
  {
    num: "03",
    title: "Reunite",
    desc: "Verify the claim at your local branch and bring your best friend home.",
    icon: Heart,
  },
];

const STORIES = [
  {
    pet: "Biscuit",
    species: "Golden Retriever",
    days: 9,
    city: "Cape Town",
    quote: "We'd almost given up. Then a neighbor scanned his tag.",
  },
  {
    pet: "Mochi",
    species: "Cat",
    days: 3,
    city: "Johannesburg",
    quote: "The rescue operator found her under a parked car.",
  },
  {
    pet: "Rex",
    species: "Dog",
    days: 21,
    city: "Durban",
    quote: "Three weeks. One photo. One call. Home.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-bone text-ink overflow-x-hidden">
      {/* ============ HERO ============ */}
      <section className="relative max-w-[1400px] mx-auto px-6 pt-16 md:pt-10 pb-20">
        {/* Faint grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — copy */}
          <div>
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-moss/10 text-moss text-xs font-semibold mb-6"
            >
              <span className="grid place-items-center w-4 h-4 rounded-full bg-moss">
                <span className="w-1.5 h-1.5 rounded-full bg-bone animate-pulse" />
              </span>
              Connecting communities with local SPCAs
            </motion.div>

            <h1 className="font-display font-black text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em]">
              <motion.span
                variants={fadeUp}
                custom={1}
                initial="hidden"
                animate="show"
                className="block"
              >
                Every pet
              </motion.span>
              <motion.span
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="show"
                className="block"
              >
                deserves a
              </motion.span>
              <motion.span
                variants={fadeUp}
                custom={3}
                initial="hidden"
                animate="show"
                className="block text-burnt"
              >
                way home.
              </motion.span>
            </h1>

            <motion.p
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="show"
              className="mt-6 text-lg text-stone max-w-lg leading-relaxed"
            >
              Report missing or found pets, track real-time incidents, and help
              local rescue organizations reunite families. One community. One
              map.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
              >
                Browse the Feed
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium"
              >
                Report a Pet
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — Poster style card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="relative rounded-[2rem] bg-ink text-bone p-6 pb-8 shadow-2xl shadow-ink/20 overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-bone/50">
                <span>Found Pet</span>
                <span>#4821</span>
              </div>

              {/* Graphic placeholder */}
              <div className="mt-4 aspect-[4/3] rounded-2xl bg-amber/10 grid place-items-center overflow-hidden relative">
                <PawPrint className="w-24 h-24 text-amber/40 animate-bob" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-display font-black text-2xl">Found</div>
                  <div className="text-sm text-bone/80">
                    Beacon Bay, East London
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="font-display font-black text-2xl leading-none">
                    Awaiting Owner
                  </div>
                  <div className="text-bone/60 text-sm mt-1">
                    Reported 2 hours ago
                  </div>
                </div>
                <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber/20 text-amber">
                  In Shelter
                </span>
              </div>

              {/* pin badge */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: -8 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="absolute top-5 right-5 w-14 h-14 rounded-full bg-amber text-ink grid place-items-center shadow-lg"
              >
                <MapPin className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="border-y border-ink/10 bg-ink text-bone py-5 overflow-hidden">
        <div className="flex gap-10 whitespace-nowrap animate-marquee will-change-transform">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10 shrink-0">
              {[
                "Missing pets",
                "Found reports",
                "Hand-overs",
                "Happy Tails",
                "SPCA Partners",
                "Community Help",
              ].map((w) => (
                <span
                  key={w}
                  className="flex items-center gap-10 font-display text-2xl md:text-3xl font-bold tracking-tight"
                >
                  {w}
                  <PawPrint className="w-5 h-5 text-amber" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
              className="px-0 md:px-10 py-6 md:py-0 first:md:pl-0 last:md:pr-0"
            >
              <div className="font-display font-black text-5xl md:text-6xl tracking-tight">
                {s.value}
              </div>
              <div className="mt-2 text-stone">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="max-w-[1400px] mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="font-display font-black text-4xl md:text-6xl tracking-[-0.02em]"
          >
            How it works
          </motion.h2>
          <p className="text-stone max-w-sm">
            Three steps to bring them back together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.55, ease }}
                className="relative p-8 rounded-2xl border border-ink/10 bg-base-200 hover:bg-bone hover:border-ink/20 transition-colors group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="font-display font-black text-5xl text-burnt/20 group-hover:text-burnt transition-colors">
                    {step.num}
                  </div>
                  <div className="grid place-items-center w-12 h-12 rounded-xl bg-bone border border-ink/5 group-hover:bg-burnt/10 transition-colors">
                    <Icon className="w-5 h-5 text-stone group-hover:text-burnt" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-ink/70 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ HAPPY TAILS / STORIES ============ */}
      <section id="stories" className="bg-base-200 border-y border-ink/10">
        <div className="max-w-[1400px] mx-auto px-6 py-24">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="font-display font-black text-4xl md:text-6xl tracking-[-0.02em]"
            >
              Happy Tails
            </motion.h2>
            <Link
              to="/stories"
              className="inline-flex items-center gap-1 text-burnt font-medium hover:text-burnt-deep transition-colors"
            >
              Read all stories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STORIES.map((s, i) => (
              <motion.article
                key={s.pet}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.55, ease }}
                className="p-7 rounded-2xl bg-bone border border-ink/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5 transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-moss mb-4">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-moss/15">
                    <Heart className="w-3 h-3" />
                  </span>
                  REUNITED IN {s.days} DAYS
                </div>
                <div className="font-display font-black text-3xl tracking-tight">
                  {s.pet}
                </div>
                <div className="text-sm text-stone mt-1 mb-5">
                  {s.species} · {s.city}
                </div>
                <p className="text-ink/80 italic leading-relaxed">
                  "{s.quote}"
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOR SHELTERS ============ */}
      <section id="shelters" className="max-w-[1400px] mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="relative rounded-[2rem] bg-ink text-bone overflow-hidden"
        >
          <div aria-hidden className="absolute inset-0 opacity-[0.06]">
            <PawPrint
              className="absolute -top-10 -right-10 w-72 h-72 text-bone"
              strokeWidth={0.6}
            />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-10 p-10 md:p-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-widest mb-4">
                <ShieldCheck className="w-4 h-4" />
                For SPCA Managers & Admins
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05]">
                Manage your branch.
                <br />
                Verify hand-overs.
              </h2>
              <p className="mt-5 text-bone/70 max-w-md leading-relaxed">
                Access your localized dashboard to review found pets, approve
                claims from owners, and log reunions in the Happy Tails feed.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-amber text-ink font-medium hover:bg-bone transition-colors"
                >
                  Staff Sign In
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                {
                  title: "Localized Incidents",
                  desc: "See only missing and found pets in your branch's area.",
                  icon: MapPin,
                },
                {
                  title: "Hand-Over Approvals",
                  desc: "Verify pet owners in person before releasing a pet.",
                  icon: CheckCircle2,
                },
                {
                  title: "Community Feed",
                  desc: "Post reunion stories to inspire the community.",
                  icon: MessageSquare,
                },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-bone/5 border border-bone/10 backdrop-blur-sm"
                  >
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-amber/15 text-amber shrink-0">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-semibold">{f.title}</div>
                      <div className="text-sm text-bone/60">{f.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-ink/10">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-ink text-bone">
              <PawPrint className="w-4 h-4" />
            </span>
            <span className="font-display font-black text-ink">Pet Rescue</span>
          </div>
          <div className="flex flex-wrap gap-6 text-stone">
            <a href="#" className="hover:text-ink transition-colors">
              About
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Contact
            </a>
            <a href="#shelters" className="hover:text-ink transition-colors">
              For Shelters
            </a>
          </div>
          <div className="text-stone">
            © {new Date().getFullYear()} Pet Rescue
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
