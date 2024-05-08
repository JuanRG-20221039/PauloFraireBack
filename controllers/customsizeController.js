import Customsize from "../models/Customsize.js";
import cloudinary from "../utils/cloudinary.js";

//get customsize
const getCustomsize = async (req, res) => {
    try {
        const customsize = await Customsize.find();
        res.json(customsize);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

//get customsize by id
const getCustomsizeById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            const error = new Error('Id Requerido');
            return res.status(404).json(error.message);
        }

        const customsize = await Customsize.findById(id);
        if (!customsize) {
            const error = new Error('Customsize no encontrado');
            return res.status(404).json(error.message);
        }

        res.json(customsize);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

//create customsize
const createCustomsize = async (req, res) => {
    let img = req.file;

    try {

        if (!img) {
            const error = new Error('Por favor seleccione una imagen');
            return res.status(404).json(error.message);
        }

        const result = await cloudinary.uploader.upload(img.path, {
            folder: 'customsize',
            with: 1200,
            crop: "scale"
        });

        const customsize = new Customsize({
            slideImg: result.url,
            public_id: result.public_id
        });

        customsize.save();

        return res.json({ message: 'Creado correctamente' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

//delete customsize
const deleteCustomsize = async (req, res) => {
    const { id } = req.params;
    try {

        if (!id) {
            const error = new Error('Id Requerido');
            return res.status(404).json(error.message);
        }

        const customsize = await Customsize.findById(id);
        if (!customsize) {
            const error = new Error('Customsize no encontrado');
            return res.status(404).json(error.message);
        }

        await cloudinary.uploader.destroy(customsize.public_id);
        await Customsize.findByIdAndDelete(id);

        res.json({ message: 'Eliminado Correctamente' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export {
    getCustomsize,
    getCustomsizeById,
    createCustomsize,
    deleteCustomsize
}