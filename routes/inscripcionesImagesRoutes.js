import express from "express";
import multer from "multer";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";
import {
  getInscripcionesImages,
  addInscripcionesImages,
  updateInscripcionesImages,
  deleteAllInscripcionesImages,
} from "../controllers/inscripcionesImagesController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.get("/inscripciones-images", getInscripcionesImages);
router.post(
  "/inscripciones-images",

  upload.fields([{ name: "images" }]),
  addInscripcionesImages
);
router.put(
  "/inscripciones-images",
  checkAuth,
  isAdmin,
  upload.fields([{ name: "images" }]),
  updateInscripcionesImages
);
router.delete(
  "/inscripciones-images",
  checkAuth,
  isAdmin,
  deleteAllInscripcionesImages
);

export default router;
