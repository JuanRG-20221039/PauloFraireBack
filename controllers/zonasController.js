import Zona from "../models/Zona.js";
import { isValidObjectId } from "mongoose";

// Obtener todas las zonas
const getZonas = async (req, res) => {
  try {
    const zonas = await Zona.find().sort({ createdAt: -1 });
    res.json(zonas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener zonas" });
  }
};

// Obtener una zona por ID
const getZonaById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id no válido" });
  }
  try {
    const zona = await Zona.findById(id);
    if (!zona) return res.status(404).json({ message: "Zona no encontrada" });
    res.json(zona);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la zona" });
  }
};

// Crear una nueva zona
const createZona = async (req, res) => {
  const { lugar, encargado, telefono } = req.body;
  if (!lugar || !encargado || !telefono) {
    return res
      .status(400)
      .json({ message: "Lugar, encargado y teléfono son requeridos" });
  }
  try {
    const nueva = new Zona({ lugar, encargado, telefono });
    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la zona" });
  }
};

// Actualizar una zona
const updateZona = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id no válido" });
  }
  try {
    const zona = await Zona.findById(id);
    if (!zona) return res.status(404).json({ message: "Zona no encontrada" });
    const { lugar, encargado, telefono } = req.body;
    if (lugar) zona.lugar = lugar;
    if (encargado) zona.encargado = encargado;
    if (telefono) zona.telefono = telefono;
    await zona.save();
    res.json({ message: "Zona actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la zona" });
  }
};

// Eliminar una zona
const deleteZona = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id no válido" });
  }
  try {
    const zona = await Zona.findById(id);
    if (!zona) return res.status(404).json({ message: "Zona no encontrada" });
    await Zona.findByIdAndDelete(id);
    res.json({ message: "Zona eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la zona" });
  }
};

export { getZonas, getZonaById, createZona, updateZona, deleteZona };
