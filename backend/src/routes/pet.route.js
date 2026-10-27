import express from "express";
import { protectAuth } from "../middlewares/auth.middleware.js";
import {
  addPet,
  deletePet,
  getMyPets,
  updatePet,
} from "../controllers/pet.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protectAuth);

router.post("/add", upload.single("image"), addPet);
router.get("/my", getMyPets);
router.patch("/edit/:id", upload.single("image"), updatePet);
router.delete("/remove/:id", deletePet);

export default router;
