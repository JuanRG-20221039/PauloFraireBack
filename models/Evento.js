// Evento.js
import mongoose from "mongoose";

const ImagenSchema = new mongoose.Schema({
  url: { type: String, required: true },   // URL en la nube (ej. Cloudinary)
  name: { type: String, required: true },  // Nombre original del archivo
});

const EventoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Título del evento
    description: { type: String },           // Texto descriptivo opcional
    images: [ImagenSchema],                  // Arreglo de imágenes embebidas
  },
  { timestamps: true }
);

const Evento = mongoose.model("Eventos", EventoSchema);

export default Evento;
