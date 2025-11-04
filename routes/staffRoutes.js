import express from "express";
import {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

// Public routes
router.get("/staff", getStaff);
router.get("/staff/:id", getStaffById);

// Protected routes (require authentication)
router.post("/staff", upload.single("photo"), createStaff);
router.put("/staff/:id", checkAuth, upload.single("photo"), updateStaff);
router.delete("/staff/:id", checkAuth, deleteStaff);

export default router;
