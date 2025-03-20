//InformacionBecas.js
import mongoose from "mongoose";

const InformacionBecasSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
  },
  { timestamps: true }
);

const InformacionBecas = mongoose.model("InformacionBecas", InformacionBecasSchema);

export default InformacionBecas;
