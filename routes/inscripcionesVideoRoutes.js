import express from "express";
import multer from "multer";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";
import {
  getInscripcionesVideo,
  createInscripcionesVideo,
  updateInscripcionesVideo,
  deleteInscripcionesVideo,
} from "../controllers/inscripcionesVideoController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 },
});

router.get("/inscripciones-video", getInscripcionesVideo);
router.post(
  "/inscripciones-video",
  upload.single("video"),
  createInscripcionesVideo
);
router.put(
  "/inscripciones-video",
  checkAuth,
  isAdmin,
  upload.single("video"),
  updateInscripcionesVideo
);
router.delete(
  "/inscripciones-video",
  checkAuth,
  isAdmin,
  deleteInscripcionesVideo
);

export default router;
