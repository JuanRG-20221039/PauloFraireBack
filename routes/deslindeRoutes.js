import express from "express";
import {
  getDeslindes,
  addDeslinde,
  editDeslinde,
  deleteDeslinde,
  setDeslindeVigente,
  getDeslindeVigente,
} from "../controllers/deslindeController.js";
import { checkAuth, noEditor } from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/deslindes", getDeslindes);
router.get("/deslindes/vigente", getDeslindeVigente);

router.post("/deslindes", checkAuth, noEditor, addDeslinde);
router.put("/deslindes/:id", checkAuth, noEditor, editDeslinde);
router.delete("/deslindes/:id", checkAuth, noEditor, deleteDeslinde);
router.put("/deslindes/vigente/:id", checkAuth, noEditor, setDeslindeVigente);

export default router;
