import express from "express";
import { protectAuth } from "../middlewares/auth.middleware.js";
import {
  reportMissingPet,
  getAllMissingPets,
  reportFoundPet,
  getAllFoundPets,
  resolveMissingIncident,
  requestHandover,
  logFinderHandover,
  myFoundPets,
  getMyHandovers,
  claimMyPet,
} from "../controllers/incident.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// All incident routes require authentication
router.use(protectAuth);

// Missing Pets
router.post("/missing", requireRole("pet_owner"), reportMissingPet);
router.get("/missing", getAllMissingPets);
router.patch(
  "/missing/:mpi_id/resolve",
  requireRole("pet_owner"),
  resolveMissingIncident,
);

// Found Pets
router.post("/found", requireRole("community_member"), reportFoundPet);
router.get("/found", getAllFoundPets);

router.get(
  "/found/my",
  protectAuth,
  requireRole("community_member"),
  myFoundPets,
);

router.get("/handovers/my", requireRole("community_member"), getMyHandovers);

router.patch("/handover/:hoid/claim", requireRole("pet_owner"), claimMyPet);

router.post("/found/:fpr_id/claim", requireRole("pet_owner"), requestHandover);

router.post("/found/:fpr_id/finder-handover", protectAuth, logFinderHandover);

export default router;
