import Estudiante from '../models/Estudiante.js';  // Ajusta la ruta según tu estructura

// Crear un nuevo estudiante
export const createEstudiante = async (req, res) => {
  try {
    const nuevoEstudiante = new Estudiante(req.body);
    const savedEstudiante = await nuevoEstudiante.save();
    res.status(201).json(savedEstudiante);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los estudiantes
export const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.find();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un estudiante por ID
export const getEstudianteById = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un estudiante por ID
export const updateEstudiante = async (req, res) => {
  try {
    const updatedEstudiante = await Estudiante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEstudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.json(updatedEstudiante);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un estudiante por ID
export const deleteEstudiante = async (req, res) => {
  try {
    const deletedEstudiante = await Estudiante.findByIdAndDelete(req.params.id);
    if (!deletedEstudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
