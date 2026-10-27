import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  ShieldCheck,
  ArrowRightLeft,
  ClipboardList,
  Users,
  Building2,
  ExternalLink,
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

function ManagerDashboard() {
  const { user } = useAuthStore();
  const { error, isLoading, profile } = useProfile(String(user?.person_id));

  if (isLoading) return <PageLoader />;

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-bone grid place-items-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-5 animate-bob">🐾</div>
          <h1 className="font-display font-black text-2xl tracking-tight">
            Dashboard unavailable
          </h1>
          <p className="text-stone mt-2 text-sm">
            We couldn't load your manager profile right now.
          </p>
        </div>
      </div>
    );
  }

  const imageUrl = profile.image_url;
  const fullName = `${profile.first_name} ${profile.last_name}`;
  const initials =
    `${profile.first_name?.charAt(0) || ""}${profile.last_name?.charAt(0) || ""}`.toUpperCase();
  const org = profile.organization;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-widest">
              <Briefcase className="w-3.5 h-3.5" />
              SPCA Manager
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-stone">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Staff
            </span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Branch Overview
          </h1>
          <p className="mt-3 text-lg text-stone max-w-2xl">
            Welcome back, {profile.first_name}. Here is the latest on your
            organization.
          </p>
        </motion.div>

        {/* MAIN GRID */}
        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Manager Profile */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="lg:col-span-4 space-y-6"
          >
            {/* Personal ID Card */}
            <div className="bg-ink text-bone rounded-[2rem] p-8 text-center relative overflow-hidden shadow-xl shadow-ink/10">
              <div className="relative inline-block mb-4 mx-auto">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-bone/10">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-amber text-ink text-2xl font-black">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber text-ink grid place-items-center border-2 border-ink">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>

              <h2 className="font-display font-black text-2xl tracking-tight">
                {fullName}
              </h2>
              <p className="text-bone/60 text-sm mt-1">@{profile.username}</p>

              <div className="mt-6 pt-6 border-t border-bone/10 flex flex-col gap-2 text-xs text-bone/60 text-left">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber" /> {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber" /> {profile.phone} (
                  {CONTACT_PREFS[profile.contact_pref_id]})
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber" /> Joined{" "}
                  {profile.created_at}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Organization & Dashboard Actions */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="lg:col-span-8 space-y-6"
          >
            {/* Organization Card */}
            {org && (
              <div className="bg-bone border border-ink/10 rounded-[2rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <Building2 className="w-32 h-32" />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone">
                      Managed Organization
                    </span>
                  </div>
                  <h2 className="font-display font-black text-3xl tracking-tight text-amber">
                    {org.npo_spca_name}
                  </h2>

                  <div className="mt-6 flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2 text-ink">
                      <Mail className="w-4 h-4 text-stone" />
                      {org.org_email}
                    </div>
                    <div className="flex items-center gap-2 text-ink">
                      <Phone className="w-4 h-4 text-stone" />
                      {org.org_phone}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                to="/manager/handovers"
                className="group flex flex-col p-6 rounded-[2rem] bg-bone border border-ink/10 hover:border-burnt/40 hover:bg-bone/80 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="grid place-items-center w-12 h-12 rounded-xl bg-burnt/10 text-burnt group-hover:scale-105 transition-transform">
                    <ArrowRightLeft className="w-6 h-6" />
                  </span>
                  <ExternalLink className="w-4 h-4 text-stone opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display font-black text-lg tracking-tight">
                  Pending Hand-overs
                </h3>
                <p className="text-sm text-stone mt-1">
                  Review pets found by the community and approve claims.
                </p>
              </Link>

              <Link
                to="/manager/incidents"
                className="group flex flex-col p-6 rounded-[2rem] bg-bone border border-ink/10 hover:border-amber/40 hover:bg-bone/80 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="grid place-items-center w-12 h-12 rounded-xl bg-amber/10 text-amber group-hover:scale-105 transition-transform">
                    <ClipboardList className="w-6 h-6" />
                  </span>
                  <ExternalLink className="w-4 h-4 text-stone opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display font-black text-lg tracking-tight">
                  Branch Incidents
                </h3>
                <p className="text-sm text-stone mt-1">
                  View missing and found reports localized to your branch area.
                </p>
              </Link>

              <Link
                to="/manager/staff"
                className="group flex flex-col p-6 rounded-[2rem] bg-bone border border-ink/10 hover:border-moss/40 hover:bg-bone/80 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="grid place-items-center w-12 h-12 rounded-xl bg-moss/10 text-moss group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </span>
                  <ExternalLink className="w-4 h-4 text-stone opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display font-black text-lg tracking-tight">
                  Manage Staff
                </h3>
                <p className="text-sm text-stone mt-1">
                  View your rescue operators and branch staff.
                </p>
              </Link>

              <div className="flex flex-col p-6 rounded-[2rem] bg-bone border border-ink/10 opacity-60">
                <div className="flex items-center justify-between mb-4">
                  <span className="grid place-items-center w-12 h-12 rounded-xl bg-ink/5 text-stone">
                    <MapPin className="w-6 h-6" />
                  </span>
                </div>
                <h3 className="font-display font-black text-lg tracking-tight">
                  Branch Location
                </h3>
                <p className="text-sm text-stone mt-1">
                  {LOCATIONS[profile.location_id] || "Unknown Area"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
