import { isValidObjectId } from "mongoose";
import AcademyActivities from "../models/AcademyActivities.js";
// Las importaciones dinámicas de ImageActivity y cloudinary se realizan en la función deleteAcademyActivity

const getAcademyActivities = async (req, res) => {
    try {
        const academyActivities = await AcademyActivities.find();
        res.json(academyActivities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAcademyActivityById = async (req, res) => {

    const { id } = req.params;

    if (!isValidObjectId(id)) {
        const error = new Error('Id no válido');
        return res.status(400).json(error.message);
    }

    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        const academyActivity = await AcademyActivities.findById(id);

        if (!academyActivity) {
            const error = new Error('Actividad no encontrada');
            return res.status(400).json(error.message);
        }

        res.json(academyActivity);

    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

//creat academy activity
const createAcademyActivity = async (req, res) => {

    const { title, description } = req.body;

    try {

        if (!title || !description) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const academyActivity = new AcademyActivities({
            title,
            description
        });

        await academyActivity.save();

        res.json(academyActivity);

    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


//update academy activity
const updateAcademyActivity = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        if (!title || !description) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const academyActivity = await AcademyActivities.findById(id);

        if (!academyActivity) {
            const error = new Error('Actividad no encontrada');
            return res.status(400).json(error.message);
        }

        academyActivity.title = title;
        academyActivity.description = description;

        await academyActivity.save();

        res.send('Actividad actualizada');
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const deleteAcademyActivity = async (req, res) => {

    const { id } = req.params;
    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        const academyActivity = await AcademyActivities.findById(id);

        if (!academyActivity) {
            const error = new Error('Actividad no encontrada');
            return res.status(400).json(error.message);
        }

        // Importar el modelo de ImageActivity y cloudinary
        const ImageActivity = (await import('../models/ImageActivity.js')).default;
        const cloudinary = (await import('../utils/cloudinary.js')).default;

        // Buscar todas las imágenes asociadas a esta actividad
        const images = await ImageActivity.find({ academyActivity: id });

        // Eliminar cada imagen de cloudinary y de la base de datos
        for (const image of images) {
            try {
                // Eliminar la imagen de cloudinary
                await cloudinary.uploader.destroy(image.public_id);
                // Eliminar la imagen de la base de datos
                await ImageActivity.findByIdAndDelete(image._id);
            } catch (imgError) {
                console.error('Error al eliminar imagen:', imgError);
                // Continuar con las demás imágenes aunque haya error
            }
        }

        // Eliminar la actividad académica
        await AcademyActivities.findByIdAndDelete(id);

        res.send('Actividad y sus imágenes eliminadas');

    } catch (error) {
        console.error('Error al eliminar actividad:', error);
        return res.status(500).json({ message: error.message });
    }
}

export {
    getAcademyActivities,
    getAcademyActivityById,
    createAcademyActivity,
    updateAcademyActivity,
    deleteAcademyActivity
}