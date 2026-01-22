import express from "express";
import {
  getHumanActivities,
  getHumanActivityById,
  createHumanActivity,
  updateHumanActivity,
  deleteHumanActivity,
  getHumanActivitiesByType,
  getHumanActivityStats,
} from "../controllers/humanityController.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Human Activity routes working!" });
});

// Main routes
router.route("/")
  .get(getHumanActivities)
  .post(createHumanActivity);

// Stats route (must be before /:id)
router.get("/stats", getHumanActivityStats);

// Type route
router.get("/type/:activityType", getHumanActivitiesByType);

// ID routes
router.route("/:id")
  .get(getHumanActivityById)
  .put(updateHumanActivity)
  .delete(deleteHumanActivity);

export default router;
