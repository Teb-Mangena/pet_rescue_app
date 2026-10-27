import express from "express";
import {
  addReunionComment,
  createReunionStory,
  getAllReunionStories,
  getCommentsForStory,
} from "../controllers/story.controller.js";
import { protectAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getAllReunionStories);

router.post(
  "/",
  protectAuth,
  requireRole("pet_owner"),
  upload.single("image"),
  createReunionStory,
);

router.get("/:reunion_id/comments", getCommentsForStory);

router.post("/:reunion_id/comments", protectAuth, addReunionComment);

export default router;
