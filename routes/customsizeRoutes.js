import express from 'express';
import {
    getCustomsize,
    getCustomsizeById,
    createCustomsize,
    deleteCustomsize
} from '../controllers/customsizeController.js';
import upload from '../helpers/uploadImage.js';

const router = express.Router();

router.get('/customsize', getCustomsize);
router.get('/customsize/:id', getCustomsizeById);
router.post('/customsize', upload.single('img'), createCustomsize);
router.delete('/customsize/:id', deleteCustomsize);

export default router;
