// routes/politicasRoutes.js
import express from "express";
import {
  getPoliticas,
  addPolitica,
  editPolitica, // Añadido
  deletePolitica, // Añadido
  setPoliticaVigente,
  getPoliticaVigente,
} from "../controllers/politicasController.js";
import { checkAuth, noEditor } from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/politicas", getPoliticas);
router.post("/politicas", checkAuth, noEditor, addPolitica);
router.put("/politicas/:id", checkAuth, noEditor, editPolitica);
router.delete("/politicas/:id", checkAuth, noEditor, deletePolitica);
router.put("/politicas/vigente/:id", checkAuth, noEditor, setPoliticaVigente);
router.get("/politicas/vigente", getPoliticaVigente);

export default router;
