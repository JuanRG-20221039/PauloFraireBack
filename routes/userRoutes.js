import express from "express";
import {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  login,
  loginMovil,
  updateUserByEmail,
  isPasswordInHistory,
  uploadUserDocs,
  updateDocsStatus,
} from "../controllers/userController.js";
import { checkAuth, noEditor } from "../middleware/checkAuth.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

// Rutas GET protegidas con autenticación
router.get("/user", checkAuth, getUsers);
router.get("/user/:id", checkAuth, getUserById);
router.get("/user/email/:email", checkAuth, getUserByEmail);

// Rutas POST protegidas con autenticación (excepto login)
router.post("/user", checkAuth, noEditor, addUser);
router.post("/login", login);
router.post("/loginMovil", loginMovil);
router.post("/user/password-history", checkAuth, noEditor, isPasswordInHistory);

// Rutas PUT protegidas con autenticación
router.put("/user/:id/docs", checkAuth, updateUser); // Ruta específica para actualizar documentos
router.put("/user/:id", checkAuth, noEditor, updateUser);
router.put("/user/email/:email", checkAuth, noEditor, updateUserByEmail);
router.put("/user/:id/docs-status", checkAuth, noEditor, updateDocsStatus);

// Ruta para subir documentos
router.post(
  "/user/:id/docs",
  checkAuth,
  upload.fields([{ name: "docs", maxCount: 10 }]),
  uploadUserDocs
);

// Ruta DELETE protegida con autenticación y permiso de administrador
router.delete("/user/:id", checkAuth, noEditor, deleteUser);

export default router;
