import express from "express";
import {
  getDeslindes,
  addDeslinde,
  editDeslinde,
  deleteDeslinde,
  setDeslindeVigente,
  getDeslindeVigente,
} from "../controllers/deslindeController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/deslindes", getDeslindes);
router.get("/deslindes/vigente", getDeslindeVigente);

router.post("/deslindes", checkAuth, isAdmin, addDeslinde);
router.put("/deslindes/:id", checkAuth, isAdmin, editDeslinde);
router.delete("/deslindes/:id", checkAuth, isAdmin, deleteDeslinde);
router.put("/deslindes/vigente/:id", checkAuth, isAdmin, setDeslindeVigente);

export default router;
