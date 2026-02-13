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
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

router.get("/getstaff", getStaff);
router.get("/getstaff/:id", getStaffById);
router.post(
  "/add-staff",
  checkAuth,
  isAdmin,
  upload.single("photo"),
  createStaff
);
router.put(
  "/edit-staff/:id",
  checkAuth,
  isAdmin,
  upload.single("photo"),
  updateStaff
);
router.delete("/delete-staff/:id", checkAuth, isAdmin, deleteStaff);
router.put("/reorder/batch", checkAuth, isAdmin, reorderStaff); // Nueva ruta para reordenar

export default router;
