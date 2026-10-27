import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Heart,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  X,
  Send,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useReunion } from "../../hooks/useReunions"; // Adjust path if needed
import type { IReunionStory } from "../../hooks/useReunions";
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

function Stories() {
  const { user } = useAuthStore();
  const { storiesQuery } = useReunion();
  const { data: stories, isLoading } = storiesQuery;
  const [selectedStory, setSelectedStory] = useState<IReunionStory | null>(
    null,
  );

  if (isLoading) return <PageLoader />;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-moss/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-amber/15 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/15 text-moss text-[11px] font-bold uppercase tracking-widest mb-6">
            <Heart className="w-3.5 h-3.5" />
            Happy Tails
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
            Reunited,
            <br />
            <span className="text-moss">against all odds.</span>
          </h1>
          <p className="mt-5 text-lg text-stone max-w-lg mx-auto leading-relaxed">
            Read heartwarming stories of pets finding their way back home. Every
            story is a reminder to never give up hope.
          </p>
          {user?.role === "pet_owner" && (
            <div className="mt-8">
              <Link
                to="/stories/new"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-moss text-bone font-medium hover:bg-moss/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Share your story
              </Link>
            </div>
          )}
        </motion.div>

        {/* STORIES GRID */}
        {!stories || stories.length === 0 ? (
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-20 text-center"
          >
            <div className="text-6xl mb-5 animate-bob">💌</div>
            <h2 className="font-display font-black text-2xl tracking-tight">
              No stories yet
            </h2>
            <p className="text-stone mt-2 max-w-sm mx-auto">
              Be the first to share a happy ending with the community.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {stories.map((story, i) => {
                const tilt = TILT[i % TILT.length];
                return (
                  <motion.article
                    key={story.reunion_id}
                    layout
                    initial={{ opacity: 0, y: 20, rotate: tilt * 2 }}
                    animate={{ opacity: 1, y: 0, rotate: tilt }}
                    transition={{ delay: 0.05 + i * 0.08, duration: 0.5, ease }}
                    whileHover={{
                      rotate: 0,
                      y: -6,
                      transition: { duration: 0.25, ease },
                    }}
                    onClick={() => setSelectedStory(story)}
                    className="group flex flex-col h-full rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-shadow cursor-pointer"
                  >
                    {/* Image */}
                    <div className="aspect-[16/10] bg-ink/5 relative overflow-hidden shrink-0">
                      {story.reunion_image ? (
                        <img
                          src={story.reunion_image}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-stone">
                          <PawPrint className="w-12 h-12" />
                        </div>
                      )}
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-bone/90 text-moss backdrop-blur-md">
                        <CheckCircle2 className="w-3 h-3" />
                        {story.badge_title || "Reunited"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-2">
                        {new Date(story.posted_at).toLocaleDateString("en-ZA", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <h2 className="font-display font-black text-xl tracking-tight leading-tight mb-2">
                        {story.title}
                      </h2>
                      <p className="text-sm text-stone line-clamp-3 leading-relaxed">
                        {story.story}
                      </p>

                      <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-moss font-medium">
                        <MessageSquare className="w-4 h-4" />
                        Read & comment
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* STORY & COMMENTS MODAL */}
      <AnimatePresence>
        {selectedStory && (
          <StoryModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================
   MODAL COMPONENT
   ========================================= */

function StoryModal({
  story,
  onClose,
}: {
  story: IReunionStory;
  onClose: () => void;
}) {
  // Use the hook with the specific story ID to fetch its comments
  const { commentsQuery, addCommentMutation } = useReunion(story.reunion_id);
  const { data: comments, isLoading: loadingComments } = commentsQuery;
  const { mutate: addComment, isPending: isAddingComment } = addCommentMutation;

  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(
      { reunion_id: story.reunion_id, comment_posted: commentText.trim() },
      {
        onSuccess: () => setCommentText(""), // Clear input on success
      },
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.25, ease }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-bone shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
      >
        {/* Left Side: Image & Pet Data */}
        <div className="md:w-2/5 bg-ink text-bone flex flex-col shrink-0">
          <div className="relative aspect-square md:aspect-auto md:flex-1">
            {story.reunion_image ? (
              <img
                src={story.reunion_image}
                alt={story.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-bone/20">
                <PawPrint className="w-24 h-24" />
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:hidden grid place-items-center w-9 h-9 rounded-full bg-bone/80 text-ink hover:bg-bone transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 bg-ink relative z-10">
            <div className="text-amber text-[10px] font-bold uppercase tracking-widest mb-3">
              The Journey Home
            </div>
            <div className="space-y-3 text-sm text-bone/80">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 shrink-0 text-bone/50" />
                <span>
                  Found by{" "}
                  <strong className="text-bone">{story.finder_name}</strong>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-bone/50" />
                <span>{story.found_street}</span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 shrink-0 text-bone/50" />
                <span>
                  Found on {new Date(story.date_found).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Story & Comments */}
        <div className="md:w-3/5 flex flex-col h-[60vh] md:h-auto overflow-hidden bg-bone">
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-moss/10 text-moss text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Heart className="w-3 h-3" />
                  {story.badge_title || "Reunited"}
                </div>
                <h2 className="font-display font-black text-3xl tracking-tight leading-tight">
                  {story.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="hidden md:grid place-items-center w-8 h-8 rounded-full text-stone hover:text-ink hover:bg-ink/5 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Text */}
            <p className="text-ink/80 leading-relaxed text-sm mb-8">
              {story.story}
            </p>

            {/* Comments Section */}
            <div className="border-t border-ink/10 pt-6">
              <h3 className="font-display font-black text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-moss" />
                Comments ({comments?.length || 0})
              </h3>

              {loadingComments ? (
                <div className="py-4 text-center">
                  <span className="w-5 h-5 inline-block rounded-full border-2 border-ink/20 border-t-moss animate-spin" />
                </div>
              ) : comments?.length === 0 ? (
                <p className="text-sm text-stone italic mb-4">
                  No comments yet. Be the first to share the joy!
                </p>
              ) : (
                <div className="space-y-4 mb-6">
                  {comments?.map((comment) => (
                    <div key={comment.comment_id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber/20 text-amber grid place-items-center font-bold text-xs shrink-0">
                        {comment.commenter_name.charAt(0)}
                      </div>
                      <div className="bg-ink/5 p-3 rounded-2xl rounded-tl-none flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-ink">
                            {comment.commenter_name}
                          </span>
                          <span className="text-[10px] text-stone">
                            {new Date(comment.posted_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-ink/80">
                          {comment.comment_posted}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Comment Form */}
          <div className="p-4 bg-bone border-t border-ink/10 shrink-0">
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                maxLength={200}
                className="flex-1 h-11 px-4 rounded-xl bg-ink/5 border border-transparent focus:bg-bone focus:border-moss focus:ring-4 focus:ring-moss/10 outline-none text-sm text-ink transition-all"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isAddingComment}
                className="grid place-items-center w-11 h-11 rounded-xl bg-moss text-bone hover:bg-moss/90 transition-colors disabled:opacity-50 shrink-0"
              >
                {isAddingComment ? (
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Stories;
