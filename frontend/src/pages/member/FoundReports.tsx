import { useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  MapPin,
  Calendar,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  ImageOff,
  Search,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useIncidents } from "../../hooks/useIncidents";
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

export default function FoundReports() {
  const { user } = useAuthStore();
  const { foundPetsQuery } = useIncidents();
  const { data: allFoundPets, isLoading } = foundPetsQuery;

  // Filter to only show pets reported by the logged-in user
  const myReports = useMemo(() => {
    if (!allFoundPets || !user) return [];
    return allFoundPets.filter(
      (pet) => pet.report_info.finder_id === user.person_id,
    );
  }, [allFoundPets, user]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-moss/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-amber/10 rotate-[-20deg]" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/15 text-moss text-[11px] font-bold uppercase tracking-widest mb-6">
            <Search className="w-3.5 h-3.5" />
            My Reports
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Found Reports
          </h1>
          <p className="mt-3 text-lg text-stone max-w-xl">
            Manage the pets you've found. Request a handover to the SPCA so they
            can be reunited with their owner.
          </p>
        </motion.div>

        {/* REPORTS LIST */}
        <div className="mt-10 space-y-4">
          <AnimatePresence>
            {myReports.length === 0 ? (
              <motion.div
                variants={fadeUp}
                custom={1}
                initial="hidden"
                animate="show"
                className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-20 text-center"
              >
                <div className="text-6xl mb-5 animate-bob">🐾</div>
                <h2 className="font-display font-black text-2xl tracking-tight">
                  No reports yet
                </h2>
                <p className="text-stone mt-2 max-w-sm mx-auto">
                  You haven't reported any found pets. Check the public feed to
                  see if you can help someone.
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
              myReports.map((report, i) => (
                <ReportCard
                  key={report.report_info.fpr_id}
                  report={report}
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
   REPORT CARD
   ========================================= */

function ReportCard({ report, index }: { report: IFoundPet; index: number }) {
  // Extract data safely
  const image = report.pet_info?.image || report.report_info.report_image;
  const petName = report.pet_info?.name || "Unknown Pet";
  const species = report.pet_info?.species || "Unknown Species";
  const location = report.report_info.found_street;
  const dateFound = report.report_info.date_found;

  const isHandoverActive = report.tracking_status.handover_active;
  const isCompleted = report.tracking_status.completed_on;
  const spcaName = report.spca_details?.name || "the SPCA";

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

        {/* Status Badge Overlay */}
        <span
          className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${
            isCompleted
              ? "bg-moss text-bone"
              : isHandoverActive
                ? "bg-amber/90 text-ink"
                : "bg-ink/80 text-bone"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-3 h-3" /> Handed Over
            </>
          ) : isHandoverActive ? (
            <>
              <Building2 className="w-3 h-3" /> At SPCA
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" /> With Me
            </>
          )}
        </span>
      </div>

      {/* CONTENT SIDE */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display font-black text-2xl tracking-tight truncate">
              {petName}
            </h2>
            <div className="text-sm text-stone mt-1">
              {species}{" "}
              {report.pet_info?.colour ? `· ${report.pet_info.colour}` : ""}
            </div>
          </div>

          <div className="text-right text-xs text-stone">
            <div className="font-bold uppercase tracking-widest mb-1">
              Report ID
            </div>
            <div className="font-mono">#{report.report_info.fpr_id}</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-stone">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Found on {new Date(dateFound).toLocaleDateString()}</span>
          </div>
        </div>

        {/* ACTION FOOTER */}
        <div className="pt-4 border-t border-ink/5 flex items-center justify-between gap-4 mt-auto">
          <div className="text-xs text-stone italic line-clamp-1 max-w-[50%]">
            "{report.report_info.description || "No additional details."}"
          </div>

          {!isHandoverActive && !isCompleted && (
            <Link
              to={`/handovers/request/${report.report_info.fpr_id}`}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-ink text-bone text-sm font-medium hover:bg-ink/80 transition-colors shrink-0"
            >
              Request Handover
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          {isHandoverActive && !isCompleted && (
            <button
              disabled
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-amber/10 text-amber text-sm font-medium cursor-not-allowed shrink-0"
            >
              Awaiting SPCA Intake
            </button>
          )}

          {/* Updated Final State */}
          {isCompleted && (
            <div className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-moss/10 text-moss text-sm font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              Handed over to {spcaName}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
