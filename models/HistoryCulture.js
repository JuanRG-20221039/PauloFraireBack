import mongoose from "mongoose";

// Subdocumento para una historia individual
const StorySchema = new mongoose.Schema({
  title: { type: String, required: false },
  author: { type: String, required: false },
  paragraphs: [{ type: String, required: false }], // Uno o más párrafos
  images: [{ type: String }], // URLs de imágenes (pueden ser varias o ninguna)
});

// Modelo principal: Historia y Cultura General
const HistoryCultureSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, required: false }, // Título principal
    mainAuthor: { type: String, required: false }, // Autor principal
    introduction: {
      paragraphs: [{ type: String, required: false }], // Array para manejar múltiples párrafos de introducción
    },
    stories: [StorySchema], // Arreglo de historias embebidas
  },
  { timestamps: true }
);

const HistoryCulture = mongoose.model("HistoryCulture", HistoryCultureSchema);

export default HistoryCulture;
