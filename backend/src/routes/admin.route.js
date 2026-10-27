import express from "express";
import {
  createOrganization,
  assignManagerRole,
} from "../controllers/admin.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { protectAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protectAuth, requireRole("itadmin"));

router.post("/organizations", createOrganization);

router.post("/assign-manager", assignManagerRole);

export default router;
