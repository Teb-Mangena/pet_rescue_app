import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Building2,
  Calendar,
  Check,
  AlertCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import BackLink from "../../components/BackLink";
import PageLoader from "../../components/PageLoader";
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

// Based on your SQL seed data for NPO/SPCAs
const ORGANIZATIONS = [
  { id: 1, name: "EL Pet Pals", location: "East London" },
  { id: 2, name: "Beachon Bay", location: "East London" },
  { id: 3, name: "Save-A-Pet Animal Shelter", location: "Gqeberha" },
];

function HandoverPetToOrg() {
  const { id } = useParams(); // This is the fpr_id
  const fprId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { foundPetsQuery, logFinderHandoverMutation } = useIncidents();
  const { data: foundPets, isLoading } = foundPetsQuery;
  const { mutate: logHandover, isPending } = logFinderHandoverMutation;

  const [orgId, setOrgId] = useState<number>(ORGANIZATIONS[0].id);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Find the specific report
  const report = foundPets?.find((p) => p.report_info.fpr_id === fprId);

  if (isLoading) return <PageLoader />;

  if (!report) {
    return (
      <div className="min-h-screen bg-bone grid place-items-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-5 animate-bob">🐾</div>
          <h1 className="font-display font-black text-2xl tracking-tight">
            Report not found
          </h1>
          <p className="text-stone mt-2 text-sm">
            This found report may have already been handed over or deleted.
          </p>
          <BackLink title="Back to Feed" className="mt-6 justify-center" />
        </div>
      </div>
    );
  }

  // Security check: Make sure only the finder can hand it over
  if (report.report_info.finder_id !== user?.person_id) {
    return (
      <div className="min-h-screen bg-bone grid place-items-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-5 animate-bob">🚫</div>
          <h1 className="font-display font-black text-2xl tracking-tight">
            Unauthorized
          </h1>
          <p className="text-stone mt-2 text-sm">
            You are not the person who found this pet.
          </p>
          <BackLink title="Back to Feed" className="mt-6 justify-center" />
        </div>
      </div>
    );
  }

  const image = report.pet_info?.image || report.report_info.report_image;
  const petName = report.pet_info?.name || "Unknown Pet";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!orgId) return setError("Please select an organization.");
    if (!date) return setError("Please select a date.");

    logHandover(
      {
        fpr_id: fprId,
        data: {
          chosen_date: date,
          response_note: note.trim() || "Dropping off at SPCA",
          npo_spca_id: orgId,
        },
      },
      {
        onSuccess: () => {
          navigate("/my-found-reports");
        },
      },
    );
  }

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-moss/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-amber/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      <div className="relative max-w-[700px] mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <BackLink title="Back to my reports" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-bone text-[11px] font-bold uppercase tracking-widest mb-4 mt-6">
            <Building2 className="w-3.5 h-3.5" />
            Request Handover
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Handover to NPO/SPCA
          </h1>
          <p className="mt-3 text-lg text-stone max-w-xl">
            You are about to hand this pet over to an SPCA branch. They will
            verify the details and contact the owner.
          </p>
        </motion.div>

        {/* PET SUMMARY */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-8 flex items-center gap-4 p-4 rounded-[2rem] bg-moss/5 border border-moss/10"
        >
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-moss/10 shrink-0">
            {image ? (
              <img
                src={image}
                alt={petName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-moss">
                <PawPrint className="w-8 h-8" />
              </div>
            )}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-moss mb-1">
              Handing Over
            </div>
            <div className="font-display font-black text-2xl truncate">
              {petName}
            </div>
            <div className="text-sm text-stone mt-1">
              Report #{report.report_info.fpr_id} · Found on{" "}
              {new Date(report.report_info.date_found).toLocaleDateString()}
            </div>
          </div>
        </motion.div>

        {/* FORM */}
        <motion.form
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          onSubmit={handleSubmit}
          className="mt-6 bg-bone border border-ink/10 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6"
        >
          {/* ORGANIZATION */}
          <div>
            <label
              htmlFor="org"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-2"
            >
              Which organization?
            </label>
            <select
              id="org"
              value={orgId}
              onChange={(e) => setOrgId(Number(e.target.value))}
              className="w-full h-12 px-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-ink focus:ring-4 focus:ring-ink/5 transition-all"
            >
              {ORGANIZATIONS.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.location})
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label
              htmlFor="date"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-2"
            >
              Drop-off Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink focus:border-ink focus:ring-4 focus:ring-ink/5 transition-all"
            />
          </div>

          {/* NOTE */}
          <div>
            <label
              htmlFor="note"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-2"
            >
              Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. I will drop them off around 2 PM..."
              rows={2}
              maxLength={150}
              className="w-full px-4 py-3 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-ink focus:ring-4 focus:ring-ink/5 transition-all resize-none"
            />
          </div>

          {/* INFO BANNER */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber/10 text-amber text-sm">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              By handing over this pet, you are transferring physical custody to
              the SPCA. They will handle the final reunion with the owner.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-burnt-deep/10 text-burnt-deep text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* SUBMIT */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-ink text-bone font-medium hover:bg-ink/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  Confirm Handover
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default HandoverPetToOrg;
