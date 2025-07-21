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
router.post("/introduction", createIntroduction);
router.get("/introduction", getIntroduction);
router.put("/introduction", updateIntroduction);
router.delete("/introduction", deleteIntroductionSINHISTORY);

// CRUD de historias (otra página)
router.post(
  "/stories",
  upload.fields([{ name: "images", maxCount: 5 }]),
  addStory
);

router.get("/stories", getStories);

router.put(
  "/stories/:storyId",
  upload.fields([{ name: "images", maxCount: 5 }]),
  updateStory
);

router.delete("/stories/:storyId", /* checkAuth, isAdmin, */ deleteStory);

export default router;
