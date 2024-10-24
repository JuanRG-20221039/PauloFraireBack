//routes politicasRoutes.js
import express from "express";
import {
  getPoliticas,
  addPolitica,
  editPolitica, // Añadido
  deletePolitica, // Añadido
} from "../controllers/politicasController.js";

const router = express.Router();

router.get("/politicas", getPoliticas);
router.post("/politicas", addPolitica);
router.put("/politicas/:id", editPolitica); // Nueva ruta para editar
router.delete("/politicas/:id", deletePolitica); // Nueva ruta para eliminar

export default router;
