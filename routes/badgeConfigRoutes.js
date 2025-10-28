// routes/badgeConfigRoutes.js
import express from "express";
import {
  saveBadgeConfig,
  getBadgeConfigByBook,
  getAllBadgeConfigs,
  deleteBadgeConfig,
} from "../controllers/badgeConfigController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// Obtener configuración de un libro específico (público)
router.get("/badge-config/:libroId", getBadgeConfigByBook);

// Obtener todas las configuraciones (solo admin)
router.get("/badge-configs", checkAuth, isAdmin, getAllBadgeConfigs);

// Guardar o actualizar configuración (solo admin)
router.post("/badge-config", checkAuth, isAdmin, saveBadgeConfig);

// Eliminar configuración (solo admin)
router.delete("/badge-config/:libroId", checkAuth, isAdmin, deleteBadgeConfig);

export default router;
