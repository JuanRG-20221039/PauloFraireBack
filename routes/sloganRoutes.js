import express from "express";
import {
  getSlogan,
  updateSlogan,
  deleteSlogan,
} from "../controllers/sloganController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// Ruta para obtener el eslogan
router.get("/slogan", getSlogan);

// Ruta para agregar o actualizar el eslogan (protegida)
router.put("/slogan", checkAuth, isAdmin, updateSlogan);

// Ruta para eliminar el eslogan (protegida)
router.delete("/slogan", checkAuth, isAdmin, deleteSlogan);

export default router;
