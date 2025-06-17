//controllers/ofertaEducativaController.js
import EducationalOffer from "../models/OfertaEducativa.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

//---------------------------------------------------------------funcional
export const createEducationalOffer = async (req, res) => {
  try {
    const { title, description, maxCapacity } = req.body;

    // Validar que se haya subido una imagen
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Debes subir una imagen" });
    }

    // Subir la imagen a Cloudinary
    const imageFile = req.files.image[0];
    const imageResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          { folder: "educational-offers/images", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(imageFile.buffer);
    });

    // Subir los PDFs a Cloudinary
    const pdfFiles = req.files.pdfs || [];
    const pdfResults = await Promise.all(
      pdfFiles.map((file) => {
        if (!file.mimetype.includes("pdf")) {
          throw new Error(
            `El archivo ${file.originalname} no es un PDF válido`
          );
        }
        // Codificar el nombre en UTF-8
        const decodedName = Buffer.from(file.originalname, "latin1").toString(
          "utf8"
        );

        return new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
              {
                folder: "educational-offers/pdfs",
                resource_type: "auto",
                public_id: decodedName
                  .normalize("NFD") // Normaliza caracteres especiales
                  .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
                  .replace(/[^a-zA-Z0-9-_]/g, "_"), // Reemplaza caracteres no permitidos
              },
              (error, result) => {
                if (error) reject(error);
                else
                  resolve({
                    url: result.secure_url,
                    name: decodedName, // Guarda el nombre correctamente
                  });
              }
            )
            .end(file.buffer);
        });
      })
    );

    // Crear la oferta educativa en la base de datos
    const newOffer = new EducationalOffer({
      imageUrl: imageResult.secure_url, // URL de la imagen
      title,
      description,
      maxCapacity: maxCapacity || 30,
      pdfs: pdfResults.map((result) => ({
        url: result.url, // URL del PDF
        name: result.name, // Nombre original del PDF
      })),
    });

    await newOffer.save();

    res.status(201).json(newOffer);
  } catch (error) {
    console.error("Error al crear la oferta educativa:", error);
    res.status(500).json({ error: "Error al crear la oferta educativa" });
  }
};
// Obtener todas las ofertas educativas--------------------------funcional
export const getEducationalOffers = async (req, res) => {
  try {
    const offers = await EducationalOffer.find(); // Obtener todas las ofertas
    res.status(200).json(offers); // Enviar las ofertas como respuesta
  } catch (error) {
    console.error("Error al obtener las ofertas educativas:", error);
    res.status(500).json({ error: "Error al obtener las ofertas educativas" });
  }
};
// Editar una oferta educativa-----------------------------------funcional
export const updateEducationalOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, maxCapacity } = req.body;

    // Buscar la oferta en la base de datos
    const offer = await EducationalOffer.findById(id);
    if (!offer) {
      return res.status(404).json({ error: "Oferta educativa no encontrada" });
    }

    // Manejo de imagen (opcional)
    if (req.files && req.files.image) {
      // Eliminar imagen anterior de Cloudinary
      const publicId = offer.imageUrl.split("/").pop().split(".")[0]; // Extraer el public_id
      await cloudinary.v2.uploader.destroy(
        `educational-offers/images/${publicId}`
      );

      // Subir la nueva imagen a Cloudinary
      const imageFile = req.files.image[0];
      const imageResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            { folder: "educational-offers/images", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(imageFile.buffer);
      });

      offer.imageUrl = imageResult.secure_url;
    }

    // Manejo de PDFs (opcional)
    if (req.files && req.files.pdfs) {
      // Eliminar PDFs anteriores de Cloudinary
      for (const pdf of offer.pdfs) {
        const publicId = pdf.url.split("/").pop().split(".")[0]; // Extraer el public_id
        await cloudinary.v2.uploader.destroy(
          `educational-offers/pdfs/${publicId}`
        );
      }

      // Subir los nuevos PDFs
      const pdfFiles = req.files.pdfs;
      const pdfResults = await Promise.all(
        pdfFiles.map((file) => {
          if (!file.mimetype.includes("pdf")) {
            throw new Error(
              `El archivo ${file.originalname} no es un PDF válido`
            );
          }

          const decodedName = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
          );

          return new Promise((resolve, reject) => {
            cloudinary.v2.uploader
              .upload_stream(
                {
                  folder: "educational-offers/pdfs",
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

      offer.pdfs = pdfResults.map((result) => ({
        url: result.url,
        name: result.name,
      }));
    }

    // Actualizar los datos de la oferta
    offer.title = title || offer.title;
    offer.description = description || offer.description;
    offer.maxCapacity = maxCapacity || offer.maxCapacity;

    await offer.save();

    res.status(200).json(offer);
  } catch (error) {
    console.error("Error al actualizar la oferta educativa:", error);
    res.status(500).json({ error: "Error al actualizar la oferta educativa" });
  }
};

// Eliminar una oferta educativa---------------------------------funcional
export const deleteEducationalOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la oferta en la base de datos
    const offer = await EducationalOffer.findById(id);
    if (!offer) {
      return res.status(404).json({ error: "Oferta educativa no encontrada" });
    }

    // Eliminar la imagen de Cloudinary
    if (offer.imageUrl) {
      const publicId = offer.imageUrl.split("/").pop().split(".")[0]; // Extraer el public_id
      await cloudinary.v2.uploader.destroy(
        `educational-offers/images/${publicId}`
      );
    }

    // Eliminar los PDFs de Cloudinary
    if (offer.pdfs && offer.pdfs.length > 0) {
      for (const pdf of offer.pdfs) {
        const publicId = pdf.url.split("/").pop().split(".")[0]; // Extraer el public_id
        await cloudinary.v2.uploader.destroy(
          `educational-offers/pdfs/${publicId}`
        );
      }
    }

    // Eliminar la oferta de la base de datos
    await EducationalOffer.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Oferta educativa eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la oferta educativa:", error);
    res.status(500).json({ error: "Error al eliminar la oferta educativa" });
  }
};
//Obtener una oferta educativa por id----------------------------en prueba
export const getEducationalOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await EducationalOffer.findById(id);

    if (!offer) {
      return res.status(404).json({ msg: "Oferta educativa no encontrada" });
    }

    res.json(offer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener la oferta educativa" });
  }
};

// Inscribir un usuario a una oferta educativa
export const enrollUserInOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.usuario._id; // Obtener el ID del usuario autenticado

    // Verificar que la oferta educativa exista
    const offer = await EducationalOffer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Oferta educativa no encontrada" });
    }

    // Verificar que haya cupos disponibles
    if (offer.enrolledStudents.length >= offer.maxCapacity) {
      return res.status(400).json({ message: "No hay cupos disponibles en esta oferta educativa" });
    }

    // Verificar que el usuario exista
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario ya está inscrito en esta oferta
    if (offer.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: "El usuario ya está inscrito en esta oferta educativa" });
    }

    // Si el usuario ya tiene una oferta educativa seleccionada, desinscribirlo
    if (user.selectedEducationalOffer) {
      const previousOffer = await EducationalOffer.findById(user.selectedEducationalOffer);
      if (previousOffer) {
        // Eliminar al usuario de la lista de inscritos de la oferta anterior
        previousOffer.enrolledStudents = previousOffer.enrolledStudents.filter(
          (studentId) => studentId.toString() !== userId.toString()
        );
        await previousOffer.save();
      }
    }

    // Inscribir al usuario en la nueva oferta
    offer.enrolledStudents.push(userId);
    await offer.save();

    // Actualizar la oferta seleccionada en el perfil del usuario
    user.selectedEducationalOffer = offerId;
    await user.save();

    res.status(200).json({
      message: "Usuario inscrito correctamente en la oferta educativa",
      offer,
      user: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        selectedEducationalOffer: user.selectedEducationalOffer
      }
    });
  } catch (error) {
    console.error("Error al inscribir usuario en oferta educativa:", error);
    res.status(500).json({ message: "Error al inscribir usuario en oferta educativa" });
  }
};

// Desinscribir un usuario de una oferta educativa
export const unenrollUserFromOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.usuario._id; // Obtener el ID del usuario autenticado

    // Verificar que la oferta educativa exista
    const offer = await EducationalOffer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Oferta educativa no encontrada" });
    }

    // Verificar que el usuario exista
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario está inscrito en esta oferta
    if (!offer.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: "El usuario no está inscrito en esta oferta educativa" });
    }

    // Eliminar al usuario de la lista de inscritos
    offer.enrolledStudents = offer.enrolledStudents.filter(
      (studentId) => studentId.toString() !== userId.toString()
    );
    await offer.save();

    // Actualizar el perfil del usuario
    if (user.selectedEducationalOffer && user.selectedEducationalOffer.toString() === offerId) {
      user.selectedEducationalOffer = null;
      await user.save();
    }

    res.status(200).json({
      message: "Usuario desinscrito correctamente de la oferta educativa",
      offer
    });
  } catch (error) {
    console.error("Error al desinscribir usuario de oferta educativa:", error);
    res.status(500).json({ message: "Error al desinscribir usuario de oferta educativa" });
  }
};

// Obtener ofertas educativas disponibles (con cupos)
export const getAvailableEducationalOffers = async (req, res) => {
  try {
    const offers = await EducationalOffer.find();
    
    // Filtrar y añadir información de disponibilidad
    const availableOffers = offers.map(offer => {
      const availableSpots = offer.maxCapacity - offer.enrolledStudents.length;
      return {
        ...offer.toObject(),
        availableSpots,
        isFull: availableSpots <= 0
      };
    });

    res.status(200).json(availableOffers);
  } catch (error) {
    console.error("Error al obtener ofertas educativas disponibles:", error);
    res.status(500).json({ message: "Error al obtener ofertas educativas disponibles" });
  }
};
