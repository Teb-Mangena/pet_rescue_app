import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
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

const TILT = [-1.5, 1, -1, 1.5, -0.8, 1.2];

function MyPets() {
  const { user } = useAuthStore();
  const { myPetsQuery, deletePetMutation } = usePets(String(user?.person_id));
  const { data: pets, isLoading } = myPetsQuery;
  const { mutate: deletePet, isPending: isDeleting } = deletePetMutation;

  // State for the delete confirmation modal
  const [petToDelete, setPetToDelete] = useState<number | null>(null);

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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-widest mb-4">
              <PawPrint className="w-3.5 h-3.5" />
              Your Pets
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
              My Pets
            </h1>
            <p className="mt-3 text-lg text-stone max-w-xl">
              Manage your furry friends. Keep their details up to date or report
              them missing.
            </p>
          </div>

          <Link
            to="/pets/add"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
          >
            <Plus className="w-4 h-4" />
            Add a Pet
          </Link>
        </motion.div>

        {/* EMPTY STATE */}
        {(!pets || pets.length === 0) && (
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-20 text-center"
          >
            <div className="text-6xl mb-5 animate-bob">🐾</div>
            <h2 className="font-display font-black text-2xl tracking-tight">
              No pets registered yet
            </h2>
            <p className="text-stone mt-2 max-w-sm mx-auto">
              Add your first pet so you can easily report them if they ever go
              missing.
            </p>
            <Link
              to="/pets/add"
              className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add your first pet
            </Link>
          </motion.div>
        )}

        {/* PET GRID */}
        {pets && pets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {pets.map((pet, i) => {
                const tilt = TILT[i % TILT.length];

                // Determine status type for color and icon logic
                const statusLower = pet.pet_status.toLowerCase();
                const isMissing = statusLower.includes("missing");
                const isFound = statusLower.includes("found");

                return (
                  <motion.div
                    key={pet.pet_id}
                    layout
                    initial={{ opacity: 0, y: 20, rotate: tilt * 2 }}
                    animate={{ opacity: 1, y: 0, rotate: tilt }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease }}
                    whileHover={{
                      rotate: 0,
                      y: -6,
                      transition: { duration: 0.25, ease },
                    }}
                    className="group flex flex-col h-full rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-shadow"
                  >
                    {/* Image & Status */}
                    <div className="aspect-[4/3] bg-ink/5 relative overflow-hidden shrink-0">
                      {pet.image_url ? (
                        <img
                          src={pet.image_url}
                          alt={pet.pet_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-stone">
                          <PawPrint className="w-12 h-12" />
                        </div>
                      )}

                      {/* Dynamic Status Badge (Uses exact backend text) */}
                      <span
                        className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md max-w-[90%] ${
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

                    {/* Details */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="font-display font-black text-xl tracking-tight leading-tight truncate">
                        {pet.pet_name}
                      </div>
                      <div className="text-sm text-stone mt-1">
                        {pet.species_name} · {pet.colour_name}
                      </div>

                      <div className="pt-4 border-t border-ink/5 flex items-center justify-between mt-auto">
                        <Link
                          to={`/pets/edit/${pet.pet_id}`}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-ink hover:bg-ink/5 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Link>

                        <button
                          onClick={() => setPetToDelete(pet.pet_id)}
                          className="grid place-items-center w-8 h-8 rounded-lg text-burnt-deep hover:bg-burnt-deep/10 transition-colors"
                          title="Delete pet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {petToDelete !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !isDeleting && setPetToDelete(null)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-sm rounded-[2rem] border border-ink/10 bg-bone shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="grid place-items-center w-16 h-16 mx-auto rounded-full bg-burnt-deep/10 text-burnt-deep mb-5">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="font-display font-black text-2xl tracking-tight">
                Delete this pet?
              </h3>
              <p className="text-sm text-stone mt-3 leading-relaxed">
                Are you sure you want to remove this pet? If this pet has an
                active missing report, the deletion will be blocked until the
                report is resolved.
              </p>

              <div className="mt-7 flex items-center gap-2 justify-center">
                <button
                  onClick={() => setPetToDelete(null)}
                  disabled={isDeleting}
                  className="inline-flex items-center h-11 px-5 rounded-full border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    deletePet(petToDelete, {
                      onSuccess: () => setPetToDelete(null),
                    })
                  }
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-burnt-deep text-bone font-medium hover:bg-burnt-deep/90 transition-colors disabled:opacity-60"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MyPets;
