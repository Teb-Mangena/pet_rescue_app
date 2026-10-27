import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Dog,
  ShieldCheck,
  Plus,
  Search,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useProfile, type Pet } from "../../hooks/useProfiles";
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

function PO_Profile() {
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

  const imageUrl = profile.image_url;
  const fullName = `${profile.first_name} ${profile.last_name}`;
  const initials =
    `${profile.first_name?.charAt(0) || ""}${profile.last_name?.charAt(0) || ""}`.toUpperCase();
  const pets = profile.pets || [];

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-amber/15 rotate-25" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-15" />
      </div>

      <div className="relative max-w-300 mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-burnt/10 text-burnt text-[11px] font-bold uppercase tracking-widest">
              <Dog className="w-3.5 h-3.5" />
              Pet Owner
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

        {/* TOP GRID (Identity & Contact) */}
        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          {/* LEFT: Avatar & Identity */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="lg:col-span-5"
          >
            <div className="bg-ink text-bone rounded-4xl p-8 text-center relative overflow-hidden shadow-xl shadow-ink/10 h-full flex flex-col justify-center">
              <div className="relative inline-block mb-4 mx-auto">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-bone/10">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-burnt text-bone text-3xl font-black">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-burnt text-bone grid place-items-center border-2 border-ink">
                  <Heart className="w-4 h-4" />
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

          {/* RIGHT: Contact Details */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="lg:col-span-7"
          >
            <div className="bg-bone border border-ink/10 rounded-4xl p-8 h-full">
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
          </motion.div>
        </div>

        {/* BOTTOM SECTION: MY PETS */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display font-black text-2xl tracking-tight">
                My Pets
              </h2>
              <p className="text-sm text-stone mt-1">
                The furry friends you've registered on Pet Rescue.
              </p>
            </div>
            <Link
              to="/pets/add"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-burnt text-bone text-sm font-medium hover:bg-burnt-deep transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add a Pet
            </Link>
          </div>

          {pets.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-ink/15 bg-bone/60 py-16 text-center">
              <div className="text-5xl mb-4 animate-bob">🐾</div>
              <h3 className="font-display font-black text-xl tracking-tight">
                No pets registered yet
              </h3>
              <p className="text-sm text-stone mt-2 max-w-sm mx-auto">
                Add your first pet so you can easily report them if they ever go
                missing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet, i) => (
                <PetCard key={pet.pet_id} pet={pet} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Pet Card Component ---------- */
function PetCard({ pet, index }: { pet: Pet; index: number }) {
  const isMissing = pet.pet_status.toLowerCase().includes("missing");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease }}
      className="group rounded-4xl border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-all"
    >
      <Link to={`/pets/${pet.pet_id}`} className="block">
        {/* Image */}
        <div className="aspect-4/3 bg-ink/5 relative overflow-hidden">
          {pet.image_url ? (
            <img
              src={pet.image_url}
              alt={pet.pet_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-stone">
              <PawPrint className="w-12 h-12" />
            </div>
          )}

          <span
            className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${
              isMissing ? "bg-burnt/90 text-bone" : "bg-moss/90 text-bone"
            }`}
          >
            {isMissing ? (
              <>
                <AlertTriangle className="w-3 h-3" />
                Missing
              </>
            ) : (
              <>
                <Search className="w-3 h-3" />
                At Home
              </>
            )}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="font-display font-black text-xl tracking-tight leading-tight truncate">
            {pet.pet_name}
          </div>
          <div className="text-sm text-stone mt-1">{pet.species_name}</div>
        </div>
      </Link>
    </motion.div>
  );
}

export default PO_Profile;
