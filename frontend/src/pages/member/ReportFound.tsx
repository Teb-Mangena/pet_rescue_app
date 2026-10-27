import { useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Camera,
  Upload,
  X,
  Check,
  AlertCircle,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router";
import BackLink from "../../components/BackLink";
import { useIncidents } from "../../hooks/useIncidents";

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

const WELLBEING = [
  { id: 1, name: "Healthy and energetic" },
  { id: 2, name: "Calm and relaxed" },
  { id: 3, name: "Playful and active" },
  { id: 4, name: "Scared or anxious" },
  { id: 6, name: "Exhausted or weak" },
  { id: 8, name: "Injured with visible wounds" },
];

function ReportFound() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const { reportFoundMutation } = useIncidents();
  const { mutate: reportFound, isPending } = reportFoundMutation;

  // Form State
  const [foundDate, setFoundDate] = useState("");
  const [foundStreet, setFoundStreet] = useState("");
  const [orgNeighbourhoodId, setOrgNeighbourhoodId] = useState<number>(2);
  const [foundDescription, setFoundDescription] = useState("");
  const [otherDesc, setOtherDesc] = useState("");
  const [wellbeingId, setWellbeingId] = useState<number>(1);

  // Image State
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get today's date in YYYY-MM-DD format for the max attribute
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];

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

    if (!image) return setError("Please upload a photo of the pet you found.");
    if (!foundDate) return setError("Please enter the date you found them.");
    if (foundDate > maxDate) {
      return setError("The date found cannot be in the future.");
    }
    if (!foundStreet.trim()) return setError("Please enter the street.");

    // Constructing FormData based on your screenshot
    const formData = new FormData();
    formData.append("found_date", foundDate);
    formData.append("found_street", foundStreet.trim());
    formData.append("org_neighbourhood", String(orgNeighbourhoodId));
    formData.append("found_description", foundDescription.trim());
    formData.append("other_desc", otherDesc.trim());
    formData.append("current_wellbeing_id", String(wellbeingId));
    formData.append("image", image);

    reportFound(formData, {
      onSuccess: () => navigate("/browse"),
    });
  }

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-moss/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-amber/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      <div className="relative max-w-[800px] mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <BackLink title="Back to feed" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/10 text-moss text-[11px] font-bold uppercase tracking-widest mb-4 mt-6">
            <Heart className="w-3.5 h-3.5" />
            Report Found
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            I found a pet
          </h1>
          <p className="mt-3 text-lg text-stone max-w-xl">
            Thank you for helping! Upload a photo and let us know where you
            found them so we can reunite them with their family.
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
          {/* IMAGE UPLOAD (Required for found pets) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-3">
              Photo of the Pet *
            </label>

            {!preview ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group w-full aspect-[16/9] sm:aspect-[21/9] rounded-[1.5rem] border-2 border-dashed border-ink/15 hover:border-moss bg-moss/5 hover:bg-moss/10 transition-colors grid place-items-center"
              >
                <div className="text-center px-6">
                  <div className="grid place-items-center w-14 h-14 mx-auto rounded-full bg-moss/10 text-moss mb-4 group-hover:scale-110 transition-transform">
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
              <div className="relative rounded-[1.5rem] overflow-hidden border border-ink/10">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full aspect-[16/9] sm:aspect-[21/9] object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/70 to-transparent flex items-end justify-between gap-3">
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

          <div className="h-px w-full bg-ink/10 my-6" />

          {/* DATE & STREET */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="foundDate"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Date Found *
              </label>
              <div className="relative">
                <input
                  id="foundDate"
                  type="date"
                  max={maxDate}
                  value={foundDate}
                  onChange={(e) => setFoundDate(e.target.value)}
                  className="w-full h-12 pl-4 pr-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="foundStreet"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Street Found *
              </label>
              <div className="relative">
                <input
                  id="foundStreet"
                  type="text"
                  value={foundStreet}
                  onChange={(e) => setFoundStreet(e.target.value)}
                  placeholder="e.g. 45 Long Street"
                  className="w-full h-12 pl-4 pr-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* NEIGHBOURHOOD & WELLBEING */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="neighbourhood"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Neighbourhood
              </label>
              <div className="relative">
                <select
                  id="neighbourhood"
                  value={orgNeighbourhoodId}
                  onChange={(e) =>
                    setOrgNeighbourhoodId(Number(e.target.value))
                  }
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all"
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
                htmlFor="wellbeing"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Current Wellbeing
              </label>
              <div className="relative">
                <select
                  id="wellbeing"
                  value={wellbeingId}
                  onChange={(e) => setWellbeingId(Number(e.target.value))}
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all"
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

          {/* DESCRIPTIONS */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="foundDescription"
                className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
              >
                Report Description
              </label>
              <textarea
                id="foundDescription"
                value={foundDescription}
                onChange={(e) => setFoundDescription(e.target.value)}
                placeholder="Describe the pet and the situation..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all resize-none"
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
                placeholder="Collar details, distinctive markings, etc."
                rows={2}
                maxLength={100}
                className="w-full px-4 py-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all resize-none"
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
              disabled={isPending}
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-moss text-bone font-medium hover:bg-moss/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Found Report
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

export default ReportFound;
