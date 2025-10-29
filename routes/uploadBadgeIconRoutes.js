// routes/uploadBadgeIconRoutes.js
import express from "express";
import upload from "../utils/multerConfig.js";
import { uploadBadgeIcon } from "../controllers/uploadBadgeIconController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

router.post(
  "/upload/badge-icon",
  checkAuth,
  isAdmin,
  upload.single("icon"), // campo 'icon' con 1 archivo
  uploadBadgeIcon
);

export default router;
