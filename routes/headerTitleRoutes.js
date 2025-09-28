import express from "express";
import {
  getHeaderTitle,
  addOrUpdateHeaderTitle,
  deleteHeaderTitle,
} from "../controllers/headerTitleController.js";
import { checkAuth, noEditor } from "../middleware/checkAuth.js";

const router = express.Router();

// Ruta para obtener el título
router.get("/header-title", getHeaderTitle);

// Ruta para agregar o actualizar el título (protegida)
router.put("/header-title", checkAuth, noEditor, addOrUpdateHeaderTitle);

// Ruta para eliminar el título (protegida)
router.delete("/header-title", checkAuth, noEditor, deleteHeaderTitle);

export default router;
