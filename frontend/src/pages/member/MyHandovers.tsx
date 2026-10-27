import { useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  ArrowRightLeft,
  MapPin,
  Calendar,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  ImageOff,
  Search,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useIncidents } from "../../hooks/useIncidents";
import type { IMyHandover } from "../../hooks/useIncidents";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

export default function MyHandovers() {
  const { myHandoversQuery } = useIncidents();
  const { data: handovers, isLoading } = myHandoversQuery;

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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-bone text-[11px] font-bold uppercase tracking-widest mb-6">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            My Handovers
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Handover History
          </h1>
          <p className="mt-3 text-lg text-stone max-w-xl">
            Track the pets you've found and handed over to local rescue
            organizations.
          </p>
        </motion.div>

        {/* LIST */}
        <div className="mt-10 space-y-4">
          <AnimatePresence>
            {!handovers || handovers.length === 0 ? (
              <motion.div
                variants={fadeUp}
                custom={1}
                initial="hidden"
                animate="show"
                className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-20 text-center"
              >
                <div className="text-6xl mb-5 animate-bob">🤝</div>
                <h2 className="font-display font-black text-2xl tracking-tight">
                  No handovers yet
                </h2>
                <p className="text-stone mt-2 max-w-sm mx-auto">
                  When you request to hand over a found pet to an SPCA, it will
                  appear here so you can track its progress.
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
              handovers.map((handover, i) => (
                <HandoverCard
                  key={handover.hoid}
                  handover={handover}
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
   HANDOVER CARD
   ========================================= */

function HandoverCard({
  handover,
  index,
}: {
  handover: IMyHandover;
  index: number;
}) {
  // Extract data safely
  const image = handover.pet?.pet_image || handover.report_image;
  const petName = handover.pet?.pet_name || "Unknown Pet";
  const species = handover.pet?.species_name || "Pet";
  const spcaName = handover.spca?.name || "Unknown Organization";

  // Determine if it's completed based on the badge title
  const isCompleted = handover.badge_title === "Handed Over";

  return (
    <motion.div
      variants={fadeUp}
      custom={1 + index * 0.05}
      initial="hidden"
      animate="show"
      className="group flex flex-col md:flex-row items-stretch gap-0 rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* IMAGE SIDE */}
      <div className="md:w-64 shrink-0 bg-ink/5 relative overflow-hidden aspect-[4/3] md:aspect-auto">
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
            isCompleted ? "bg-moss text-bone" : "bg-amber/90 text-ink"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-3 h-3" /> {handover.badge_title}
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" /> {handover.badge_title}
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
              {handover.pet?.colour_name ? `· ${handover.pet.colour_name}` : ""}
            </div>
          </div>

          <div className="text-right text-xs text-stone">
            <div className="font-bold uppercase tracking-widest mb-1">
              Handover ID
            </div>
            <div className="font-mono">#{handover.hoid}</div>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* SPCA Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <Building2 className="w-4 h-4 shrink-0 text-moss" />
              <span className="truncate">{spcaName}</span>
            </div>
            {handover.spca?.email && (
              <div className="flex items-center gap-2 text-xs text-stone">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{handover.spca.email}</span>
              </div>
            )}
            {handover.spca?.phone && (
              <div className="flex items-center gap-2 text-xs text-stone">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{handover.spca.phone}</span>
              </div>
            )}
          </div>

          {/* Dates Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-stone">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                Requested:{" "}
                {new Date(handover.requested_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                Scheduled: {new Date(handover.chosen_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{handover.found_street}</span>
            </div>
          </div>
        </div>

        {/* RESPONSE NOTE */}
        {handover.response_note && handover.response_note !== "N/A" && (
          <div className="mt-auto pt-4 border-t border-ink/5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-1">
              Note from SPCA
            </div>
            <p className="text-sm text-ink/80 italic">
              "{handover.response_note}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
