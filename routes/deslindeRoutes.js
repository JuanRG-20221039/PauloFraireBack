import express from "express";
import {
  getDeslindes,
  addDeslinde,
  editDeslinde,
  deleteDeslinde,
} from "../controllers/deslindeController.js";

const router = express.Router();

router.get("/deslindes", getDeslindes);
router.post("/deslindes", addDeslinde);
router.put("/deslindes/:id", editDeslinde); // Ruta para editar
router.delete("/deslindes/:id", deleteDeslinde); // Ruta para eliminar

export default router;
