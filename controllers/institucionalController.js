import Institucional from "../models/Institucional.js";
import cloudinary from "../utils/cloudinary.js";
import { PassThrough } from "stream";

// Subir video usando stream
async function uploadVideoStream(buffer, mimetype) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "paulo_freire/videos",
        use_filename: true,
        unique_filename: false,
        timeout: 300000, // 300 segundos (5 minutos)
      },
      (error, result) => {
        if (error) {
          if (error.http_code === 499) {
            return reject(
              new Error(
                "Tiempo de espera agotado al subir el video a Cloudinary. Intenta con un archivo más pequeño o una conexión más rápida."
              )
            );
          }
          return reject(error);
        }
        resolve(result);
      }
    );

    const bufferStream = new PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(stream);
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
      removeVideo, // Nuevo campo para eliminar video
    } = req.body;

    let cloudResult = null;

    // Validar video al crear nuevo contenido
    const existente = await Institucional.findOne();
    if (!existente && !req.file) {
      return res
        .status(400)
        .json({ error: "Debes incluir un video al crear contenido" });
    }

    if (req.file) {
      const allowed = ["video/mp4", "video/webm", "video/x-matroska"];
      if (!allowed.includes(req.file.mimetype)) {
        return res
          .status(400)
          .json({
            error: "Formato de video no permitido. Usa MP4, WebM o MKV.",
          });
      }

      if (req.file.size > 30 * 1024 * 1024) {
        return res.status(400).json({ error: "El archivo excede 30MB." });
      }

      // Eliminar video previo en Cloudinary si existe
      if (existente?.videoPublicId) {
        await cloudinary.v2.uploader.destroy(existente.videoPublicId, {
          resource_type: "video",
        });
      }

      // Subir video usando stream
      cloudResult = await uploadVideoStream(req.file.buffer, req.file.mimetype);
    } else if (removeVideo === "true" && existente?.videoPublicId) {
      // Eliminar video actual si removeVideo es true
      await cloudinary.v2.uploader.destroy(existente.videoPublicId, {
        resource_type: "video",
      });
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
    };

    // Actualizar video solo si se subió uno nuevo o se eliminó el actual
    if (cloudResult) {
      payload.videoUrl = cloudResult.secure_url;
      payload.videoPublicId = cloudResult.public_id;
    } else if (removeVideo === "true") {
      payload.videoUrl = null;
      payload.videoPublicId = null;
    }

    const data = existente
      ? await Institucional.findByIdAndUpdate(existente._id, payload, {
          new: true,
        })
      : await Institucional.create(payload);

    res.status(200).json({ message: "Guardado correctamente", data });
  } catch (error) {
    console.error("🔴 Error en saveInstitucional:", error);
    if (error.message.includes("Tiempo de espera agotado al subir el video")) {
      return res.status(500).json({ error: error.message });
    }
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
