import mongoose from "mongoose";

const InstitucionalSchema = new mongoose.Schema(
  {
    tituloPrincipal: { type: String, required: true },
    subtitulo1: String,
    contenido1: String,
    subtitulo2: String,
    contenido2: String,
    subtitulo3: String,
    contenido3: String,
    subtitulo4: String,
    contenido4: String,
    videoTitulo: String,
    videoUrl: String,
    videoPublicId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Institucional", InstitucionalSchema);
