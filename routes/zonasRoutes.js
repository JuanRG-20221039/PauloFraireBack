import express from "express";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";
import {
  getZonas,
  getZonaById,
  createZona,
  updateZona,
  deleteZona,
} from "../controllers/zonasController.js";

const router = express.Router();

// Público: listar y obtener
router.get("/zonas", getZonas);
router.get("/zonas/:id", getZonaById);

// Admin: crear, actualizar, eliminar
router.post("/zonas", checkAuth, isAdmin, createZona);
router.put("/zonas/:id", checkAuth, isAdmin, updateZona);
router.delete("/zonas/:id", checkAuth, isAdmin, deleteZona);

export default router;
