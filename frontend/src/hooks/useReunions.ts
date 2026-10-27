import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

export interface IReunionStory {
  reunion_id: number;
  title: string;
  story: string;
  reunion_image: string | null;
  posted_at: string;
  hoid: number;
  badge_title: string;
  date_handed_over: string;
  found_street: string;
  date_found: string;
  finder_name: string;
}

export interface IReunionComment {
  comment_id: number;
  comment_posted: string;
  posted_at: string;
  reunion_id: number;
  commenter_name: string;
}

// --- MAIN HOOK ---
// We accept an optional reunionId so you can fetch comments for a specific story when needed
export const useReunion = (reunionId?: number) => {
  const queryClient = useQueryClient();

  // 1. FETCH ALL REUNION STORIES (Public Feed)
  const storiesQuery = useQuery<IReunionStory[]>({
    queryKey: ["reunion-stories"],
    queryFn: getAllReunionStories,
  });

  // 2. FETCH COMMENTS FOR A SPECIFIC STORY
  const commentsQuery = useQuery<IReunionComment[]>({
    queryKey: ["reunion-comments", reunionId],
    queryFn: () => getCommentsForStory(reunionId!),
    enabled: !!reunionId, // Only run this query if a reunionId was passed to the hook
  });

  // 3. CREATE A REUNION STORY (Expects FormData because of image upload)
  const createStoryMutation = useMutation({
    mutationFn: createReunionStory,
    onSuccess: () => {
      toast.success("Reunion story posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reunion-stories"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to post reunion story.",
      );
    },
  });

  // 4. ADD A COMMENT TO A STORY (Standard JSON body)
  const addCommentMutation = useMutation({
    mutationFn: addReunionComment,
    onSuccess: (_, variables) => {
      toast.success("Comment posted!");
      // Invalidate the specific story's comments so they reload immediately
      queryClient.invalidateQueries({
        queryKey: ["reunion-comments", variables.reunion_id],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to post comment.");
    },
  });

  return {
    storiesQuery,
    commentsQuery,
    createStoryMutation,
    addCommentMutation,
  };
};

// ==========================================
// API FUNCTIONS
// ==========================================

async function getAllReunionStories() {
  const res = await axiosInstance.get("/stories");
  return res.data;
}

async function getCommentsForStory(reunion_id: number) {
  const res = await axiosInstance.get(`/stories/${reunion_id}/comments`);
  return res.data;
}

async function createReunionStory(formData: FormData) {
  // Uses FormData because your backend accepts an image (req.file via upload.single)
  const res = await axiosInstance.post("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

async function addReunionComment(data: {
  reunion_id: number;
  comment_posted: string;
}) {
  // Uses standard JSON because the backend just expects { comment_posted } in req.body
  const res = await axiosInstance.post(`/stories/${data.reunion_id}/comments`, {
    comment_posted: data.comment_posted,
  });
  return res.data;
}
