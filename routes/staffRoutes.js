// staffRoutes.js
import express from "express";
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  reorderStaff,
} from "../controllers/staffController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

router.get("/getstaff", getStaff);
router.get("/getstaff/:id", getStaffById);
router.post("/staff", upload.single("photo"), createStaff);
router.put("/:id", upload.single("photo"), updateStaff);
router.delete("/:id", deleteStaff);
router.put("/reorder/batch", reorderStaff); // Nueva ruta para reordenar

export default router;
