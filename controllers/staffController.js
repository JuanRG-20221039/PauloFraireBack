import Staff from "../models/Staff.js";
import cloudinary from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

// Helper para subir imágenes a Cloudinary desde el buffer
const uploadImageFromBuffer = (file, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(file.buffer);
  });
};

// Obtener todo el personal
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un miembro del personal por ID
const getStaffById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id no válido" });
  }

  try {
    const member = await Staff.findById(id);
    if (!member) {
      return res
        .status(404)
        .json({ message: "Miembro del personal no encontrado" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo miembro del personal
const createStaff = async (req, res) => {
  const { name, lastName, position } = req.body;

  if (!name || !lastName || !position) {
    return res.status(400).json({ message: "Nombre, apellido y posición son requeridos" });
  }

  try {
    let photoUrl = "";
    let photoPublicId = "";

    // Si hay una foto, subirla a Cloudinary
    if (req.file) {
      const result = await uploadImageFromBuffer(req.file, {
        folder: "staff",
        width: 800,
        crop: "scale",
        public_id: `${name.replace(/\s+/g, "_")}_${lastName.replace(/\s+/g, "_")}`
      });
      photoUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    const newStaff = new Staff({
      name,
      lastName,
      position,
      photo: photoUrl,
      photo_public_id: photoPublicId
    });

    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el miembro del personal" });
  }
};

// Actualizar un miembro del personal
const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, lastName, position } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id no válido" });
  }

  try {
    const member = await Staff.findById(id);
    if (!member) {
      return res
        .status(404)
        .json({ message: "Miembro del personal no encontrado" });
    }

    // Si hay una nueva foto, subirla y eliminar la anterior
    if (req.file) {
      // Eliminar la foto anterior de Cloudinary si existe
      if (member.photo_public_id) {
        await cloudinary.uploader.destroy(member.photo_public_id);
      }

      // Subir la nueva foto
      const result = await uploadImageFromBuffer(req.file, {
        folder: "staff",
        width: 800,
        crop: "scale",
        public_id: `${
          name?.replace(/\s+/g, "_") || member.name.replace(/\s+/g, "_")
        }_${
          lastName?.replace(/\s+/g, "_") || member.lastName.replace(/\s+/g, "_")
        }`,
      });

      member.photo = result.secure_url;
      member.photo_public_id = result.public_id;
    }

    // Actualizar los campos de texto
    if (name) member.name = name;
    if (lastName) member.lastName = lastName;
    if (position) member.position = position;

    await member.save();
    res.json({ message: "Miembro del personal actualizado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el miembro del personal" });
  }
};

// Eliminar un miembro del personal
const deleteStaff = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id no válido" });
  }

  try {
    const member = await Staff.findById(id);
    if (!member) {
      return res
        .status(404)
        .json({ message: "Miembro del personal no encontrado" });
    }

    // Eliminar la foto de Cloudinary si existe
    if (member.photo_public_id) {
      await cloudinary.uploader.destroy(member.photo_public_id);
    }

    await Staff.findByIdAndDelete(id);
    res.json({ message: "Miembro del personal eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el miembro del personal" });
  }
};

export { getStaff, getStaffById, createStaff, updateStaff, deleteStaff };
