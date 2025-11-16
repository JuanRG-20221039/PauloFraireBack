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
import { checkAuth, noEditor } from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/terminos", getTerminos);
router.post("/terminos", checkAuth, noEditor, addTermino);
router.put("/terminos/:id", checkAuth, noEditor, editTermino);
router.delete("/terminos/:id", checkAuth, noEditor, deleteTermino);
router.put("/terminos/vigente/:id", checkAuth, noEditor, setTerminoVigente);
router.get("/terminos/vigente", getTerminoVigente);

export default router;
