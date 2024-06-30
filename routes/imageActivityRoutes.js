import express from 'express';
import {
    getImagesActivity,
    getImageActivityById,
    createImageActivity,
    deleteImageActivity,
    getImageActivitiesById
} from '../controllers/imageActivityController.js';
import upload from '../helpers/uploadImage.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/image-activity', getImagesActivity);
router.get('/image-activity/:id_academy', getImageActivitiesById);
router.get('/image-activity/:id', getImageActivityById);
router.post('/image-activity', checkAuth, upload.single('image'), createImageActivity);
router.delete('/image-activity/:id', checkAuth, deleteImageActivity);

export default router;