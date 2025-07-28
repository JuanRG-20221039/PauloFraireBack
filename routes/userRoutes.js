import express from "express";
import {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  login,
  updateUserByEmail,
  isPasswordInHistory,
  uploadUserDocs,
  updateDocsStatus,
} from "../controllers/userController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

// Rutas GET protegidas con autenticación
router.get("/user", checkAuth, isAdmin, getUsers);
router.get("/user/:id", checkAuth, isAdmin, getUserById);
router.get("/user/email/:email", checkAuth, isAdmin, getUserByEmail);

// Rutas POST protegidas con autenticación (excepto login)
router.post("/user", checkAuth, isAdmin, addUser);
router.post("/login", login);
router.post("/user/password-history", checkAuth, isAdmin, isPasswordInHistory);

// Rutas PUT protegidas con autenticación
router.put("/user/:id", checkAuth, isAdmin, updateUser);
router.put("/user/:id/docs", checkAuth, isAdmin, updateUser); // Ruta específica para actualizar documentos
router.put("/user/email/:email", checkAuth, isAdmin, updateUserByEmail);
router.put("/user/:id/docs-status", checkAuth, isAdmin, updateDocsStatus);

// Ruta para subir documentos
router.post(
  "/user/:id/docs",
  checkAuth,
  upload.fields([{ name: "docs", maxCount: 10 }]),
  uploadUserDocs
);

// Ruta DELETE protegida con autenticación y permiso de administrador
router.delete("/user/:id", checkAuth, isAdmin, deleteUser);

export default router;
