import express from "express";
import {
  approveHandover,
  approveOwnerClaim,
  getManagerFoundPets,
  getManagerMissingPets,
  getPendingHandovers,
} from "../controllers/manager.controller.js";
import { protectAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protectAuth, requireRole("manager"));

router.get("/incidents/missing", getManagerMissingPets);

router.get("/incidents/found", getManagerFoundPets);

router.get("/handovers/pending", getPendingHandovers);

router.patch("/handovers/:hoid/approve", approveHandover);

router.patch("/handovers/:hoid/approve-claim", approveOwnerClaim);

export default router;
