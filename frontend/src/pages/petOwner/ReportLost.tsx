import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Check,
  AlertCircle,
  Megaphone,
  ChevronDown,
  Dog,
} from "lucide-react";
import { useNavigate } from "react-router";
import BackLink from "../../components/BackLink";
import PageLoader from "../../components/PageLoader";
import { useIncidents } from "../../hooks/useIncidents";
import { usePets } from "../../hooks/usePets";
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

// FIXED: Using the exact `nsn_id` from your npo_spca_neighbourhood SQL seed data
const NEIGHBOURHOODS = [
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

const MISSING_REASONS = [
  { id: 1, name: "Escaped - Broke free from enclosure" },
  { id: 2, name: "Stolen - Taken unlawfully" },
  { id: 3, name: "Accidental Release - Let out unintentionally" },
  { id: 4, name: "Natural Disaster - Lost during floods/fires" },
  { id: 5, name: "Transport Incident - Lost during travel" },
  { id: 9, name: "Wandered Off - Strayed away from home" },
  { id: 10, name: "Lost During Walk - Slipped leash" },
  { id: 7, name: "Unknown - Cause cannot be determined" },
];

const URGENCY_LEVELS = [
  { id: 1, name: "Low - Appears safe, seen in familiar areas" },
  { id: 2, name: "Medium - Missing for several days" },
  { id: 3, name: "High - Vulnerable due to injury/age" },
  { id: 4, name: "Critical - Immediate danger" },
];

const WELLBEING = [
  { id: 1, name: "Healthy and energetic" },
  { id: 2, name: "Calm and relaxed" },
  { id: 3, name: "Playful and active" },
  { id: 4, name: "Scared or anxious" },
  { id: 6, name: "Exhausted or weak" },
  { id: 8, name: "Injured with visible wounds" },
];

function ReportLost() {
  const { user } = useAuthStore();
  const { myPetsQuery } = usePets(String(user?.person_id));
  const { reportMissingMutation } = useIncidents();

  const { data: myPets, isLoading } = myPetsQuery;
  const { mutate: reportMissing, isPending } = reportMissingMutation;

  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format for the max attribute
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];

  // Form State
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [missingReasonId, setMissingReasonId] = useState<number>(1);
  const [lastSeenDate, setLastSeenDate] = useState("");
  const [orgNeighbourhoodId, setOrgNeighbourhoodId] = useState<number>(2); // Default to 2 (Summerstrand)
  const [predictedStreet, setPredictedStreet] = useState("");
  const [urgencyLevelId, setUrgencyLevelId] = useState<number>(2);
  const [rewardOffered, setRewardOffered] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [recentWellbeingId, setRecentWellbeingId] = useState<number>(1);
  const [otherDesc, setOtherDesc] = useState("");

  const [error, setError] = useState<string | null>(null);

  // Filter pets: Only show those currently AT HOME
  const availablePets =
    myPets?.filter((pet) => pet.pet_status.toLowerCase().includes("home")) ||
    [];

  const selectedPet = availablePets.find(
    (p) => p.pet_id.toString() === selectedPetId,
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!selectedPetId) return setError("Please select which pet is missing.");
    if (!lastSeenDate) return setError("Please enter the date last seen.");
    if (lastSeenDate > maxDate) {
      return setError("The date last seen cannot be in the future.");
    }
    if (!predictedStreet.trim()) return setError("Please enter the street.");

    // Constructing the exact JSON payload from your example
    const payload = {
      pet_id: Number(selectedPetId),
      missing_reason_id: missingReasonId,
      last_seen_date: lastSeenDate,
      org_neighbourhood_id: orgNeighbourhoodId, // Now sends correct nsn_id
      predicted_street: predictedStreet.trim(),
      urgency_level_id: urgencyLevelId,
      reward_offered: rewardOffered.trim() || "None",
      incident_description: incidentDescription.trim(),
      recent_wellbeing_id: recentWellbeingId,
      other_desc: otherDesc.trim(),
    };

    reportMissing(payload, {
      onSuccess: () => navigate("/pets"),
    });
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-burnt/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-amber/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-burnt/10 rotate-[15deg]" />
      </div>

      <div className="relative max-w-[800px] mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <BackLink title="Back to my pets" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-burnt/10 text-burnt text-[11px] font-bold uppercase tracking-widest mb-4 mt-6">
            <Megaphone className="w-3.5 h-3.5" />
            Report Missing
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Report a lost pet
          </h1>
          <p className="mt-3 text-lg text-stone max-w-xl">
            Provide as much detail as possible so the community and local SPCAs
            can help bring them home.
          </p>
        </motion.div>

        {/* FORM */}
        <motion.form
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          onSubmit={handleSubmit}
          className="mt-10 bg-bone border border-ink/10 rounded-[2rem] p-6 sm:p-10 shadow-sm space-y-8"
        >
          {/* SELECT PET */}
          <div>
            <label
              htmlFor="petSelect"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
            >
              Which pet is missing?
            </label>
            <div className="relative">
              <select
                id="petSelect"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all disabled:opacity-50"
                disabled={availablePets.length === 0}
              >
                <option value="" disabled>
                  {availablePets.length === 0
                    ? "No pets currently at home to report"
                    : "Select a pet..."}
                </option>
                {availablePets.map((pet) => (
                  <option key={pet.pet_id} value={pet.pet_id}>
                    {pet.pet_name} ({pet.species_name} · {pet.colour_name})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
            </div>
          </div>

          {/* SELECTED PET PREVIEW (Visual confirmation) */}
          {selectedPet && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-4 p-3 rounded-2xl bg-amber/10 border border-amber/20"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber/20 shrink-0">
                {selectedPet.image_url ? (
                  <img
                    src={selectedPet.image_url}
                    alt={selectedPet.pet_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-amber">
                    <Dog className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-display font-black text-lg tracking-tight truncate">
                  {selectedPet.pet_name}
                </div>
                <div className="text-xs text-stone truncate">
                  {selectedPet.species_name} · {selectedPet.colour_name}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-amber mt-1 font-bold">
                  Currently at Home
                </div>
              </div>
            </motion.div>
          )}

          <div className="h-px w-full bg-ink/10 my-6" />

          {/* DATE & STREET */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="lastSeenDate"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Date Last Seen
              </label>
              <div className="relative">
                <input
                  id="lastSeenDate"
                  type="date"
                  max={maxDate}
                  value={lastSeenDate}
                  onChange={(e) => setLastSeenDate(e.target.value)}
                  className="w-full h-12 pl-4 pr-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="predictedStreet"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Street Last Seen
              </label>
              <div className="relative">
                <input
                  id="predictedStreet"
                  type="text"
                  value={predictedStreet}
                  onChange={(e) => setPredictedStreet(e.target.value)}
                  placeholder="e.g. 123 Main Street"
                  className="w-full h-12 pl-4 pr-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* NEIGHBOURHOOD & REASON */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="neighbourhood"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Neighbourhood (SPCA Branch)
              </label>
              <div className="relative">
                <select
                  id="neighbourhood"
                  value={orgNeighbourhoodId}
                  onChange={(e) =>
                    setOrgNeighbourhoodId(Number(e.target.value))
                  }
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                >
                  {NEIGHBOURHOODS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              </div>
            </div>

            <div>
              <label
                htmlFor="missingReason"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Reason for missing
              </label>
              <div className="relative">
                <select
                  id="missingReason"
                  value={missingReasonId}
                  onChange={(e) => setMissingReasonId(Number(e.target.value))}
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                >
                  {MISSING_REASONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              </div>
            </div>
          </div>

          {/* URGENCY & WELLBEING */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="urgency"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Urgency Level
              </label>
              <div className="relative">
                <select
                  id="urgency"
                  value={urgencyLevelId}
                  onChange={(e) => setUrgencyLevelId(Number(e.target.value))}
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                >
                  {URGENCY_LEVELS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              </div>
            </div>

            <div>
              <label
                htmlFor="wellbeing"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Recent Wellbeing
              </label>
              <div className="relative">
                <select
                  id="wellbeing"
                  value={recentWellbeingId}
                  onChange={(e) => setRecentWellbeingId(Number(e.target.value))}
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                >
                  {WELLBEING.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              </div>
            </div>
          </div>

          {/* REWARD */}
          <div>
            <label
              htmlFor="reward"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
            >
              Reward Offered (Optional)
            </label>
            <input
              id="reward"
              type="text"
              value={rewardOffered}
              onChange={(e) => setRewardOffered(e.target.value)}
              placeholder="e.g. R500"
              maxLength={100}
              className="w-full h-12 px-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
            />
          </div>

          {/* DESCRIPTIONS */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="incidentDescription"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Incident Description
              </label>
              <textarea
                id="incidentDescription"
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                placeholder="Describe how they went missing..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="otherDesc"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Other Details (Optional)
              </label>
              <textarea
                id="otherDesc"
                value={otherDesc}
                onChange={(e) => setOtherDesc(e.target.value)}
                placeholder="Any other identifying features, collar details, etc."
                rows={2}
                maxLength={100}
                className="w-full px-4 py-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all resize-none"
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-burnt-deep/10 text-burnt-deep text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* SUBMIT */}
          <div className="pt-4 border-t border-ink/10 flex justify-end">
            <button
              type="submit"
              disabled={isPending || availablePets.length === 0}
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Reporting…
                </>
              ) : (
                <>
                  Alert Community
                  <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default ReportLost;
