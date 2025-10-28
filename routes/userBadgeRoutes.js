import express from "express";
import {
  saveBadge,
  getUserBadges,
  checkBadgeForBook,
  getBadgeStats,
} from "../controllers/userBadgeController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

// Todas requieren usuario autenticado
router.post("/badges", checkAuth, saveBadge);
router.get("/badges", checkAuth, getUserBadges);
router.get("/badges/libro/:libroId", checkAuth, checkBadgeForBook);
router.get("/badges/stats", checkAuth, getBadgeStats);

export default router;
