import express from "express";
import {
  saveBadgeConfig,
  getBadgeConfigByBook,
  deleteBadgeConfig,
  listBadgeConfigs,
} from "../controllers/badgeConfigController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// Obtener configuración para un libro (público/cliente)
router.get("/badge-config/:libroId", getBadgeConfigByBook);

// Listar todas las configuraciones (solo admin)
router.get("/badge-configs", checkAuth, isAdmin, listBadgeConfigs);

// Crear/actualizar la configuración (solo admin)
router.post("/badge-config", checkAuth, isAdmin, saveBadgeConfig);

// Eliminar configuración de un libro (solo admin)
router.delete("/badge-config/:libroId", checkAuth, isAdmin, deleteBadgeConfig);

export default router;
