import { isValidObjectId } from "mongoose";
import BadgeConfig from "../models/BadgeConfig.js";
import PdfsCC from "../models/PdfsCC.js";

// Crear o actualizar configuración por libro
const saveBadgeConfig = async (req, res) => {
  try {
    const {
      libroId,
      badgeName,
      badgeDescription,
      badgeIcon,
      hasQuiz,
      questions,
    } = req.body;

    if (!isValidObjectId(libroId)) {
      return res.status(400).json({ message: "ID de libro no válido" });
    }

    const libro = await PdfsCC.findById(libroId);
    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    if (hasQuiz && (!questions || questions.length === 0)) {
      return res.status(400).json({
        message:
          "Si activas el cuestionario, debes agregar al menos una pregunta",
      });
    }

    // Validación de preguntas si existen
    if (hasQuiz && Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (
          !q?.question ||
          !Array.isArray(q.options) ||
          q.options.length !== 4 ||
          q.correct === undefined ||
          q.correct < 0 ||
          q.correct > 3
        ) {
          return res
            .status(400)
            .json({ message: `La pregunta ${i + 1} es inválida` });
        }
      }
    }

    const payload = {
      badgeName: badgeName?.trim() || "Guerrero Lector",
      badgeDescription:
        badgeDescription?.trim() ||
        "Insignia otorgada por completar el cuestionario perfectamente",
      badgeIcon: badgeIcon?.trim() || "🏆",
      hasQuiz: !!hasQuiz,
      questions: hasQuiz ? questions : [],
    };

    // upsert por libroId
    const config = await BadgeConfig.findOneAndUpdate(
      { libroId },
      { $set: { libroId, ...payload } },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Configuración guardada correctamente",
      badgeConfig: config,
    });
  } catch (error) {
    console.error("Error al guardar configuración:", error);
    return res.status(500).json({
      message: "Error al guardar la configuración",
      error: error.message,
    });
  }
};

// Obtener configuración por libro
const getBadgeConfigByBook = async (req, res) => {
  try {
    const { libroId } = req.params;
    if (!isValidObjectId(libroId)) {
      return res.status(400).json({ message: "ID de libro no válido" });
    }

    const config = await BadgeConfig.findOne({ libroId }).populate(
      "libroId",
      "nombre descripcion imagen"
    );

    if (!config) {
      return res.json({ hasConfig: false, badgeConfig: null });
    }

    return res.json({ hasConfig: true, badgeConfig: config });
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    return res
      .status(500)
      .json({
        message: "Error al obtener configuración",
        error: error.message,
      });
  }
};

// Eliminar configuración por libro
const deleteBadgeConfig = async (req, res) => {
  try {
    const { libroId } = req.params;
    if (!isValidObjectId(libroId)) {
      return res.status(400).json({ message: "ID de libro no válido" });
    }

    const deleted = await BadgeConfig.findOneAndDelete({ libroId });
    if (!deleted) {
      return res.status(404).json({ message: "Configuración no encontrada" });
    }

    return res.json({ message: "Configuración eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar configuración:", error);
    return res
      .status(500)
      .json({
        message: "Error al eliminar configuración",
        error: error.message,
      });
  }
};

// (Opcional) Listado para admins
const listBadgeConfigs = async (_req, res) => {
  try {
    const list = await BadgeConfig.find().populate("libroId", "nombre imagen");
    return res.json(list);
  } catch (error) {
    console.error("Error al listar configuraciones:", error);
    return res
      .status(500)
      .json({
        message: "Error al listar configuraciones",
        error: error.message,
      });
  }
};

export {
  saveBadgeConfig,
  getBadgeConfigByBook,
  deleteBadgeConfig,
  listBadgeConfigs,
};
