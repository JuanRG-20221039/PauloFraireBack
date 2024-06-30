import express from 'express';
import {
    getCustomsize,
    getCustomsizeById,
    createCustomsize,
    deleteCustomsize
} from '../controllers/customsizeController.js';
import upload from '../helpers/uploadImage.js';
import { checkAuth } from '../middleware/checkAuth.js';


const router = express.Router();

router.get('/customsize', getCustomsize);
router.get('/customsize/:id', checkAuth, getCustomsizeById);
router.post('/customsize', checkAuth, upload.single('img'), createCustomsize);
router.delete('/customsize/:id', checkAuth, deleteCustomsize);

export default router;
