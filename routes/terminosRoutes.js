//terminosRoutes.js
import express from "express";
import {
  getTerminos,
  addTermino,
  editTermino,
  deleteTermino,
} from "../controllers/terminosController.js";

const router = express.Router();

router.get("/terminos", getTerminos);
router.post("/terminos", addTermino);
router.put("/terminos/:id", editTermino);
router.delete("/terminos/:id", deleteTermino);

export default router;
