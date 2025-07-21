import HistoryCulture from "../models/HistoryCulture.js";
import cloudinary from "../utils/cloudinary.js";
import Logo from "../models/Logo.js";

// Crear introducción general
export const createIntroduction = async (req, res) => {
  try {
    const { mainTitle, mainAuthor, paragraphs } = req.body;

    const existingDoc = await HistoryCulture.findOne();

    if (existingDoc) {
      const isIntroductionEmpty =
        !existingDoc.mainTitle.trim() &&
        !existingDoc.mainAuthor.trim() &&
        (!existingDoc.introduction ||
          !Array.isArray(existingDoc.introduction.paragraphs) ||
          existingDoc.introduction.paragraphs.length === 0 ||
          existingDoc.introduction.paragraphs.every((p) => !p.trim()));

      if (!isIntroductionEmpty) {
        return res
          .status(400)
          .json({ msg: "Ya existe una introducción registrada" });
      }

      // ✅ Sobrescribir la introducción existente (vacía)
      existingDoc.mainTitle = mainTitle;
      existingDoc.mainAuthor = mainAuthor;
      existingDoc.introduction = { paragraphs };

      await existingDoc.save();
      return res.status(201).json(existingDoc);
    }

    // ✅ Si no hay documento, crearlo desde cero
    const newDoc = new HistoryCulture({
      mainTitle,
      mainAuthor,
      introduction: { paragraphs },
      stories: [],
    });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    console.error("Error al crear introducción:", error);
    res.status(500).json({ msg: "Error al crear introducción" });
  }
};
// Obtener introducción general
export const getIntroduction = async (req, res) => {
  try {
    const doc = await HistoryCulture.findOne().select(
      "mainTitle mainAuthor introduction"
    );
    if (!doc) {
      return res.status(404).json({ msg: "No se encontró introducción" });
    }
    res.json(doc);
  } catch (error) {
    console.error("Error al obtener introducción:", error);
    res.status(500).json({ msg: "Error al obtener introducción" });
  }
};

// Editar introducción general
export const updateIntroduction = async (req, res) => {
  try {
    const { mainTitle, mainAuthor, paragraphs } = req.body;

    const doc = await HistoryCulture.findOne();
    if (!doc) {
      return res.status(404).json({ msg: "No hay introducción para editar" });
    }

    if (mainTitle) doc.mainTitle = mainTitle;
    if (mainAuthor) doc.mainAuthor = mainAuthor;
    if (paragraphs) doc.introduction.paragraphs = paragraphs;

    await doc.save();

    res
      .status(200)
      .json({ msg: "Introducción actualizada correctamente", data: doc });
  } catch (error) {
    console.error("Error al actualizar introducción:", error);
    res.status(500).json({ msg: "Error al actualizar introducción" });
  }
};

// Eliminar introducción general y todas las historias
export const deleteIntroductionTODO = async (req, res) => {
  try {
    const doc = await HistoryCulture.findOne();
    if (!doc) {
      return res.status(404).json({ msg: "No hay introducción para eliminar" });
    }

    await HistoryCulture.findByIdAndDelete(doc._id);

    res
      .status(200)
      .json({ msg: "Introducción y sus historias eliminadas correctamente" });
  } catch (error) {
    console.error("Error al eliminar introducción:", error);
    res.status(500).json({ msg: "Error al eliminar introducción" });
  }
};

// Limpiar/eliminar solo la introducción general sin tocar las historias
export const deleteIntroductionSINHISTORY = async (req, res) => {
  try {
    const doc = await HistoryCulture.findOne();
    if (!doc) {
      return res.status(404).json({ msg: "No hay introducción para eliminar" });
    }

    // Limpiar campos de introducción
    doc.mainTitle = "";
    doc.mainAuthor = "";
    doc.introduction.paragraphs = [];

    await doc.save();

    res.status(200).json({
      msg: "Introducción eliminada correctamente (historias intactas)",
    });
  } catch (error) {
    console.error("Error al eliminar introducción:", error);
    res.status(500).json({ msg: "Error al eliminar introducción" });
  }
};

// Agregar una historia
export const addStory = async (req, res) => {
  try {
    //const { title, author, paragraphs } = req.body;
    const { title, author } = req.body;
    let { paragraphs } = req.body;
    if (typeof paragraphs === "string") {
      try {
        paragraphs = JSON.parse(paragraphs);
      } catch {
        paragraphs = [];
      }
    }

    const images = req.files?.images || [];
    const uploadedImages = await Promise.all(
      images.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.v2.uploader
              .upload_stream(
                { folder: "historia-cultura/images", resource_type: "image" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }
              )
              .end(file.buffer);
          })
      )
    );

    const historyDoc = await HistoryCulture.findOne();
    if (!historyDoc) {
      return res
        .status(404)
        .json({ msg: "Debes crear primero la introducción general" });
    }

    const newStory = {
      title,
      author,
      paragraphs,
      images: uploadedImages,
    };

    historyDoc.stories.push(newStory);
    await historyDoc.save();

    res.status(201).json(historyDoc.stories.at(-1)); // Última agregada
  } catch (error) {
    console.error("Error al agregar historia:", error);
    res.status(500).json({ msg: "Error al agregar historia" });
  }
};

// Obtener todas las historias
export const getStories = async (req, res) => {
  try {
    const doc = await HistoryCulture.findOne().select("stories");
    if (!doc)
      return res.status(404).json({ msg: "No se encontraron historias" });

    res.json(doc.stories);
  } catch (error) {
    console.error("Error al obtener historias:", error);
    res.status(500).json({ msg: "Error al obtener historias" });
  }
};

// Editar una historia por ID interno (story._id)
export const updateStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { title, author } = req.body;
    let { paragraphs } = req.body;

    if (typeof paragraphs === "string") {
      try {
        paragraphs = JSON.parse(paragraphs);
      } catch {
        paragraphs = [];
      }
    }

    const doc = await HistoryCulture.findOne();
    if (!doc)
      return res.status(404).json({ msg: "Documento base no encontrado" });

    const index = doc.stories.findIndex(
      (story) => story._id.toString() === storyId
    );

    if (index === -1)
      return res.status(404).json({ msg: "Historia no encontrada" });

    // 1️⃣ Eliminar imágenes anteriores si se suben nuevas
    if (req.files?.images?.length && doc.stories[index].images?.length) {
      for (const imageUrl of doc.stories[index].images) {
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          await cloudinary.v2.uploader.destroy(publicId, {
            resource_type: "image",
          });
        }
      }
    }

    // 2️⃣ Subir nuevas imágenes si se proporcionan
    if (req.files?.images?.length) {
      const uploadedImages = await Promise.all(
        req.files.images.map(
          (file) =>
            new Promise((resolve, reject) => {
              cloudinary.v2.uploader
                .upload_stream(
                  {
                    folder: "historia-cultura/images",
                    resource_type: "image",
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                  }
                )
                .end(file.buffer);
            })
        )
      );
      doc.stories[index].images = uploadedImages;
    }

    // 3️⃣ Actualizar campos textuales
    if (title) doc.stories[index].title = title;
    if (author) doc.stories[index].author = author;
    if (paragraphs) doc.stories[index].paragraphs = paragraphs;

    await doc.save();

    res.status(200).json(doc.stories[index]);
  } catch (error) {
    console.error("Error al actualizar historia:", error);
    res.status(500).json({ msg: "Error al actualizar historia" });
  }
};

// Eliminar historia
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const doc = await HistoryCulture.findOne();
    if (!doc)
      return res.status(404).json({ msg: "Documento base no encontrado" });

    const index = doc.stories.findIndex(
      (story) => story._id.toString() === storyId
    );

    if (index === -1)
      return res.status(404).json({ msg: "Historia no encontrada" });

    const story = doc.stories[index];

    // Eliminar imágenes de Cloudinary si existen
    if (story.images && story.images.length > 0) {
      for (const imageUrl of story.images) {
        const publicId = extractPublicIdFromUrl(imageUrl);
        console.log("Public ID para borrar:", publicId); // DEBUG

        if (publicId) {
          // Importante resource_type: 'image'
          await cloudinary.v2.uploader.destroy(
            publicId,
            { resource_type: "image" },
            (error, result) => {
              if (error) {
                console.error("Error eliminando imagen en Cloudinary:", error);
              } else {
                console.log("Resultado eliminación Cloudinary:", result);
              }
            }
          );
        } else {
          console.warn("No se pudo extraer public_id de URL:", imageUrl);
        }
      }
    }

    // Eliminar la historia del array
    doc.stories.splice(index, 1);
    await doc.save();

    res
      .status(200)
      .json({ msg: "Historia e imágenes eliminadas correctamente" });
  } catch (error) {
    console.error("Error al eliminar historia:", error);
    res.status(500).json({ msg: "Error al eliminar historia" });
  }
};

// Función auxiliar para extraer el public_id completo desde la URL de Cloudinary
const extractPublicIdFromUrl = (url) => {
  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1 || uploadIndex + 1 >= urlParts.length) return null;

    const pathParts = urlParts.slice(uploadIndex + 1); // ej: ['v1752681801', 'historia-cultura', 'images', 'xxxx.png']
    // La versión (v1752681801) está incluida, debes saltarla
    if (pathParts[0].startsWith("v")) pathParts.shift(); // quitar versión

    const lastPart = pathParts.pop(); // 'xxxx.png'
    const publicIdWithoutExt = lastPart.split(".")[0]; // 'xxxx'
    const fullPublicId = [...pathParts, publicIdWithoutExt].join("/"); // 'historia-cultura/images/xxxx'

    return fullPublicId;
  } catch {
    return null;
  }
};
