// routes/eventoRoutes.js
import express from "express";
import upload from "../utils/multerConfig.js";
import {
  createEvento,
  getEventos,
  getEventoById,
  updateEvento,
  deleteEvento,
  deleteImageEvento,
} from "../controllers/eventoController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

/* ===============================
   📌 Rutas de consulta (Auth)
   =============================== */

// Obtener todos los eventos
router.get("/getEventos", getEventos);

// Obtener un evento por ID
router.get("/getEvento/:id", getEventoById);

/* ===============================
   🔒 Rutas de administración (Auth + Admin)
   =============================== */

// Crear un nuevo evento
router.post(
  "/createEvento",
  upload.fields([{ name: "images", maxCount: 20 }]),
  checkAuth,
  isAdmin,
  createEvento
);

// Actualizar un evento existente
router.put(
  "/updateEvento/:id",
  upload.fields([{ name: "images", maxCount: 20 }]),
  checkAuth,
  isAdmin,
  updateEvento
);

// Eliminar un evento
router.delete("/deleteEvento/:id", checkAuth, isAdmin, deleteEvento);

// Eliminar una imagen individual de un evento
router.put("/deleteImageEvento/:id", checkAuth, isAdmin, deleteImageEvento);

export default router;
