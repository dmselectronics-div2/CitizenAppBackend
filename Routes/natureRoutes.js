import express from "express";
import {
  getNatureObservations,
  getNatureById,
  createNature,
  updateNature,
  deleteNature,
  getNatureByType,
  getNatureStats,
} from "../controllers/natureController.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Nature routes working!" });
});

// Main routes
router.route("/")
  .get(getNatureObservations)
  .post(createNature);

// Stats route (must be before /:id)
router.get("/stats", getNatureStats);

// Type route
router.get("/type/:type", getNatureByType);

// ID routes
router.route("/:id")
  .get(getNatureById)
  .put(updateNature)
  .delete(deleteNature);

export default router;