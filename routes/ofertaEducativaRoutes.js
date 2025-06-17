import express from "express";
import upload from "../utils/multerConfig.js";
import {
  createEducationalOffer,
  getEducationalOffers,
  getEducationalOfferById,
  updateEducationalOffer,
  deleteEducationalOffer,
  enrollUserInOffer,
  unenrollUserFromOffer,
  getAvailableEducationalOffers
} from "../controllers/ofertaEducativaController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// Ruta para crear una oferta educativa (protegida)
router.post(
  "/createoffter",
  checkAuth,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 }, // Un solo archivo para la imagen
    { name: "pdfs", maxCount: 10 }, // Hasta 10 archivos para los PDFs
  ]),
  createEducationalOffer
);

// Ruta para obtener todas las ofertas educativas
router.get("/getoffter", getEducationalOffers);

// Ruta para obtener ofertas educativas disponibles (con información de cupos)
router.get("/available", getAvailableEducationalOffers);

// Ruta para obtener una oferta educativa por su ID
router.get("/getoffterid/:id", getEducationalOfferById);

// Ruta para actualizar una oferta educativa por su ID (protegida)
router.put(
  "/updateEducationalOffer/:id",
  checkAuth,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdfs", maxCount: 10 },
  ]),
  updateEducationalOffer
);

// Ruta para eliminar una oferta educativa por su ID (protegida)
router.delete("/offterdelete/:id", checkAuth, isAdmin, deleteEducationalOffer);

// Ruta para inscribir un usuario en una oferta educativa
router.post("/enroll/:offerId", checkAuth, enrollUserInOffer);

// Ruta para desinscribir un usuario de una oferta educativa
router.post("/unenroll/:offerId", checkAuth, unenrollUserFromOffer);

export default router;
