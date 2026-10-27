import express from "express";
import {
  checkAuth,
  login,
  logout,
  onboard,
  register,
} from "../controllers/auth.controller.js";
import { protectAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectAuth, checkAuth);
router.patch("/onboarding", protectAuth, onboard);

export default router;
