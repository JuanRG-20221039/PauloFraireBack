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
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/politicas", getPoliticas);
router.post("/politicas", checkAuth, isAdmin, addPolitica);
router.put("/politicas/:id", checkAuth, isAdmin, editPolitica);
router.delete("/politicas/:id", checkAuth, isAdmin, deletePolitica);
router.put("/politicas/vigente/:id", checkAuth, isAdmin, setPoliticaVigente);
router.get("/politicas/vigente", getPoliticaVigente);

export default router;
