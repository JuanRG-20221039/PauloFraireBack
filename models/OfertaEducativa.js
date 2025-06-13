import mongoose from "mongoose";

const PdfSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
});

const EducationalOfferSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true }, // URL de Cloudinary
    title: { type: String, required: true },
    description: { type: String, required: true },
    pdfs: [PdfSchema], // PDFs embebidos
    maxCapacity: { type: Number, required: true, default: 30 }, // Cupo máximo de alumnos
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // IDs de alumnos inscritos
  },
  { timestamps: true }
);

const EducationalOffer = mongoose.model(
  "EducationalOffer",
  EducationalOfferSchema
);

export default EducationalOffer;
