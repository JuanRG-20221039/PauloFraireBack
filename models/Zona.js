import mongoose from "mongoose";

const zonaSchema = new mongoose.Schema(
  {
    lugar: { type: String, required: true, trim: true },
    encargado: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Zona = mongoose.model("Zona", zonaSchema);

export default Zona;