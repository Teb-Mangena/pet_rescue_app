import { useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  ArrowLeft,
  Camera,
  Upload,
  X,
  Check,
  AlertCircle,
  Dog,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { usePets } from "../../hooks/usePets";
import { PET_COLOURS, PET_SIZES, PET_SPECIES } from "../../data/pets";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

function CreatePet() {
  const { addPetMutation } = usePets();
  const { mutate: addPet, isPending } = addPetMutation;
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [petName, setPetName] = useState("");
  const [speciesId, setSpeciesId] = useState<number>(1);
  const [colourId, setColourId] = useState<number>(1);
  const [sizeId, setSizeId] = useState<number>(12);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!petName.trim()) return setError("Give your pet a name.");
    if (!image) return setError("Please upload a photo of your pet.");

    // Matches your SQL schema perfectly
    const formData = new FormData();
    formData.append("pet_name", petName.trim());
    formData.append("species_id", String(speciesId));
    formData.append("pet_colour_id", String(colourId));
    formData.append("pet_size_id", String(sizeId));
    formData.append("pet_description", description.trim());
    formData.append("image", image);

    addPet(formData, {
      onSuccess: () => navigate("/pets"),
    });
  }

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-amber/15 rotate-25" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-15" />
      </div>

      <div className="relative max-w-200 mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <Link
            to="/pets"
            className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to my pets
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-widest mb-4">
            <Dog className="w-3.5 h-3.5" />
            Register a Pet
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Add a new friend
          </h1>
          <p className="mt-3 text-lg text-stone max-w-xl">
            Fill in the details below. You can update these later from your
            dashboard.
          </p>
        </motion.div>

        {/* FORM */}
        <motion.form
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          onSubmit={handleSubmit}
          className="mt-10 bg-bone border border-ink/10 rounded-4xl p-6 sm:p-10 shadow-sm space-y-8"
        >
          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-3">
              Photo
            </label>

            {!preview ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group w-full aspect-video sm:aspect-21/9 rounded-3xl border-2 border-dashed border-ink/15 hover:border-burnt bg-amber/5 hover:bg-amber/10 transition-colors grid place-items-center"
              >
                <div className="text-center px-6">
                  <div className="grid place-items-center w-14 h-14 mx-auto rounded-full bg-burnt/10 text-burnt mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="font-display font-black text-lg tracking-tight">
                    Upload a photo
                  </div>
                  <div className="text-sm text-stone mt-1">
                    Clear, well-lit photos work best
                  </div>
                </div>
              </button>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-ink/10">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full aspect-video sm:aspect-21/9 object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-ink/70 to-transparent flex items-end justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-bone/90 text-ink backdrop-blur-md">
                    <Check className="w-3 h-3" />
                    Ready
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-bone/90 text-ink text-xs font-medium hover:bg-bone transition-colors backdrop-blur-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="grid place-items-center w-9 h-9 rounded-full bg-bone/90 text-burnt-deep hover:bg-bone transition-colors backdrop-blur-md"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* NAME */}
          <div>
            <label
              htmlFor="petName"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
            >
              Pet's Name
            </label>
            <input
              id="petName"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g. Maxi"
              maxLength={40}
              className="w-full h-12 px-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
            />
          </div>

          {/* DROPDOWNS */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="species"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Species
              </label>
              <div className="relative">
                <select
                  id="species"
                  value={speciesId}
                  onChange={(e) => setSpeciesId(Number(e.target.value))}
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                >
                  {PET_SPECIES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              </div>
            </div>

            <div>
              <label
                htmlFor="colour"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Colour
              </label>
              <div className="relative">
                <select
                  id="colour"
                  value={colourId}
                  onChange={(e) => setColourId(Number(e.target.value))}
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                >
                  {PET_COLOURS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              </div>
            </div>

            <div>
              <label
                htmlFor="size"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Size
              </label>
              <div className="relative">
                <select
                  id="size"
                  value={sizeId}
                  onChange={(e) => setSizeId(Number(e.target.value))}
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                >
                  {PET_SIZES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Distinctive markings, personality, or anything else that helps identify them..."
              rows={4}
              maxLength={300}
              className="w-full px-4 py-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all resize-none"
            />
            <div className="mt-2 text-right text-xs text-stone tabular-nums">
              {description.length}/300
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
              disabled={isPending}
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  Save Pet
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

export default CreatePet;
