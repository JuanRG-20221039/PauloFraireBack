import express from "express";
import multer from "multer";
import {
  uploadLogo,
  deleteLogo,
  getLogo,
} from "../controllers/logoController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

const storage = multer.memoryStorage(); // Cambia de diskStorage a memoryStorage
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // Limitar a 2 MB

router.get("/logo", getLogo);
router.post("/logo", checkAuth, isAdmin, upload.single("logo"), uploadLogo);
router.delete("/logo", checkAuth, isAdmin, deleteLogo);

export default router;
