import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  ArrowRightLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  ImageOff,
  CheckCircle2,
  X,
  Check,
  Building2,
} from "lucide-react";
import PageLoader from "../../components/PageLoader";
import { useManager } from "../../hooks/useManager";
import type { IManagerPendingHandover } from "../../hooks/useManager";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

export default function ManagerHandovers() {
  const { pendingHandoversQuery, approveHandoverMutation } = useManager();
  const { data: handovers, isLoading } = pendingHandoversQuery;
  const { mutate: approve, isPending } = approveHandoverMutation;

  const [selectedHandover, setSelectedHandover] =
    useState<IManagerPendingHandover | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHandover) return;

    approve(
      {
        hoid: selectedHandover.hoid,
        response_note: note.trim(),
        date_handed_over: date,
      },
      {
        onSuccess: () => {
          setSelectedHandover(null);
          setNote("");
        },
      },
    );
  };

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
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Manager Action Center
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Pending Handovers
          </h1>
          <p className="mt-3 text-lg text-stone max-w-xl">
            Review pets found by community members. Approving a request means
            you are ready to accept the pet into your facility.
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
                <div className="text-6xl mb-5 animate-bob">📭</div>
                <h2 className="font-display font-black text-2xl tracking-tight">
                  All caught up
                </h2>
                <p className="text-stone mt-2 max-w-sm mx-auto">
                  There are no pending handovers from community members right
                  now.
                </p>
              </motion.div>
            ) : (
              handovers.map((handover, i) => (
                <motion.div
                  key={handover.hoid}
                  variants={fadeUp}
                  custom={1 + i * 0.05}
                  initial="hidden"
                  animate="show"
                  className="group flex flex-col md:flex-row items-stretch gap-0 rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* IMAGE SIDE */}
                  <div className="md:w-56 shrink-0 bg-ink/5 relative overflow-hidden aspect-[4/3] md:aspect-auto">
                    {handover.pet?.pet_image ? (
                      <img
                        src={handover.pet.pet_image}
                        alt={handover.pet.pet_name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-stone">
                        <ImageOff className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber text-ink backdrop-blur-md">
                      {handover.badge_title}
                    </span>
                  </div>

                  {/* CONTENT SIDE */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h2 className="font-display font-black text-2xl tracking-tight truncate">
                          {handover.pet?.pet_name || "Unknown Pet"}
                        </h2>
                        <div className="text-sm text-stone mt-1">
                          {handover.pet?.species_name || "Species"}
                          {handover.pet?.colour_name
                            ? ` · ${handover.pet.colour_name}`
                            : ""}
                        </div>
                      </div>
                      <div className="text-right text-xs text-stone">
                        <div className="font-bold uppercase tracking-widest mb-1">
                          Handover ID
                        </div>
                        <div className="font-mono">#{handover.hoid}</div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {/* Finder Info */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-2">
                          Found By
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <User className="w-4 h-4 text-stone" />
                          {handover.finder?.first_name}{" "}
                          {handover.finder?.last_name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone">
                          <Mail className="w-3.5 h-3.5" />
                          {handover.finder?.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone">
                          <Phone className="w-3.5 h-3.5" />
                          {handover.finder?.phone_number}
                        </div>
                      </div>

                      {/* Location Info */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-2">
                          Discovery Location
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-stone" />
                          <span>{handover.found_street}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-stone">
                          <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>
                            Found:{" "}
                            {new Date(handover.date_found).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION */}
                    <div className="pt-4 border-t border-ink/5 flex items-center justify-between gap-4 mt-auto">
                      <div className="text-xs text-stone italic line-clamp-1 max-w-[50%]">
                        "{handover.response_note || "No note provided."}"
                      </div>
                      <button
                        onClick={() => setSelectedHandover(handover)}
                        className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-ink text-bone text-sm font-medium hover:bg-ink/80 transition-colors shrink-0"
                      >
                        Review & Approve
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* APPROVAL MODAL */}
      <AnimatePresence>
        {selectedHandover && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPending && setSelectedHandover(null)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md rounded-[2rem] border border-ink/10 bg-bone shadow-2xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-black text-2xl tracking-tight">
                  Approve Handover
                </h3>
                <button
                  onClick={() => setSelectedHandover(null)}
                  disabled={isPending}
                  className="grid place-items-center w-8 h-8 rounded-full hover:bg-ink/5 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-moss/5 border border-moss/10 text-sm text-moss">
                <Building2 className="w-5 h-5 shrink-0" />
                <span>
                  Approving accepts{" "}
                  <strong>{selectedHandover.pet?.pet_name}</strong> into your
                  organization's care.
                </span>
              </div>

              <form onSubmit={handleApprove} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-2">
                    Expected Drop-off Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-bone border border-ink/10 outline-none focus:border-moss focus:ring-2 focus:ring-moss/15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-2">
                    Note to Finder (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Please drop off at the main reception..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-bone border border-ink/10 outline-none focus:border-moss focus:ring-2 focus:ring-moss/15 resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedHandover(null)}
                    disabled={isPending}
                    className="h-10 px-4 rounded-full border border-ink/15 hover:bg-ink/5 text-sm font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="h-10 px-6 rounded-full bg-moss text-bone text-sm font-medium hover:bg-moss/90 disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {isPending ? "Processing..." : "Confirm Approval"}
                    {!isPending && <Check className="w-4 h-4" />}
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
