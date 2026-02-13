import InscripcionesImage from "../models/InscripcionesImage.js";
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

export const getInscripcionesImages = async (req, res) => {
  try {
    const images = await InscripcionesImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addInscripcionesImages = async (req, res) => {
  try {
    const files = req.files?.images || [];
    if (!files.length) return res.status(400).json({ error: "Sin imágenes" });

    const created = [];
    for (const file of files) {
      const result = await uploadImageStream(file);
      const doc = await InscripcionesImage.create({
        url: result.secure_url,
        publicId: result.public_id,
      });
      created.push(doc);
    }

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInscripcionesImages = async (req, res) => {
  try {
    const { imagesToDelete } = req.body;
    const files = req.files?.images || [];

    let toDelete = [];
    if (typeof imagesToDelete === "string") {
      try {
        toDelete = JSON.parse(imagesToDelete);
      } catch {
        toDelete = [];
      }
    } else if (Array.isArray(imagesToDelete)) {
      toDelete = imagesToDelete;
    }

    if (toDelete.length) {
      for (const publicId of toDelete) {
        try {
          await cloudinary.v2.uploader.destroy(publicId, {
            resource_type: "image",
          });
        } catch (_) {}
        await InscripcionesImage.findOneAndDelete({ publicId });
      }
    }

    const created = [];
    for (const file of files) {
      const result = await uploadImageStream(file);
      const doc = await InscripcionesImage.create({
        url: result.secure_url,
        publicId: result.public_id,
      });
      created.push(doc);
    }

    const images = await InscripcionesImage.find().sort({ createdAt: -1 });
    res.json({ deleted: toDelete.length, added: created.length, images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllInscripcionesImages = async (req, res) => {
  try {
    const all = await InscripcionesImage.find();
    for (const img of all) {
      try {
        await cloudinary.v2.uploader.destroy(img.publicId, {
          resource_type: "image",
        });
      } catch (_) {}
    }
    await InscripcionesImage.deleteMany({});
    res.json({ message: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
