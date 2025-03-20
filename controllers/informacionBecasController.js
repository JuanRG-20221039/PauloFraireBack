//informacionBecasController.js
import InformacionBecas from "../models/InformacionBecas.js";

// Obtener la información de becas
export const getInformacionBecas = async (req, res) => {
  try {
    const informacion = await InformacionBecas.findOne();
    res.status(200).json(informacion);
  } catch (error) {
    console.error("Error al obtener la información de becas:", error);
    res.status(500).json({ error: "Error al obtener la información de becas" });
  }
};

// Actualizar la información de becas (solo título y descripción)
export const updateInformacionBecas = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

    let informacion = await InformacionBecas.findOne();

    if (!informacion) {
      informacion = new InformacionBecas({ titulo, descripcion });
    } else {
      informacion.titulo = titulo || informacion.titulo;
      informacion.descripcion = descripcion || informacion.descripcion;
    }

    await informacion.save();
    res.status(200).json(informacion);
  } catch (error) {
    console.error("Error al actualizar la información de becas:", error);
    res.status(500).json({ error: "Error al actualizar la información de becas" });
  }
};
