import express from "express";
import {
  getAllBadgesAdmin,
  getUsersWithBadgesAdmin,
  getBadgesByUserIdAdmin,
} from "../controllers/adminBadgeController.js";
import { checkAuth } from "../middleware/checkAuth.js";
// import { isAdmin } from "../middleware/isAdmin.js"; // opcional si manejas roles

const router = express.Router();

router.get("/admin/badges", checkAuth, /* isAdmin, */ getAllBadgesAdmin);
router.get(
  "/admin/badges/users",
  checkAuth,
  /* isAdmin, */ getUsersWithBadgesAdmin
);
router.get(
  "/admin/badges/user/:userId",
  checkAuth,
  /* isAdmin, */ getBadgesByUserIdAdmin
);

export default router;
