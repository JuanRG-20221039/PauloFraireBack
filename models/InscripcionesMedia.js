import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const InscripcionesMediaSchema = new mongoose.Schema(
  {
    images: { type: [ImageSchema], default: [] },
    videoUrl: { type: String, default: null },
    videoPublicId: { type: String, default: null },
  },
  { timestamps: true }
);

const InscripcionesMedia = mongoose.model(
  "InscripcionesMedia",
  InscripcionesMediaSchema
);

export default InscripcionesMedia;