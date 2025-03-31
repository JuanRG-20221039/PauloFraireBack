// becaRoutes.js
import express from "express";
import upload from "../utils/multerConfig.js";
import { createBeca, getBecas, getBecaById, updateBeca, deleteBeca } from "../controllers/becaController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

router.post(
  "/createbeca",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdfs", maxCount: 10 },
  ]),
  checkAuth,
  isAdmin,
  createBeca
);

router.get("/getbecas", getBecas);
router.get("/getbeca/:id", getBecaById);

router.put(
  "/updateBeca/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdfs", maxCount: 10 },
  ]),
  checkAuth,
  isAdmin,
  updateBeca
);

router.delete("/deletebeca/:id", checkAuth, isAdmin, deleteBeca);

export default router;
