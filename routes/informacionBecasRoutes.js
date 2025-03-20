//informacionBecasRoutes.js
import express from "express";
import { getInformacionBecas, updateInformacionBecas } from "../controllers/informacionBecasController.js";

const router = express.Router();

router.get("/becas", getInformacionBecas);
router.put("/becas", updateInformacionBecas);

export default router;
