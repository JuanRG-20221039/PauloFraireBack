// controllers/badgeConfigController.js
import { isValidObjectId } from "mongoose";
import BadgeConfig from "../models/BadgeConfig.js";
import PdfsCC from "../models/PdfsCC.js";

// Guardar o actualizar configuración de insignia y cuestionario
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

    console.log("=== RECIBIENDO DATOS ===");
    console.log("libroId:", libroId);
    console.log("badgeName:", badgeName);
    console.log("hasQuiz:", hasQuiz);
    console.log("questions:", questions?.length);

    if (!isValidObjectId(libroId)) {
      return res.status(400).json({ message: "ID de libro no válido" });
    }

    // Verificar que el libro existe
    const libroExists = await PdfsCC.findById(libroId);
    if (!libroExists) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    // Validaciones
    if (hasQuiz && (!questions || questions.length === 0)) {
      return res.status(400).json({
        message:
          "Si activas el cuestionario, debes agregar al menos una pregunta",
      });
    }

    // Validar que las preguntas estén completas
    if (hasQuiz && questions) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question || !q.options || q.options.length !== 4) {
          return res.status(400).json({
            message: `La pregunta ${i + 1} está incompleta`,
          });
        }
        if (q.correct === undefined || q.correct < 0 || q.correct > 3) {
          return res.status(400).json({
            message: `La pregunta ${
              i + 1
            } debe tener una respuesta correcta válida`,
          });
        }
      }
    }

    // Buscar si ya existe configuración para este libro
    let badgeConfig = await BadgeConfig.findOne({ libroId });

    if (badgeConfig) {
      // Actualizar existente
      badgeConfig.badgeName = badgeName || badgeConfig.badgeName;
      badgeConfig.badgeDescription =
        badgeDescription || badgeConfig.badgeDescription;
      badgeConfig.badgeIcon = badgeIcon || badgeConfig.badgeIcon;
      badgeConfig.hasQuiz =
        hasQuiz !== undefined ? hasQuiz : badgeConfig.hasQuiz;
      badgeConfig.questions = questions || badgeConfig.questions;

      await badgeConfig.save();

      console.log("Configuración actualizada:", badgeConfig._id);

      res.json({
        message: "Configuración actualizada correctamente",
        badgeConfig,
      });
    } else {
      // Crear nueva
      badgeConfig = new BadgeConfig({
        libroId,
        badgeName: badgeName || "Guerrero Lector",
        badgeDescription:
          badgeDescription ||
          "Insignia otorgada por completar el cuestionario perfectamente",
        badgeIcon: badgeIcon || "🏆",
        hasQuiz: hasQuiz || false,
        questions: questions || [],
      });

      await badgeConfig.save();

      console.log("Nueva configuración creada:", badgeConfig._id);

      res.status(201).json({
        message: "Configuración creada correctamente",
        badgeConfig,
      });
    }
  } catch (error) {
    console.error("Error al guardar configuración:", error);
    res.status(500).json({
      message: "Error al guardar la configuración",
      error: error.message,
    });
  }
};

// Obtener configuración de insignia por libro
const getBadgeConfigByBook = async (req, res) => {
  try {
    const { libroId } = req.params;

    if (!isValidObjectId(libroId)) {
      return res.status(400).json({ message: "ID de libro no válido" });
    }

    const badgeConfig = await BadgeConfig.findOne({ libroId }).populate(
      "libroId",
      "nombre descripcion"
    );

    if (!badgeConfig) {
      return res.json({
        hasConfig: false,
        message: "No hay configuración de cuestionario para este libro",
      });
    }

    res.json({
      hasConfig: true,
      badgeConfig,
    });
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ message: "Error al obtener configuración" });
  }
};

// Obtener todas las configuraciones (para listar)
const getAllBadgeConfigs = async (req, res) => {
  try {
    const configs = await BadgeConfig.find().populate(
      "libroId",
      "nombre imagen"
    );
    res.json(configs);
  } catch (error) {
    console.error("Error al obtener configuraciones:", error);
    res.status(500).json({ message: "Error al obtener configuraciones" });
  }
};

// Eliminar configuración de insignia
const deleteBadgeConfig = async (req, res) => {
  try {
    const { libroId } = req.params;

    if (!isValidObjectId(libroId)) {
      return res.status(400).json({ message: "ID de libro no válido" });
    }

    const badgeConfig = await BadgeConfig.findOneAndDelete({ libroId });

    if (!badgeConfig) {
      return res.status(404).json({ message: "Configuración no encontrada" });
    }

    res.json({ message: "Configuración eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar configuración:", error);
    res.status(500).json({ message: "Error al eliminar configuración" });
  }
};

export {
  saveBadgeConfig,
  getBadgeConfigByBook,
  getAllBadgeConfigs,
  deleteBadgeConfig,
};
