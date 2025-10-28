import { isValidObjectId } from "mongoose";
import UserBadge from "../models/UserBadge.js";
import PdfsCC from "../models/PdfsCC.js";
import BadgeConfig from "../models/BadgeConfig.js";

// Crear una insignia cuando el usuario obtiene puntuación perfecta
const saveBadge = async (req, res) => {
  try {
    const authUser = req.usuario || req.user;
    if (!authUser) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { libroId, badgeName, badgeDescription, score, badgeIcon } = req.body;

    if (!isValidObjectId(libroId)) {
      return res.status(400).json({ message: "ID de libro no válido" });
    }

    const libro = await PdfsCC.findById(libroId);
    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    // Validar perfecto según configuración del libro
    const cfg = await BadgeConfig.findOne({ libroId });
    const totalQuestions = cfg?.hasQuiz ? cfg?.questions?.length || 0 : 0;

    if (totalQuestions > 0 && score !== totalQuestions) {
      return res
        .status(400)
        .json({
          message: "La insignia solo se otorga por puntuación perfecta",
        });
    }

    // Evitar duplicado por usuario y libro
    const existing = await UserBadge.findOne({
      userId: authUser._id,
      libroId,
    });
    if (existing) {
      return res.status(200).json({
        message: "Ya tienes esta insignia",
        badge: existing,
      });
    }

    const badge = await UserBadge.create({
      userId: authUser._id,
      libroId,
      badgeName: badgeName || cfg?.badgeName || "Guerrero Lector",
      badgeDescription:
        badgeDescription ||
        cfg?.badgeDescription ||
        "Insignia otorgada por completar el cuestionario perfectamente",
      badgeIcon: badgeIcon || cfg?.badgeIcon || "🏆", // persistir icono
      score: score ?? totalQuestions,
    });

    return res.status(201).json({
      message: "¡Insignia desbloqueada exitosamente!",
      badge,
    });
  } catch (error) {
    console.error("Error al guardar insignia:", error);
    return res.status(500).json({ message: "Error al guardar la insignia" });
  }
};

// Obtener todas las insignias del usuario autenticado
const getUserBadges = async (req, res) => {
  try {
    const authUser = req.usuario || req.user;
    if (!authUser) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const badges = await UserBadge.find({ userId: authUser._id })
      .populate("libroId", "nombre imagen")
      .sort({ earnedAt: -1 });

    return res.json(badges);
  } catch (error) {
    console.error("Error al obtener insignias:", error);
    return res.status(500).json({ message: "Error al obtener insignias" });
  }
};

// Verificar si el usuario tiene insignia para un libro
const checkBadgeForBook = async (req, res) => {
  try {
    const authUser = req.usuario || req.user;
    if (!authUser) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { libroId } = req.params;
    if (!isValidObjectId(libroId)) {
      return res.status(400).json({ message: "ID de libro no válido" });
    }

    const badge = await UserBadge.findOne({
      userId: authUser._id,
      libroId,
    });

    return res.json({ hasBadge: !!badge, badge: badge || null });
  } catch (error) {
    console.error("Error al verificar insignia:", error);
    return res.status(500).json({ message: "Error al verificar insignia" });
  }
};

// (Opcional) Estadísticas del usuario
const getBadgeStats = async (req, res) => {
  try {
    const authUser = req.usuario || req.user;
    if (!authUser) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const totalBadges = await UserBadge.countDocuments({
      userId: authUser._id,
    });
    const totalBooks = 0; // puedes usar await PdfsCC.countDocuments()
    const recentBadges = await UserBadge.find({ userId: authUser._id })
      .populate("libroId", "nombre imagen")
      .sort({ earnedAt: -1 })
      .limit(5);

    return res.json({
      totalBadges,
      totalBooks,
      progress:
        totalBooks > 0 ? Math.round((totalBadges / totalBooks) * 100) : 0,
      recentBadges,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};

export { saveBadge, getUserBadges, checkBadgeForBook, getBadgeStats };
