import multer from "multer";

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Aumentar límite a 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("pdf") || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Formato de archivo no permitido"), false);
    }
  },
});

export default upload;
