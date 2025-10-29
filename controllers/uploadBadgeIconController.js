// controllers/uploadBadgeIconController.js
import cloudinary from "../utils/cloudinary.js";

export const uploadBadgeIcon = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Debes subir un archivo de imagen (icon)" });
    }

    const file = req.file;

    // Valida mimetype
    if (!/^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Formato inválido. Usa PNG, JPG, WEBP, GIF o SVG." });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            folder: "badge-icons", // carpeta en Cloudinary
            resource_type: "image", // fuerza image
          },
          (error, out) => (error ? reject(error) : resolve(out))
        )
        .end(file.buffer);
    });

    // Devuelve URL segura
    return res.status(201).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (e) {
    console.error("Error al subir icono de insignia:", e);
    return res.status(500).json({ message: "Error al subir icono" });
  }
};
