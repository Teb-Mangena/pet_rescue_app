import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Search,
  Heart,
  MapPin,
  Calendar,
  AlertTriangle,
  Gift,
  CheckCircle2,
  ImageOff,
  X,
  Check,
  Building2,
  Clock,
  ChevronDown,
} from "lucide-react";
import {
  useIncidents,
  type IReportFoundPetPayload,
  type IFoundPet,
  type IMissingPet,
} from "../../hooks/useIncidents";
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

type Tab = "missing" | "found";

const NEIGHBOURHOOD_OPTIONS = [
  { id: 2, name: "Summerstrand (Save-A-Pet)" },
  { id: 3, name: "Walmer (Save-A-Pet)" },
  { id: 4, name: "Lorraine (Save-A-Pet)" },
  { id: 5, name: "Humewood (Save-A-Pet)" },
  { id: 34, name: "Quigney (EL Pet Pals)" },
  { id: 35, name: "Southernwood (EL Pet Pals)" },
  { id: 36, name: "Belgravia (EL Pet Pals)" },
  { id: 39, name: "Beacon Bay (EL Pet Pals)" },
  { id: 49, name: "Bunkers Hill (Beachon Bay)" },
];

const WELLBEING_OPTIONS = [
  { id: 1, name: "Healthy and energetic" },
  { id: 2, name: "Calm and relaxed" },
  { id: 3, name: "Playful and active" },
  { id: 4, name: "Scared or anxious" },
  { id: 6, name: "Exhausted or weak" },
  { id: 8, name: "Injured with visible wounds" },
];

function Feeds() {
  const { user } = useAuthStore();
  const {
    missingPetsQuery,
    foundPetsQuery,
    reportFoundMutation,
    claimMyPetMutation,
  } = useIncidents();

  const [activeTab, setActiveTab] = useState<Tab>("missing");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mpiId, setMpiId] = useState<number | null>(null);
  const [foundDate, setFoundDate] = useState("");
  const [foundStreet, setFoundStreet] = useState("");

  const [orgNeighbourhoodId, setOrgNeighbourhoodId] = useState(
    NEIGHBOURHOOD_OPTIONS[0].id.toString(),
  );
  const [currentWellbeingId, setCurrentWellbeingId] = useState(
    WELLBEING_OPTIONS[0].id.toString(),
  );
  const [foundDescription, setFoundDescription] = useState("");

  const isLoading = missingPetsQuery.isLoading || foundPetsQuery.isLoading;
  const rawMissingPets = missingPetsQuery.data || [];
  const rawFoundPets = foundPetsQuery.data || [];
  const isMember = user?.role === "community_member";

  // Deduplicate found pets (newest first)
  const uniqueFoundPets = useMemo(() => {
    const seen = new Set();
    const sorted = [...rawFoundPets].sort(
      (a, b) => b.report_info.fpr_id - a.report_info.fpr_id,
    );

    return sorted.filter((pet) => {
      const key = pet.pet_info?.pet_id
        ? `pet-${pet.pet_info.pet_id}`
        : `report-${pet.report_info.fpr_id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rawFoundPets]);

  // Hide missing pets if there is an active found report matching by name
  const uniqueMissingPets = useMemo(() => {
    const activeFoundNames = new Set(
      uniqueFoundPets
        .filter((p) => !p.tracking_status.completed_on)
        .map((p) => p.pet_info?.name)
        .filter(Boolean),
    );
    return rawMissingPets.filter((pet) => !activeFoundNames.has(pet.pet_name));
  }, [rawMissingPets, uniqueFoundPets]);

  const resetForm = () => {
    setMpiId(null);
    setFoundDate("");
    setFoundStreet("");
    setOrgNeighbourhoodId(NEIGHBOURHOOD_OPTIONS[0].id.toString());
    setCurrentWellbeingId(WELLBEING_OPTIONS[0].id.toString());
    setFoundDescription("");
  };

  const openModalForPet = (id: number) => {
    resetForm();
    setMpiId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpiId) return;

    const foundPetData: IReportFoundPetPayload = {
      mpi_id: mpiId,
      found_date: foundDate,
      found_street: foundStreet,
      org_neighbourhood_id: Number(orgNeighbourhoodId),
      found_description: foundDescription,
      current_wellbeing_id: Number(currentWellbeingId),
    };

    reportFoundMutation.mutate(foundPetData, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const maxDate = new Date().toISOString().split("T")[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone font-medium">
          <span className="w-5 h-5 rounded-full border-2 border-ink/20 border-t-burnt animate-spin" />
          Loading community feed...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-bone text-[11px] font-bold uppercase tracking-widest mb-6">
            <PawPrint className="w-3.5 h-3.5" />
            Community Feed
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
            Reuniting pets,
            <br />
            <span className="text-burnt">one sighting at a time.</span>
          </h1>
          <p className="mt-5 text-lg text-stone max-w-lg mx-auto leading-relaxed">
            Browse local incidents or help a neighbor find their best friend.
          </p>
        </motion.div>

        {/* TABS */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center gap-3 mb-10"
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
              {uniqueMissingPets.length}
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
              {uniqueFoundPets.length}
            </span>
          </button>
        </motion.div>

        {/* FEED GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {activeTab === "missing" && (
              <motion.div
                key="missing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {uniqueMissingPets.length === 0 ? (
                  <EmptyState type="missing" />
                ) : (
                  uniqueMissingPets.map((m_pet, i) => (
                    <MissingCard
                      key={m_pet.mpi_id}
                      pet={m_pet}
                      index={i}
                      isMember={isMember}
                      onReportFound={() => openModalForPet(m_pet.mpi_id)}
                    />
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
                className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {uniqueFoundPets.length === 0 ? (
                  <EmptyState type="found" />
                ) : (
                  uniqueFoundPets.map((pet, i) => {
                    const isFinder =
                      user?.person_id === pet.report_info.finder_id;

                    return (
                      <FoundCard
                        key={pet.report_info.fpr_id}
                        pet={pet}
                        index={i}
                        isFinder={isFinder}
                        onClaim={(hoid) =>
                          claimMyPetMutation.mutate({
                            hoid,
                            data: {
                              chosen_date: new Date()
                                .toISOString()
                                .split("T")[0],
                              response_note:
                                "I am the owner, coming to pick up.",
                            },
                          })
                        }
                        isPending={claimMyPetMutation.isPending}
                      />
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* =========================================
          REPORT FOUND MODAL
          ========================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md rounded-[2rem] border border-ink/10 bg-bone shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-black text-2xl tracking-tight">
                  Report Found Pet
                </h3>
                <button
                  onClick={closeModal}
                  className="grid place-items-center w-8 h-8 rounded-full hover:bg-ink/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-2">
                    Found Date
                  </label>
                  <input
                    type="date"
                    required
                    max={maxDate}
                    value={foundDate}
                    onChange={(e) => setFoundDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-bone border border-ink/10 outline-none focus:border-moss focus:ring-2 focus:ring-moss/15 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-2">
                    Found Street
                  </label>
                  <input
                    type="text"
                    required
                    value={foundStreet}
                    onChange={(e) => setFoundStreet(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-bone border border-ink/10 outline-none focus:border-moss focus:ring-2 focus:ring-moss/15 transition-all"
                    placeholder="e.g. 123 Main St"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-2">
                    Neighbourhood
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={orgNeighbourhoodId}
                      onChange={(e) => setOrgNeighbourhoodId(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none focus:border-moss focus:ring-2 focus:ring-moss/15 transition-all appearance-none cursor-pointer"
                    >
                      {NEIGHBOURHOOD_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-2">
                    Current Wellbeing
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={currentWellbeingId}
                      onChange={(e) => setCurrentWellbeingId(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none focus:border-moss focus:ring-2 focus:ring-moss/15 transition-all appearance-none cursor-pointer"
                    >
                      {WELLBEING_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={foundDescription}
                    onChange={(e) => setFoundDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-bone border border-ink/10 outline-none focus:border-moss focus:ring-2 focus:ring-moss/15 transition-all resize-none"
                    rows={3}
                    placeholder="Describe the condition and location of the pet..."
                  />
                </div>

                <div className="pt-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={reportFoundMutation.isPending}
                    className="h-10 px-4 rounded-full border border-ink/15 hover:bg-ink/5 text-sm font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportFoundMutation.isPending}
                    className="h-10 px-6 rounded-full bg-moss text-bone text-sm font-medium hover:bg-moss/90 disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {reportFoundMutation.isPending ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Report
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================
   CARD COMPONENTS
   ========================================= */

function MissingCard({
  pet,
  index,
  isMember,
  onReportFound,
}: {
  pet: IMissingPet;
  index: number;
  isMember: boolean;
  onReportFound: () => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={2 + index * 0.05}
      initial="hidden"
      animate="show"
      className="group flex flex-col h-full rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-all"
    >
      <div className="aspect-[4/3] bg-ink/5 relative overflow-hidden shrink-0">
        {pet.pet_image ? (
          <img
            src={pet.pet_image}
            alt={pet.pet_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-stone">
            <ImageOff className="w-8 h-8" />
          </div>
        )}

        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-burnt text-bone shadow-md">
          <Search className="w-3 h-3" />
          Missing
        </span>

        {pet.urgency_name && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-ink/80 text-bone backdrop-blur-md">
            <AlertTriangle className="w-3 h-3 text-amber" />
            {pet.urgency_name}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="font-display font-black text-xl tracking-tight leading-tight truncate">
          {pet.pet_name}
        </div>
        <div className="text-sm text-stone mt-1">
          {pet.species_name} · {pet.colour_name}
        </div>

        <div className="mt-4 space-y-2">
          {pet.predicted_street && (
            <div className="flex items-start gap-2 text-xs text-stone">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{pet.predicted_street}</span>
            </div>
          )}
          {pet.last_seen_date && (
            <div className="flex items-start gap-2 text-xs text-stone">
              <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Last seen: {new Date(pet.last_seen_date).toLocaleDateString()}
              </span>
            </div>
          )}
          {pet.reward_offered && pet.reward_offered !== "None" && (
            <div className="flex items-start gap-2 text-xs font-semibold text-burnt">
              <Gift className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Reward: {pet.reward_offered}</span>
            </div>
          )}
        </div>

        {pet.incident_description && (
          <p className="mt-4 text-xs text-ink/70 line-clamp-2 italic">
            "{pet.incident_description}"
          </p>
        )}

        {isMember && (
          <div className="mt-auto pt-4 border-t border-ink/5">
            <button
              onClick={onReportFound}
              className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-moss text-bone text-sm font-medium hover:bg-moss/90 transition-colors"
            >
              <Search className="w-4 h-4" />
              Report as Found
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FoundCard({
  pet,
  index,
  isFinder,
  onClaim,
  isPending,
}: {
  pet: IFoundPet;
  index: number;
  isFinder: boolean;
  onClaim: (id: number) => void;
  isPending: boolean;
}) {
  const image = pet.pet_info?.image || pet.report_info?.report_image;
  const petName = pet.pet_info?.name || "Found Pet";
  const location = pet.report_info?.found_street;
  const dateFound = pet.report_info?.date_found;
  const finderName = isFinder ? "You" : pet.report_info?.finder_name;
  const description = pet.report_info?.description;

  const isHandoverActive = pet.tracking_status?.handover_active;
  const completedOn = pet.tracking_status?.completed_on;
  const isCompleted = completedOn && completedOn !== "N/A"; // Handles "N/A" string
  const spcaName = pet.spca_details?.name;

  // Extract the status text from the backend, fallback to a logical default
  const badgeText =
    pet.tracking_status?.handover_badge ||
    (isCompleted ? "Reunited" : "Pending");

  return (
    <motion.div
      variants={fadeUp}
      custom={2 + index * 0.05}
      initial="hidden"
      animate="show"
      className="group flex flex-col h-full rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-all"
    >
      <div className="aspect-[4/3] bg-ink/5 relative overflow-hidden shrink-0">
        {image ? (
          <img
            src={image}
            alt={petName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-stone">
            <ImageOff className="w-8 h-8" />
          </div>
        )}

        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-moss text-bone shadow-md">
          <Heart className="w-3 h-3" />
          Found
        </span>

        {/* Top right status badge */}
        {!isCompleted && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-ink/80 text-bone backdrop-blur-md">
            <Clock className="w-3 h-3 text-amber" />
            {badgeText}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="font-display font-black text-xl tracking-tight leading-tight truncate">
          {petName}
        </div>
        {pet.pet_info && (
          <div className="text-sm text-stone mt-1">
            {pet.pet_info.species} · {pet.pet_info.colour}
          </div>
        )}

        <div className="mt-4 space-y-2">
          {location && (
            <div className="flex items-start gap-2 text-xs text-stone">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
          {dateFound && (
            <div className="flex items-start gap-2 text-xs text-stone">
              <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Found: {new Date(dateFound).toLocaleDateString()}</span>
            </div>
          )}
          {finderName && (
            <div className="flex items-start gap-2 text-xs text-stone">
              <PawPrint className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Found By: {finderName}</span>
            </div>
          )}
          {spcaName && (
            <div className="flex items-start gap-2 text-xs font-medium text-moss">
              <Building2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{spcaName}</span>
            </div>
          )}
        </div>

        {description && (
          <p className="mt-4 text-xs text-ink/70 line-clamp-2 italic">
            "{description}"
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-ink/5">
          {/* 1. Finder needs to request handover */}
          {isFinder && !isHandoverActive && !isCompleted && (
            <Link
              to={`/handovers/request/${pet.report_info.fpr_id}`}
              className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-ink text-bone text-sm font-medium hover:bg-ink/80 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Request Handover
            </Link>
          )}

          {/* 2. Handover requested but not yet dropped off (Awaiting SPCA Drop-off) */}
          {isHandoverActive &&
            !isCompleted &&
            badgeText === "Awaiting SPCA Drop-off" && (
              <div className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-amber/10 text-amber text-sm font-medium">
                <Clock className="w-4 h-4" />
                {badgeText}
              </div>
            )}

          {/* 3. Handover initiated (at SPCA), owner can claim */}
          {isHandoverActive &&
            !isCompleted &&
            badgeText !== "Awaiting SPCA Drop-off" && (
              <button
                onClick={() => onClaim(pet.report_info.fpr_id)}
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-burnt text-bone text-sm font-medium hover:bg-burnt-deep transition-colors disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isPending ? "Claiming..." : "Claim This Pet"}
              </button>
            )}

          {/* 4. Completed (Reunited / Handed Over) */}
          {isCompleted && (
            <div className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-moss/10 text-moss text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              {badgeText}
            </div>
          )}

          {/* 5. Just a normal user looking at a non-active pet */}
          {!isFinder && !isHandoverActive && !isCompleted && (
            <div className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-ink/5 text-stone text-sm font-medium">
              Awaiting Handover
            </div>
          )}
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
        {type === "missing"
          ? "There are no missing pet reports in your area right now."
          : "There are no found pet reports in your area right now."}
      </p>
    </div>
  );
}

export default Feeds;
