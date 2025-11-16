import mongoose from "mongoose";

const InscripcionesVideoSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    videoPublicId: { type: String, required: true },
  },
  { timestamps: true }
);

const InscripcionesVideo = mongoose.model(
  "InscripcionesVideo",
  InscripcionesVideoSchema
);

export default InscripcionesVideo;