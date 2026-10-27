import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  User,
  Phone,
  MapPin,
  ChevronDown,
  ArrowRight,
  Check,
  ShieldCheck,
  Dog,
  Users,
  Mail,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
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

// Shared field styles
const fieldBase =
  "flex items-center gap-3 h-12 w-full rounded-xl bg-bone border border-ink/10 px-4 transition-all focus-within:border-burnt focus-within:ring-4 focus-within:ring-burnt/10";
const inputBase =
  "grow bg-transparent outline-none text-base text-ink placeholder:text-stone/60 min-w-0";

// Map data from your SQL seed files
const CONTACT_PREFS = [
  { id: 1, label: "Phone" },
  { id: 21, label: "Email" },
  { id: 2, label: "In App" },
  { id: 3, label: "Any" },
  { id: 41, label: "Phone or Email" },
];

const LOCATIONS = [
  { id: 1, label: "Premier Street" },
  { id: 2, label: "Karoo Street" },
  { id: 3, label: "Joseph Street" },
  { id: 4, label: "Jackson Street" },
  { id: 5, label: "Badela Road" },
  { id: 6, label: "St Georges Street" },
  { id: 7, label: "Belgravia Street" },
  { id: 8, label: "Huston Street" },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const { onboard, isOnboarding, user } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPrefId, setContactPrefId] = useState<number>(1);
  const [locationId, setLocationId] = useState<number>(1);
  const [role, setRole] = useState<"pet_owner" | "community_member">(
    "pet_owner",
  );

  const handleOnboard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onboard({
      first_name: firstName,
      last_name: lastName,
      username,
      phone,
      contact_pref_id: contactPrefId,
      location_id: locationId,
      role,
    });

    // The store handles the toast and sets the user object.
    // Once successful, redirect to the main feed.
    navigate("/browse");
  };

  // Safety check: If no user is in the store, they shouldn't be here
  if (!user) {
    return (
      <div className="min-h-screen bg-bone grid place-items-center">
        <div className="text-center">
          <p className="text-stone">You need to sign up first.</p>
          <Link
            to="/signup"
            className="text-burnt font-medium underline mt-2 block"
          >
            Go to Signup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden flex flex-col justify-center py-12">
      {/* Decorative Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 left-10 w-16 h-16 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute bottom-40 right-20 w-24 h-24 text-burnt/10 rotate-[-15deg]" />
        <PawPrint className="absolute top-1/2 left-1/4 w-10 h-10 text-moss/10 rotate-[45deg]" />
      </div>

      <div className="relative max-w-[700px] mx-auto px-6 w-full">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/10 text-moss text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Step 2 of 2
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em] leading-tight">
            Complete your profile
          </h1>
          <p className="mt-4 text-lg text-stone max-w-lg">
            Just a few more details so the community knows who you are and how
            to reach you.
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          onSubmit={handleOnboard}
          className="mt-8 bg-bone/80 backdrop-blur-md border border-ink/10 rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-ink/5 space-y-6"
        >
          {/* ROLE SELECTION */}
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-widest text-stone mb-2">
              I am joining as a...
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Pet Owner Card */}
              <button
                type="button"
                onClick={() => setRole("pet_owner")}
                className={`relative text-left p-4 rounded-2xl border transition-all ${
                  role === "pet_owner"
                    ? "border-burnt bg-burnt/5 ring-2 ring-burnt/15"
                    : "border-ink/10 bg-bone hover:border-ink/25"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 ${
                      role === "pet_owner"
                        ? "bg-burnt text-bone"
                        : "bg-ink/5 text-stone"
                    }`}
                  >
                    <Dog className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-semibold text-sm">Pet Owner</div>
                    <div className="text-xs text-stone mt-0.5">
                      Register pets and report them missing.
                    </div>
                  </div>
                  {role === "pet_owner" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 grid place-items-center w-5 h-5 rounded-full bg-burnt text-bone"
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </motion.span>
                  )}
                </div>
              </button>

              {/* Community Member Card */}
              <button
                type="button"
                onClick={() => setRole("community_member")}
                className={`relative text-left p-4 rounded-2xl border transition-all ${
                  role === "community_member"
                    ? "border-moss bg-moss/5 ring-2 ring-moss/15"
                    : "border-ink/10 bg-bone hover:border-ink/25"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 ${
                      role === "community_member"
                        ? "bg-moss text-bone"
                        : "bg-ink/5 text-stone"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-semibold text-sm">
                      Community Member
                    </div>
                    <div className="text-xs text-stone mt-0.5">
                      Report found pets and help reunite them.
                    </div>
                  </div>
                  {role === "community_member" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 grid place-items-center w-5 h-5 rounded-full bg-moss text-bone"
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </motion.span>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-ink/10 my-6" />

          {/* NAME & USERNAME */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-2"
              >
                First name
              </label>
              <label className={fieldBase}>
                <User className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="firstName"
                  type="text"
                  required
                  placeholder="Tebatso"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputBase}
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-2"
              >
                Last name
              </label>
              <label className={fieldBase}>
                <input
                  id="lastName"
                  type="text"
                  required
                  placeholder="Mangena"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputBase}
                />
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Username
            </label>
            <label className={fieldBase}>
              <span className="text-stone font-medium shrink-0">@</span>
              <input
                id="username"
                type="text"
                required
                placeholder="MangenaTee"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputBase}
              />
            </label>
          </div>

          {/* PHONE */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone number
            </label>
            <label className={fieldBase}>
              <Phone className="w-4 h-4 text-stone shrink-0" />
              <input
                id="phone"
                type="tel"
                required
                placeholder="081 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputBase}
              />
            </label>
          </div>

          {/* LOCATION & PREFERENCE */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-2"
              >
                Street / Location
              </label>
              <div className="relative">
                <select
                  id="location"
                  value={locationId}
                  onChange={(e) => setLocationId(Number(e.target.value))}
                  className="w-full h-12 pl-11 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.label}
                    </option>
                  ))}
                </select>
                <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              </div>
            </div>

            <div>
              <label
                htmlFor="contactPref"
                className="block text-sm font-medium mb-2"
              >
                Preferred Contact
              </label>
              <div className="relative">
                <select
                  id="contactPref"
                  value={contactPrefId}
                  onChange={(e) => setContactPrefId(Number(e.target.value))}
                  className="w-full h-12 pl-11 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                >
                  {CONTACT_PREFS.map((pref) => (
                    <option key={pref.id} value={pref.id}>
                      {pref.label}
                    </option>
                  ))}
                </select>
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isOnboarding}
              className="inline-flex items-center justify-center gap-2 h-14 w-full rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isOnboarding ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Setting up your profile…
                </>
              ) : (
                <>
                  Complete profile
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default OnboardingPage;
