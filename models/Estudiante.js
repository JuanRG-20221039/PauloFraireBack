import mongoose from "mongoose";

const MateriasSchema = new mongoose.Schema({
  elementosComputacion: { type: Number, default: null },
  programacion: { type: Number, default: null },
  algoritmos: { type: Number, default: null },
  basesDatos: { type: Number, default: null },
  arquitecturaComputadoras: { type: Number, default: null },
  paradigmas: { type: Number, default: null },
  sistemasOperativos: { type: Number, default: null },
}, { _id: false });

const EstudianteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },

    promedioFinal: { type: Number, required: true },
    promedioRedondeado: { type: Number, required: true },
    desempeno: { type: String, required: true, enum: ["bajo", "medio", "alto"] },

    asistenciasPsicologia: { type: Number, default: null },
    estadoEmocional: { type: String, default: null, enum: ["BAJO", "MEDIO", "ALTO", null] },
    esRecursador: { type: Boolean, default: null },
    seDioDeBaja: { type: Boolean, default: null },

    materias: { type: MateriasSchema, default: () => ({}) }
  },
  { timestamps: true }
);

const Estudiante = mongoose.model("Estudiante", EstudianteSchema);

export default Estudiante;
