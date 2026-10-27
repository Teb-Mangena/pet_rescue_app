import { useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ImageOff,
  Search,
  FileCheck,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useIncidents } from "../../hooks/useIncidents";
import { usePets } from "../../hooks/usePets";
import { useAuthStore } from "../../store/useAuthStore";
import type { IFoundPet } from "../../hooks/useIncidents";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

export default function MyClaims() {
  const { user } = useAuthStore();
  const { myPetsQuery } = usePets(String(user?.person_id));
  const { foundPetsQuery } = useIncidents();

  const isLoading = myPetsQuery.isLoading || foundPetsQuery.isLoading;
  const myPets = myPetsQuery.data || [];
  const allFoundPets = foundPetsQuery.data || [];

  // Find found reports that match the owner's pets
  const myClaims = useMemo(() => {
    if (!myPets.length || !allFoundPets.length) return [];

    const myPetIds = new Set(myPets.map((p) => p.pet_id));

    return allFoundPets.filter((report) => {
      if (!report.pet_info) return false;
      return myPetIds.has(report.pet_info.pet_id);
    });
  }, [myPets, allFoundPets]);

  if (isLoading) return <PageLoader />;

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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-widest mb-6">
            <FileCheck className="w-3.5 h-3.5" />
            My Claims
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Claimed Pets
          </h1>
          <p className="mt-3 text-lg text-stone max-w-xl">
            Track the status of your missing pets that have been found by the
            community.
          </p>
        </motion.div>

        {/* CLAIMS LIST */}
        <div className="mt-10 space-y-4">
          <AnimatePresence>
            {myClaims.length === 0 ? (
              <motion.div
                variants={fadeUp}
                custom={1}
                initial="hidden"
                animate="show"
                className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-20 text-center"
              >
                <div className="text-6xl mb-5 animate-bob">🐾</div>
                <h2 className="font-display font-black text-2xl tracking-tight">
                  No active claims
                </h2>
                <p className="text-stone mt-2 max-w-sm mx-auto">
                  None of your pets have been reported found yet. We'll notify
                  you here if someone spots them.
                </p>
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-full bg-ink text-bone font-medium hover:bg-burnt transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Browse the Feed
                </Link>
              </motion.div>
            ) : (
              myClaims.map((claim, i) => (
                <ClaimCard
                  key={claim.report_info.fpr_id}
                  claim={claim}
                  index={i}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   CLAIM CARD
   ========================================= */

function ClaimCard({ claim, index }: { claim: IFoundPet; index: number }) {
  const image = claim.pet_info?.image || claim.report_info.report_image;
  const petName = claim.pet_info?.name || "Unknown Pet";
  const spcaName = claim.spca_details?.name || "the SPCA";

  const isHandoverActive = claim.tracking_status.handover_active;
  const isCompleted = claim.tracking_status.completed_on;

  // Determine the stage of the claim
  let statusBadge;
  if (isCompleted) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-moss text-bone">
        <CheckCircle2 className="w-3 h-3" /> Reunited
      </span>
    );
  } else if (isHandoverActive) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber text-ink">
        <Clock className="w-3 h-3" /> Ready for Pickup
      </span>
    );
  } else {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-ink/10 text-stone">
        <Clock className="w-3 h-3" /> Awaiting SPCA Handover
      </span>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      custom={1 + index * 0.05}
      initial="hidden"
      animate="show"
      className="group flex flex-col sm:flex-row items-stretch gap-0 rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* IMAGE SIDE */}
      <div className="sm:w-64 shrink-0 bg-ink/5 relative overflow-hidden aspect-[4/3] sm:aspect-auto">
        {image ? (
          <img
            src={image}
            alt={petName}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-stone">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* CONTENT SIDE */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display font-black text-2xl tracking-tight truncate">
              {petName}
            </h2>
            <div className="text-sm text-stone mt-1">
              {claim.pet_info?.species}{" "}
              {claim.pet_info?.colour ? `· ${claim.pet_info.colour}` : ""}
            </div>
          </div>
          {statusBadge}
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-stone">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{claim.report_info.found_street}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              Found on{" "}
              {new Date(claim.report_info.date_found).toLocaleDateString()}
            </span>
          </div>
          {claim.spca_details && (
            <div className="flex items-center gap-2 text-sm font-medium text-moss sm:col-span-2">
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Currently at {spcaName}</span>
            </div>
          )}
        </div>

        {/* ACTION FOOTER / NEXT STEPS */}
        <div className="pt-4 border-t border-ink/5 flex items-center justify-between gap-4 mt-auto">
          <div className="text-xs text-stone italic line-clamp-1 max-w-[60%]">
            "{claim.report_info.description || "No additional details."}"
          </div>

          {isCompleted && (
            <div className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-moss/10 text-moss text-sm font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              Welcome home!
            </div>
          )}

          {isHandoverActive && !isCompleted && (
            <div className="text-right shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone">
                Next Step
              </div>
              <div className="text-sm font-medium text-ink">
                Visit {spcaName} with ID
              </div>
            </div>
          )}

          {!isHandoverActive && !isCompleted && (
            <div className="text-right shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone">
                Status
              </div>
              <div className="text-sm font-medium text-ink">
                Waiting for finder drop-off
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
