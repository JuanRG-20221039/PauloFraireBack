import mongoose from "mongoose";

const InscripcionesImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

const InscripcionesImage = mongoose.model(
  "InscripcionesImage",
  InscripcionesImageSchema
);

export default InscripcionesImage;