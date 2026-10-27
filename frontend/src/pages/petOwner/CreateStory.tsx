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
  PenTool,
} from "lucide-react";
import { useNavigate } from "react-router";
import BackLink from "../../components/BackLink";
import { useReunion } from "../../hooks/useReunions"; // Adjust path if needed

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

function CreateStory() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const { createStoryMutation } = useReunion();
  const { mutate: createStory, isPending } = createStoryMutation;

  // Form State
  const [hoid, setHoid] = useState("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");

  // Image State
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

    if (!hoid) return setError("Please enter the Handover ID.");
    if (!title.trim()) return setError("Please give your story a title.");
    if (!story.trim())
      return setError("Please write a little bit about the reunion.");

    // Constructing FormData
    const formData = new FormData();
    formData.append("hoid", hoid);
    formData.append("title", title.trim());
    formData.append("story", story.trim());

    if (image) {
      formData.append("image", image); // Backend multer field name
    }

    createStory(formData, {
      onSuccess: () => navigate("/stories"),
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
          <BackLink title="Back to Happy Tails" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/15 text-moss text-[11px] font-bold uppercase tracking-widest mb-4 mt-6">
            <PenTool className="w-3.5 h-3.5" />
            Share a Story
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Write a Happy Tail
          </h1>
          <p className="mt-3 text-lg text-stone max-w-xl">
            Inspire the community with your reunion story. How did you find each
            other again?
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
          {/* HANDOVER ID */}
          <div>
            <label
              htmlFor="hoid"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
            >
              Handover ID
            </label>
            <input
              id="hoid"
              type="number"
              value={hoid}
              onChange={(e) => setHoid(e.target.value)}
              placeholder="e.g. 61"
              className="w-full h-12 px-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all"
            />
            <p className="mt-2 text-xs text-stone">
              This links your story to the official handover record.
            </p>
          </div>

          <div className="h-px w-full bg-ink/10 my-6" />

          {/* TITLE */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
            >
              Story Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Three weeks, one photo, and a happy ending!"
              maxLength={100}
              className="w-full h-12 px-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all"
            />
          </div>

          {/* STORY BODY */}
          <div>
            <label
              htmlFor="story"
              className="block text-xs font-bold uppercase tracking-widest text-stone mb-3"
            >
              Your Story
            </label>
            <textarea
              id="story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Tell us how it happened..."
              rows={5}
              maxLength={500}
              className="w-full px-4 py-4 rounded-xl bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all resize-none"
            />
            <div className="mt-2 text-right text-xs text-stone tabular-nums">
              {story.length}/500
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-3">
              Reunion Photo
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
                    A picture of the happy reunion
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
                  Publishing…
                </>
              ) : (
                <>
                  Publish Story
                  <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default CreateStory;
