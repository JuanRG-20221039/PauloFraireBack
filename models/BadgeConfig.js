// models/BadgeConfig.js
import mongoose from "mongoose";

const badgeConfigSchema = mongoose.Schema(
  {
    libroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PdfsCC",
      required: true,
      unique: true, // Solo una configuración por libro
      index: true,
    },
    badgeName: {
      type: String,
      required: true,
      default: "Guerrero Lector",
    },
    badgeDescription: {
      type: String,
      required: true,
      default: "Insignia otorgada por completar el cuestionario perfectamente",
    },
    badgeIcon: {
      type: String,
      default: "🏆",
    },
    hasQuiz: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: [
        {
          question: {
            type: String,
            required: true,
          },
          options: {
            type: [String],
            required: true,
            validate: {
              validator: function (v) {
                return v.length === 4;
              },
              message: "Debe haber exactamente 4 opciones",
            },
          },
          correct: {
            type: Number,
            required: true,
            min: 0,
            max: 3,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const BadgeConfig = mongoose.model("BadgeConfig", badgeConfigSchema);

export default BadgeConfig;
