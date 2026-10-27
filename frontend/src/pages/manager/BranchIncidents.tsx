import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Search,
  Heart,
  MapPin,
  Calendar,
  User,
  Phone,
  ImageOff,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import PageLoader from "../../components/PageLoader";
import { useManager } from "../../hooks/useManager";
import type {
  IManagerMissingPet,
  IManagerFoundPet,
} from "../../hooks/useManager";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

type Tab = "missing" | "found";

export default function BranchIncidents() {
  const { managerMissingQuery, managerFoundQuery } = useManager();
  const [activeTab, setActiveTab] = useState<Tab>("missing");

  const isLoading =
    managerMissingQuery.isLoading || managerFoundQuery.isLoading;
  const missingPets = managerMissingQuery.data || [];
  const foundPets = managerFoundQuery.data || [];

  if (isLoading) return <PageLoader />;

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
          className="flex flex-wrap items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-bone text-[11px] font-bold uppercase tracking-widest mb-6">
              <ClipboardList className="w-3.5 h-3.5" />
              Branch Incidents
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
              Incident Reports
            </h1>
            <p className="mt-3 text-lg text-stone max-w-xl">
              A localized view of all missing and found pets reported within
              your branch's operational area.
            </p>
          </div>
        </motion.div>

        {/* TABS */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="flex items-center gap-3 mb-8 border-b border-ink/10 pb-4"
        >
          <button
            onClick={() => setActiveTab("missing")}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "missing"
                ? "bg-burnt text-bone shadow-md shadow-burnt/20"
                : "bg-bone border border-ink/10 text-stone hover:border-ink/30"
            }`}
          >
            <Search className="w-4 h-4" />
            Missing Pets
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === "missing" ? "bg-bone/20" : "bg-ink/5"
              }`}
            >
              {missingPets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("found")}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "found"
                ? "bg-moss text-bone shadow-md shadow-moss/20"
                : "bg-bone border border-ink/10 text-stone hover:border-ink/30"
            }`}
          >
            <Heart className="w-4 h-4" />
            Found Pets
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === "found" ? "bg-bone/20" : "bg-ink/5"
              }`}
            >
              {foundPets.length}
            </span>
          </button>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {activeTab === "missing" && (
              <motion.div
                key="missing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {missingPets.length === 0 ? (
                  <EmptyState type="missing" />
                ) : (
                  missingPets.map((pet, i) => (
                    <MissingCard key={pet.mpi_id} pet={pet} index={i} />
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "found" && (
              <motion.div
                key="found"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {foundPets.length === 0 ? (
                  <EmptyState type="found" />
                ) : (
                  foundPets.map((pet, i) => (
                    <FoundCard key={pet.fpr_id} pet={pet} index={i} />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   CARD COMPONENTS
   ========================================= */

function MissingCard({
  pet,
  index,
}: {
  pet: IManagerMissingPet;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={2 + index * 0.05}
      initial="hidden"
      animate="show"
      className="group flex flex-col h-full rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-all"
    >
      {/* Header */}
      <div className="p-5 border-b border-ink/5 relative">
        <span className="absolute top-5 right-5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-burnt/10 text-burnt">
          <AlertTriangle className="w-3 h-3" />
          Missing
        </span>
        <div className="font-display font-black text-xl tracking-tight truncate pr-20">
          {pet.pet_name}
        </div>
        <div className="text-sm text-stone mt-1">
          {pet.species_name} · {pet.colour_name}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs text-stone">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{pet.predicted_street}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-stone">
            <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              Last seen: {new Date(pet.last_seen_date).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-ink/5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-2">
            Owner Contact
          </div>
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <User className="w-4 h-4 text-stone" />
            {pet.owner_name}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone">
            <Phone className="w-3.5 h-3.5" />
            {pet.owner_phone}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FoundCard({ pet, index }: { pet: IManagerFoundPet; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={2 + index * 0.05}
      initial="hidden"
      animate="show"
      className="group flex flex-col h-full rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-all"
    >
      {/* Image */}
      <div className="aspect-[16/9] bg-ink/5 relative overflow-hidden shrink-0">
        {pet.image_url ? (
          <img
            src={pet.image_url}
            alt="Found Pet"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-stone">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-moss text-bone shadow-md">
          <Heart className="w-3 h-3" />
          Found Report
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="font-display font-black text-lg tracking-tight leading-tight mb-3">
          Report #{pet.fpr_id}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-xs text-stone">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{pet.found_street}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-stone">
            <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Found: {new Date(pet.date_found).toLocaleDateString()}</span>
          </div>
        </div>

        {pet.report_description && (
          <p className="text-xs text-ink/70 line-clamp-2 italic mb-4">
            "{pet.report_description}"
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-ink/5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-2">
            Finder Contact
          </div>
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <User className="w-4 h-4 text-stone" />
            {pet.finder_name}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone">
            <Phone className="w-3.5 h-3.5" />
            {pet.finder_phone}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ type }: { type: "missing" | "found" }) {
  return (
    <div className="col-span-full py-20 text-center rounded-[2rem] border border-dashed border-ink/15 bg-bone/60">
      <div className="text-6xl mb-5 animate-bob">
        {type === "missing" ? "🐾" : "🌟"}
      </div>
      <h2 className="font-display font-black text-2xl tracking-tight">
        {type === "missing" ? "No missing pets" : "No found pets"}
      </h2>
      <p className="text-stone mt-2 max-w-sm mx-auto">
        There are no {type} pet reports in your branch area right now.
      </p>
    </div>
  );
}
