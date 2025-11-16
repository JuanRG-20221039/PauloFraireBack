// controllers/eventoController.js
import Evento from "../models/Evento.js";
import cloudinary from "../utils/cloudinary.js";

// Crear evento
export const createEvento = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.files || !req.files.images) {
      return res.status(400).json({ error: "Debes subir al menos una imagen" });
    }

    // Subir todas las imágenes a Cloudinary
    const imageFiles = req.files.images;
    const imageResults = await Promise.all(
      imageFiles.map((file) => {
        const decodedName = Buffer.from(file.originalname, "latin1").toString("utf8");

        return new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
              {
                folder: "imgEventos",
                resource_type: "auto",
                public_id: decodedName
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-zA-Z0-9-_]/g, "_"),
              },
              (error, result) => {
                if (error) reject(error);
                else resolve({ url: result.secure_url, name: decodedName });
              }
            )
            .end(file.buffer);
        });
      })
    );

    const newEvento = new Evento({
      title,
      description,
      images: imageResults,
    });

    await newEvento.save();

    res.status(201).json(newEvento);
  } catch (error) {
    console.error("Error al crear el evento:", error);
    res.status(500).json({ error: "Error al crear el evento" });
  }
};

// Obtener todos los eventos
export const getEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.status(200).json(eventos);
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    res.status(500).json({ error: "Error al obtener los eventos" });
  }
};

// Obtener un evento por ID
export const getEventoById = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findById(id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    res.json(evento);
  } catch (error) {
    console.error("Error al obtener el evento:", error);
    res.status(500).json({ error: "Error al obtener el evento" });
  }
};

// Actualizar evento
export const updateEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const evento = await Evento.findById(id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    // Si hay nuevas imágenes
    if (req.files && req.files.images) {
      // Subir nuevas imágenes
      const imageFiles = req.files.images;
      const imageResults = await Promise.all(
        imageFiles.map((file) => {
          const decodedName = Buffer.from(file.originalname, "latin1").toString("utf8");

          return new Promise((resolve, reject) => {
            cloudinary.v2.uploader
              .upload_stream(
                {
                  folder: "imgEventos",
                  resource_type: "auto",
                  public_id: decodedName
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-zA-Z0-9-_]/g, "_"),
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve({ url: result.secure_url, name: decodedName });
                }
              )
              .end(file.buffer);
          });
        })
      );

      // Combinar imágenes existentes con nuevas
      evento.images = [...evento.images, ...imageResults];
    }

    // Actualizar datos básicos
    evento.title = title || evento.title;
    evento.description = description || evento.description;

    await evento.save();

    res.status(200).json(evento);
  } catch (error) {
    console.error("Error al actualizar el evento:", error);
    res.status(500).json({ error: "Error al actualizar el evento" });
  }
};

// Eliminar evento
export const deleteEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findById(id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    // Eliminar imágenes de Cloudinary
    if (evento.images && evento.images.length > 0) {
      for (const img of evento.images) {
        const publicId = img.url.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(`imgEventos/${publicId}`);
      }
    }

    await Evento.findByIdAndDelete(id);

    res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
    res.status(500).json({ error: "Error al eliminar el evento" });
  }
};

// Eliminar una imagen individual de un evento
export const deleteImageEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const evento = await Evento.findById(id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    // Obtener el public_id de la imagen a partir de la URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    // Eliminar la imagen de Cloudinary
    await cloudinary.v2.uploader.destroy(`imgEventos/${publicId}`);

    // Filtrar la imagen a eliminar de la base de datos
    evento.images = evento.images.filter((img) => img.url !== imageUrl);

    await evento.save();

    res.status(200).json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la imagen del evento:", error);
    res.status(500).json({ error: "Error al eliminar la imagen del evento" });
  }
};
