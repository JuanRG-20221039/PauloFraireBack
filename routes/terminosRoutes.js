// routes/terminosRoutes.js
import express from "express";
import {
  getTerminos,
  addTermino,
  editTermino,
  deleteTermino,
  setTerminoVigente,
  getTerminoVigente,
} from "../controllers/terminosController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/terminos", getTerminos);
router.post("/terminos", checkAuth, isAdmin, addTermino);
router.put("/terminos/:id", checkAuth, isAdmin, editTermino);
router.delete("/terminos/:id", checkAuth, isAdmin, deleteTermino);
router.put("/terminos/vigente/:id", checkAuth, isAdmin, setTerminoVigente);
router.get("/terminos/vigente", getTerminoVigente);

export default router;
