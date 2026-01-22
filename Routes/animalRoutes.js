import express from "express";
import {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalsByType,
  getAnimalStats,
} from "../controllers/animalController.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Animal routes working!" });
});

// Main routes
router.route("/")
  .get(getAnimals)
  .post(createAnimal);

// Stats route (must be before /:id)
router.get("/stats", getAnimalStats);

// Type route
router.get("/type/:type", getAnimalsByType);

// ID routes
router.route("/:id")
  .get(getAnimalById)
  .put(updateAnimal)
  .delete(deleteAnimal);

export default router;