import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Dog,
  Search,
  Heart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  ImageOff,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { usePets } from "../../hooks/usePets";
import { useIncidents } from "../../hooks/useIncidents";
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

export default function PO_Dashboard() {
  const { user } = useAuthStore();
  const { myPetsQuery } = usePets(String(user?.person_id));
  const { foundPetsQuery, claimMyPetMutation } = useIncidents();

  const isLoading = myPetsQuery.isLoading || foundPetsQuery.isLoading;
  const myPets = myPetsQuery.data || [];
  const allFoundPets = foundPetsQuery.data || [];

  // Workflow Step 11: Identify if the owner's pet has been found
  const matchedFoundPets = useMemo(() => {
    if (!myPets.length || !allFoundPets.length) return [];

    return allFoundPets.filter((foundPet) => {
      if (!foundPet.pet_info) return false;
      return myPets.some((myPet) => myPet.pet_id === foundPet.pet_info?.pet_id);
    });
  }, [myPets, allFoundPets]);

  if (isLoading) return <PageLoader />;

  // Separate missing pets for a quick count
  const missingPetsCount = myPets.filter((p) =>
    p.pet_status.toLowerCase().includes("missing"),
  ).length;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        {/* ============ HEADER ============ */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-widest mb-6">
            <Dog className="w-3.5 h-3.5" />
            Pet Owner
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Hey {user?.first_name || "there"},
            <br />
            <span className="text-burnt">let's keep them safe.</span>
          </h1>
          <p className="mt-4 text-lg text-stone max-w-xl">
            Manage your pets, report them missing, and keep an eye out for
            community sightings.
          </p>
        </motion.div>

        {/* ============ URGENT ALERT: PET FOUND ============ */}
        {matchedFoundPets.length > 0 && (
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-10 rounded-[2rem] bg-moss text-bone p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-moss/20"
          >
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <PawPrint className="w-48 h-48" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-bone/20 grid place-items-center shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-bone" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl tracking-tight">
                    Great news! We found your pet.
                  </h2>
                  <p className="text-bone/80 mt-1">
                    Someone from the community has reported seeing{" "}
                    <strong className="text-bone">
                      {matchedFoundPets[0].pet_info?.name}
                    </strong>
                    .
                  </p>
                </div>
              </div>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-bone text-moss font-bold hover:bg-bone/90 transition-colors shrink-0 w-full md:w-auto"
              >
                Claim Your Pet
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* ============ STATS GRID ============ */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="p-6 rounded-[2rem] bg-bone border border-ink/10 flex items-center gap-4">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-amber/10 text-amber shrink-0">
              <Dog className="w-6 h-6" />
            </span>
            <div>
              <div className="font-display font-black text-3xl tracking-tight">
                {myPets.length}
              </div>
              <div className="text-sm text-stone font-medium">
                Registered Pets
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-bone border border-ink/10 flex items-center gap-4">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-burnt/10 text-burnt shrink-0">
              <Search className="w-6 h-6" />
            </span>
            <div>
              <div className="font-display font-black text-3xl tracking-tight">
                {missingPetsCount}
              </div>
              <div className="text-sm text-stone font-medium">
                Currently Missing
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-bone border border-ink/10 flex items-center gap-4">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-moss/10 text-moss shrink-0">
              <Heart className="w-6 h-6" />
            </span>
            <div>
              <div className="font-display font-black text-3xl tracking-tight">
                {allFoundPets.length}
              </div>
              <div className="text-sm text-stone font-medium">Found Nearby</div>
            </div>
          </div>
        </motion.div>

        {/* ============ QUICK ACTIONS ============ */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Link
            to="/pets/add"
            className="group flex items-center justify-between p-6 rounded-[2rem] bg-burnt text-bone hover:bg-burnt-deep transition-all shadow-md shadow-burnt/20"
          >
            <div className="flex items-center gap-4">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-bone/20 group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-display font-black text-xl tracking-tight">
                  Register a Pet
                </h3>
                <p className="text-sm text-bone/80 mt-1">
                  Add a new furry friend to your profile.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/report-lost"
            className="group flex items-center justify-between p-6 rounded-[2rem] bg-bone border border-ink/10 hover:border-ink/30 hover:bg-ink/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-ink/5 text-ink group-hover:scale-105 transition-transform">
                <Megaphone className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-display font-black text-xl tracking-tight">
                  Report Missing
                </h3>
                <p className="text-sm text-stone mt-1">
                  Alert the community about a missing pet.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-stone group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>

        {/* ============ MY PETS PREVIEW ============ */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-12"
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display font-black text-2xl tracking-tight">
                My Pets
              </h2>
              <p className="text-sm text-stone mt-1">
                Quick overview of your registered pets.
              </p>
            </div>
            {myPets.length > 0 && (
              <Link
                to="/pets"
                className="inline-flex items-center gap-1 text-sm font-medium text-burnt hover:text-burnt-deep transition-colors"
              >
                Manage all
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {myPets.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-16 text-center">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {myPets.slice(0, 4).map((pet, i) => {
                // Determine status type for color and icon logic
                const statusLower = pet.pet_status.toLowerCase();
                const isMissing = statusLower.includes("missing");
                const isFound = statusLower.includes("found");

                return (
                  <div
                    key={pet.pet_id}
                    className="group rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="aspect-[4/3] bg-ink/5 relative overflow-hidden">
                      {pet.image_url ? (
                        <img
                          src={pet.image_url}
                          alt={pet.pet_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-stone">
                          <ImageOff className="w-8 h-8" />
                        </div>
                      )}

                      {/* Dynamic Status Badge (Uses exact backend text) */}
                      <span
                        className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest max-w-[90%] backdrop-blur-md ${
                          isMissing
                            ? "bg-burnt/90 text-bone"
                            : isFound
                              ? "bg-amber/90 text-ink"
                              : "bg-moss/90 text-bone"
                        }`}
                      >
                        {isMissing ? (
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                        ) : isFound ? (
                          <Search className="w-3 h-3 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                        )}
                        <span className="truncate">{pet.pet_status}</span>
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="font-display font-black text-lg tracking-tight truncate">
                        {pet.pet_name}
                      </div>
                      <div className="text-sm text-stone mt-0.5">
                        {pet.species_name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
