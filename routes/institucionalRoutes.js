import express from "express";
import multer from "multer";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";
import {
  getInstitucional,
  saveInstitucional,
  deleteInstitucional,
} from "../controllers/institucionalController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
});

router.get("/institucional", getInstitucional);
router.post(
  "/institucional",
  checkAuth,
  isAdmin,
  upload.single("video"),
  saveInstitucional
);
router.put(
  "/institucional",
  checkAuth,
  isAdmin,
  upload.single("video"),
  saveInstitucional
);
router.delete("/institucional", checkAuth, isAdmin, deleteInstitucional);

export default router;
