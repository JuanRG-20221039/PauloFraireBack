import ImageActivity from "../models/ImageActivity.js";
import cloudinary from '../utils/cloudinary.js';
import AcademyActivities from "../models/AcademyActivities.js";
import path, { dirname } from "path";

const getImagesActivity = async (req, res) => {
    try {
        const images = await ImageActivity.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getImageActivitiesById = async (req, res) => {
    const { id_academy } = req.params;

    try {

        if (!id_academy) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);

        } else {

            const images = await ImageActivity.find({ academyActivity: id_academy });
            res.json(images);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}



const getImageActivityById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        const image = await ImageActivity.findById(id);

        if (!image) {
            const error = new Error('Imagen no encontrada');
            return res.status(400).json(error.message);
        }

        res.json(image);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


const createImageActivity = async (req, res) => {

    const { id, description } = req.body;
    let img = req.file;

    try {

        if (!description || !img) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const academyActivity = await AcademyActivities.findById(id);
        if (!academyActivity) {
            const error = new Error('Actividad no encontrada');
            return res.status(400).json(error.message);
        }
        const result = await cloudinary.uploader.upload(img.path, {
            folder: "images",
            width: 1200,
            crop: "scale"
        });

        const newImage = new ImageActivity({
            description,
            url: result.url,
            public_id: result.public_id,
            academyActivity: id
        });

        await newImage.save();

        res.json(newImage);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


//eliminar la imagen

const deleteImageActivity = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        const image = await ImageActivity.findById(id);

        if (!image) {
            const error = new Error('Imagen no encontrada');
            return res.status(400).json(error.message);
        }

        await cloudinary.uploader.destroy(image.public_id);

        await ImageActivity.findByIdAndDelete(id);

        res.json({ message: 'Imagen eliminada' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


export {
    getImagesActivity,
    getImageActivityById,
    createImageActivity,
    deleteImageActivity,
    getImageActivitiesById
};