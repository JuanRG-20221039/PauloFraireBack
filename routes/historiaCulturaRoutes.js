import express from "express";
import upload from "../utils/multerConfig.js";
import {
  createIntroduction,
  getIntroduction,
  addStory,
  getStories,
  updateStory,
  deleteStory,
  updateIntroduction,
  deleteIntroductionSINHISTORY,
} from "../controllers/historiaCulturaController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// Introducción (página general)
router.post("/introduction", checkAuth, isAdmin, createIntroduction);
router.get("/introduction", checkAuth, isAdmin, getIntroduction);
router.put("/introduction", checkAuth, isAdmin, updateIntroduction);
router.delete(
  "/introduction",
  checkAuth,
  isAdmin,
  deleteIntroductionSINHISTORY
);

// CRUD de historias (otra página)
router.post(
  "/stories",
  checkAuth,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 10 }]),
  addStory
);

router.get("/stories", checkAuth, isAdmin, getStories);

router.put(
  "/stories/:storyId",
  checkAuth,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 10 }]),
  updateStory
);

router.delete("/stories/:storyId", checkAuth, isAdmin, deleteStory);

export default router;
