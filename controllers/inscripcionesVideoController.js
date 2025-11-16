import InscripcionesVideo from "../models/InscripcionesVideo.js";
import cloudinary from "../utils/cloudinary.js";

const uploadVideoStream = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        { folder: "inscripciones", resource_type: "video" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(file.buffer);
  });
};

export const getInscripcionesVideo = async (req, res) => {
  try {
    const doc = await InscripcionesVideo.findOne();
    res.json(doc || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInscripcionesVideo = async (req, res) => {
  try {
    const exists = await InscripcionesVideo.findOne();
    if (exists) return res.status(400).json({ error: "Ya existe" });

    const file = req.file;
    if (!file) return res.status(400).json({ error: "Sin video" });
    const allowed = ["video/mp4", "video/webm", "video/x-matroska"];
    if (!allowed.includes(file.mimetype)) {
      return res.status(400).json({ error: "Formato no permitido" });
    }
    if (file.size > 30 * 1024 * 1024) {
      return res.status(400).json({ error: "Excede 30MB" });
    }

    const result = await uploadVideoStream(file);
    const doc = await InscripcionesVideo.create({
      videoUrl: result.secure_url,
      videoPublicId: result.public_id,
    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInscripcionesVideo = async (req, res) => {
  try {
    const doc = await InscripcionesVideo.findOne();
    if (!doc) return res.status(404).json({ error: "No existe" });

    const file = req.file;
    if (!file) return res.status(400).json({ error: "Sin video" });
    const allowed = ["video/mp4", "video/webm", "video/x-matroska"];
    if (!allowed.includes(file.mimetype)) {
      return res.status(400).json({ error: "Formato no permitido" });
    }
    if (file.size > 30 * 1024 * 1024) {
      return res.status(400).json({ error: "Excede 30MB" });
    }

    if (doc.videoPublicId) {
      try {
        await cloudinary.v2.uploader.destroy(doc.videoPublicId, { resource_type: "video" });
      } catch (_) {}
    }

    const result = await uploadVideoStream(file);
    doc.videoUrl = result.secure_url;
    doc.videoPublicId = result.public_id;
    await doc.save();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInscripcionesVideo = async (req, res) => {
  try {
    const doc = await InscripcionesVideo.findOne();
    if (!doc) return res.status(404).json({ error: "No existe" });

    if (doc.videoPublicId) {
      try {
        await cloudinary.v2.uploader.destroy(doc.videoPublicId, { resource_type: "video" });
      } catch (_) {}
    }
    await InscripcionesVideo.deleteMany({});
    res.json({ message: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};