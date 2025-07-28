import Institucional from "../models/Institucional.js";
import cloudinary from "../utils/cloudinary.js";

// Función para subir video en base64 a Cloudinary
async function uploadVideoBase64(buffer, mimetype) {
  const base64 = `data:${mimetype};base64,${buffer.toString("base64")}`;

  return await cloudinary.v2.uploader.upload(base64, {
    resource_type: "video",
    folder: "paulo_freire/videos",
    use_filename: true,
    unique_filename: false,
  });
}

// Obtener contenido actual
export const getInstitucional = async (req, res) => {
  try {
    const data = await Institucional.findOne().sort({ createdAt: -1 });
    if (!data) return res.status(404).json({ message: "No hay contenido" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear o actualizar contenido institucional
export const saveInstitucional = async (req, res) => {
  try {
    const {
      tituloPrincipal,
      subtitulo1,
      contenido1,
      subtitulo2,
      contenido2,
      subtitulo3,
      contenido3,
      subtitulo4,
      contenido4,
      videoTitulo,
    } = req.body;

    let cloudResult = null;

    if (req.file) {
      const allowed = ["video/mp4", "video/webm", "video/x-matroska"];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({ error: "Formato de video no permitido" });
      }

      if (req.file.size > 30 * 1024 * 1024) {
        return res.status(400).json({ error: "El archivo excede 30MB" });
      }

      // Buscar contenido existente para eliminar video previo en Cloudinary
      const existente = await Institucional.findOne();
      if (existente?.videoPublicId) {
        await cloudinary.v2.uploader.destroy(existente.videoPublicId, {
          resource_type: "video",
        });
      }

      // Subir video en base64 para evitar timeout de streams
      cloudResult = await uploadVideoBase64(req.file.buffer, req.file.mimetype);
    }

    const payload = {
      tituloPrincipal,
      subtitulo1,
      contenido1,
      subtitulo2,
      contenido2,
      subtitulo3,
      contenido3,
      subtitulo4,
      contenido4,
      videoTitulo: videoTitulo || cloudResult?.original_filename,
      videoUrl: cloudResult?.secure_url,
      videoPublicId: cloudResult?.public_id,
    };

    const existente = await Institucional.findOne();
    const data = existente
      ? await Institucional.findByIdAndUpdate(existente._id, payload, {
          new: true,
        })
      : await Institucional.create(payload);

    res.status(200).json({ message: "Guardado correctamente", data });
  } catch (error) {
    console.error("🔴 Error en saveInstitucional:", error);
    res.status(500).json({ error: "Error interno", details: error.message });
  }
};

// Eliminar contenido institucional
export const deleteInstitucional = async (req, res) => {
  try {
    const existente = await Institucional.findOne();
    if (!existente) return res.status(404).json({ message: "No encontrado" });

    if (existente.videoPublicId) {
      await cloudinary.v2.uploader.destroy(existente.videoPublicId, {
        resource_type: "video",
      });
    }

    await Institucional.deleteOne({ _id: existente._id });
    res.status(200).json({ message: "Contenido eliminado" });
  } catch (error) {
    console.error("🔴 Error al eliminar institucional:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar", details: error.message });
  }
};
