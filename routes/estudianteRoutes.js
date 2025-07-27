import express from 'express';
import {
  createEstudiante,
  getEstudiantes,
  getEstudianteById,
  updateEstudiante,
  deleteEstudiante
} from '../controllers/estudianteController.js'; // Ajusta la ruta según tu proyecto

const router = express.Router();

// Crear un estudiante
router.post('/estudiantes', createEstudiante);

// Obtener todos los estudiantes
router.get('/estudiantes', getEstudiantes);

// Obtener estudiante por ID
router.get('/estudiantes/:id', getEstudianteById);

// Actualizar estudiante por ID
router.put('/estudiantes/:id', updateEstudiante);

// Eliminar estudiante por ID
router.delete('/estudiantes/:id', deleteEstudiante);

export default router;
