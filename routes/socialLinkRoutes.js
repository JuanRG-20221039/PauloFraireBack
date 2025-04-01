// routes/socialLinkRoutes.js
import express from "express";
import {
  getSocialLinks,
  addOrUpdateSocialLinks,
  deleteSocialLink,
} from "../controllers/socialLinkController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// Ruta para obtener los enlaces de redes sociales
router.get("/social-links", getSocialLinks);

// Ruta para agregar o actualizar enlaces de redes sociales (protegida)
router.put("/social-links", checkAuth, isAdmin, addOrUpdateSocialLinks);

// Ruta para eliminar un enlace de red social (protegida)
router.delete("/social-links/:platform", checkAuth, isAdmin, deleteSocialLink);

export default router;
