import { motion, type Variants } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Search,
  MessageSquare,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useProfile } from "../../hooks/useProfiles";
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

// Map IDs to readable text based on your SQL seed data
const CONTACT_PREFS: Record<number, string> = {
  1: "Phone",
  2: "In App",
  3: "Any",
  21: "Email",
  41: "Phone or Email",
};

const LOCATIONS: Record<number, string> = {
  1: "Premier Street",
  2: "Karoo Street",
  3: "Joseph Street",
  4: "Jackson Street",
  5: "Badela Road",
};

function Member_Profile() {
  const { user } = useAuthStore();
  const { error, isLoading, profile } = useProfile(String(user?.person_id));

  if (isLoading) return <PageLoader />;

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-bone grid place-items-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-5 animate-bob">🐾</div>
          <h1 className="font-display font-black text-2xl tracking-tight">
            Profile unavailable
          </h1>
          <p className="text-stone mt-2 text-sm">
            We couldn't load your profile right now.
          </p>
        </div>
      </div>
    );
  }

  // Safe fallbacks for the image and names
  const imageUrl = profile.image_url;
  const fullName = `${profile.first_name} ${profile.last_name}`;
  const initials =
    `${profile.first_name?.charAt(0) || ""}${profile.last_name?.charAt(0) || ""}`.toUpperCase();

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      <div className="relative max-w-[1000px] mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/10 text-moss text-[11px] font-bold uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5" />
              Community Member
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-stone">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Your Profile
          </h1>
        </motion.div>

        {/* MAIN GRID */}
        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          {/* LEFT: Avatar & Identity */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-ink text-bone rounded-[2rem] p-8 text-center relative overflow-hidden shadow-xl shadow-ink/10">
              <div className="relative inline-block mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-bone/10 mx-auto">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-amber text-ink text-3xl font-black">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-moss text-bone grid place-items-center border-2 border-ink">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <h2 className="font-display font-black text-2xl tracking-tight">
                {fullName}
              </h2>
              <p className="text-bone/60 text-sm mt-1">@{profile.username}</p>

              <div className="mt-6 pt-6 border-t border-bone/10 flex items-center justify-center gap-2 text-xs text-bone/50">
                <Calendar className="w-3.5 h-3.5" />
                Joined {profile.created_at}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Details & Actions */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 space-y-6"
          >
            {/* Contact Details */}
            <div className="bg-bone border border-ink/10 rounded-[2rem] p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone mb-6">
                Contact Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-ink/5 transition-colors">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-amber/10 text-amber shrink-0">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone">
                      Email
                    </div>
                    <div className="text-sm font-medium">{profile.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-ink/5 transition-colors">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-burnt/10 text-burnt shrink-0">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone">
                      Phone ({CONTACT_PREFS[profile.contact_pref_id] || "Any"})
                    </div>
                    <div className="text-sm font-medium">{profile.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-ink/5 transition-colors">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-moss/10 text-moss shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone">
                      Location
                    </div>
                    <div className="text-sm font-medium">
                      {LOCATIONS[profile.location_id] || "Unknown Area"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-amber/10 border border-amber/20 rounded-[2rem] p-8">
              <h3 className="font-display font-black text-xl tracking-tight text-ink mb-2">
                Help a neighbor today
              </h3>
              <p className="text-sm text-ink/70 mb-6 leading-relaxed">
                As a community member, you are the eyes and ears of the
                neighborhood. If you spot a stray pet, let the SPCA know
                immediately.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/report-found"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Report a Found Pet
                </Link>
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-bone border border-ink/10 text-ink font-medium hover:border-ink/30 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  View the Feed
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Temporary PawPrint component to replace the import if you don't have it globally
function PawPrint({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
    </svg>
  );
}

export default Member_Profile;
