import express from 'express';
import {
    getCustomsize,
    getCustomsizeById,
    createCustomsize,
    deleteCustomsize
} from '../controllers/customsizeController.js';
import upload from '../helpers/uploadImage.js';
import { checkAuth, isAdmin } from '../middleware/checkAuth.js';


const router = express.Router();

router.get('/customsize', getCustomsize);
router.get('/customsize/:id', getCustomsizeById);
router.post('/customsize', checkAuth, isAdmin, upload.single('img'), createCustomsize);
router.delete('/customsize/:id', checkAuth, isAdmin, deleteCustomsize);

export default router;
