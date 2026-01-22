import express from "express";
import { getUsers, createUser, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.route("/")
  .get(getUsers)
  .post(createUser);

router.route("/:id")
  .get(getUserById);

export default router;