import InscripcionesMedia from "../models/InscripcionesMedia.js";
import cloudinary from "../utils/cloudinary.js";

const uploadImageStream = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        { folder: "inscripciones", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(file.buffer);
  });
};

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

export const getInscripcionesMedia = async (req, res) => {
  try {
    const doc = await InscripcionesMedia.findOne();
    if (!doc) return res.json({ images: [], videoUrl: null });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInscripcionesMedia = async (req, res) => {
  try {
    const exists = await InscripcionesMedia.findOne();
    if (exists) return res.status(400).json({ error: "Ya existe" });

    const imagesFiles = req.files?.images || [];
    const videoFiles = req.files?.video || [];

    if (videoFiles.length > 1)
      return res.status(400).json({ error: "Solo se permite un video" });

    const images = [];
    for (const file of imagesFiles) {
      const result = await uploadImageStream(file);
      images.push({ url: result.secure_url, publicId: result.public_id });
    }

    let videoUrl = null;
    let videoPublicId = null;
    if (videoFiles.length === 1) {
      const video = videoFiles[0];
      const allowed = ["video/mp4", "video/webm", "video/x-matroska"];
      if (!allowed.includes(video.mimetype)) {
        return res.status(400).json({ error: "Formato de video no permitido" });
      }
      if (video.size > 30 * 1024 * 1024) {
        return res.status(400).json({ error: "El archivo excede 30MB" });
      }
      const result = await uploadVideoStream(video);
      videoUrl = result.secure_url;
      videoPublicId = result.public_id;
    }

    const doc = await InscripcionesMedia.create({ images, videoUrl, videoPublicId });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInscripcionesMedia = async (req, res) => {
  try {
    let doc = await InscripcionesMedia.findOne();
    if (!doc) return res.status(404).json({ error: "No existe" });

    const imagesFiles = req.files?.images || [];
    const videoFiles = req.files?.video || [];
    const { imagesToDelete } = req.body;

    let imagesToDeleteArray = [];
    if (typeof imagesToDelete === "string") {
      try {
        imagesToDeleteArray = JSON.parse(imagesToDelete);
      } catch {
        imagesToDeleteArray = [];
      }
    } else if (Array.isArray(imagesToDelete)) {
      imagesToDeleteArray = imagesToDelete;
    }

    if (imagesToDeleteArray.length) {
      for (const publicId of imagesToDeleteArray) {
        try {
          await cloudinary.v2.uploader.destroy(publicId, { resource_type: "image" });
        } catch (_) {}
      }
      doc.images = doc.images.filter((img) => !imagesToDeleteArray.includes(img.publicId));
    }

    if (imagesFiles.length) {
      for (const file of imagesFiles) {
        const result = await uploadImageStream(file);
        doc.images.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    if (videoFiles.length > 1)
      return res.status(400).json({ error: "Solo se permite un video" });

    if (videoFiles.length === 1) {
      if (doc.videoPublicId) {
        try {
          await cloudinary.v2.uploader.destroy(doc.videoPublicId, { resource_type: "video" });
        } catch (_) {}
      }
      const video = videoFiles[0];
      const allowed = ["video/mp4", "video/webm", "video/x-matroska"];
      if (!allowed.includes(video.mimetype)) {
        return res.status(400).json({ error: "Formato de video no permitido" });
      }
      if (video.size > 30 * 1024 * 1024) {
        return res.status(400).json({ error: "El archivo excede 30MB" });
      }
      const result = await uploadVideoStream(video);
      doc.videoUrl = result.secure_url;
      doc.videoPublicId = result.public_id;
    }

    await doc.save();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInscripcionesMedia = async (req, res) => {
  try {
    const doc = await InscripcionesMedia.findOne();
    if (!doc) return res.status(404).json({ error: "No existe" });

    for (const img of doc.images) {
      try {
        await cloudinary.v2.uploader.destroy(img.publicId, { resource_type: "image" });
      } catch (_) {}
    }

    if (doc.videoPublicId) {
      try {
        await cloudinary.v2.uploader.destroy(doc.videoPublicId, { resource_type: "video" });
      } catch (_) {}
    }

    await InscripcionesMedia.deleteMany({});
    res.json({ message: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};