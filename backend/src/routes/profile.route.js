import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/profile.controller.js";
import { protectAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All profile routes require the user to be logged in
router.use(protectAuth);

// GET /api/profile - Fetch the user's details
router.get("/", getUserProfile);

// PUT /api/profile - Update the user's details
router.patch("/", updateUserProfile);

export default router;
