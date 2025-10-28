import mongoose from "mongoose";

const userBadgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    libroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PdfsCC",
      required: true,
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
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Evitar duplicados por usuario y libro
userBadgeSchema.index({ userId: 1, libroId: 1 }, { unique: true });

const UserBadge = mongoose.model("UserBadge", userBadgeSchema);
export default UserBadge;
