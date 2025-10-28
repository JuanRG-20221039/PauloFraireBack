import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 4,
        message: "Debe haber exactamente 4 opciones",
      },
    },
    correct: { type: Number, required: true, min: 0, max: 3 },
  },
  { _id: false }
);

const badgeConfigSchema = new mongoose.Schema(
  {
    libroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PdfsCC",
      required: true,
      unique: true, // una configuración por libro
      index: true,
    },
    badgeName: {
      type: String,
      required: true,
      default: "Guerrero Lector",
      trim: true,
    },
    badgeDescription: {
      type: String,
      required: true,
      default: "Insignia otorgada por completar el cuestionario perfectamente",
      trim: true,
    },
    badgeIcon: {
      type: String,
      default: "🏆",
      trim: true,
    },
    hasQuiz: { type: Boolean, default: false },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true }
);

const BadgeConfig = mongoose.model("BadgeConfig", badgeConfigSchema);
export default BadgeConfig;
