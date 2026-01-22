import express from "express";
import {
  createPlant,
  getPlants,
  getPlantById,
  getPlantsByCategory,
  updatePlant,
  deletePlant
} from "../controllers/plantController.js";

const router = express.Router();

// ✅ Create new plant
router.post("/", createPlant);

// ✅ Get all plants
router.get("/", getPlants);

// ✅ Get plant by ID
router.get("/:id", getPlantById);

// ✅ Get plants by category
router.get("/category/:category", getPlantsByCategory);

// ✅ Update plant
router.put("/:id", updatePlant);

// ✅ Delete plant
router.delete("/:id", deletePlant);

export default router;
