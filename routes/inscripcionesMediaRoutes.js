import express from "express";
import multer from "multer";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";
import {
  getInscripcionesMedia,
  createInscripcionesMedia,
  updateInscripcionesMedia,
  deleteInscripcionesMedia,
} from "../controllers/inscripcionesMediaController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 30 * 1024 * 1024 } });

router.get("/inscripciones-media", getInscripcionesMedia);
router.post(
  "/inscripciones-media",
  checkAuth,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 100 }, { name: "video", maxCount: 1 }]),
  createInscripcionesMedia
);
router.put(
  "/inscripciones-media",
  checkAuth,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 100 }, { name: "video", maxCount: 1 }]),
  updateInscripcionesMedia
);
router.delete("/inscripciones-media", checkAuth, isAdmin, deleteInscripcionesMedia);

export default router;