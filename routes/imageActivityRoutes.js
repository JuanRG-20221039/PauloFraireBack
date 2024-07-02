import express from 'express';
import {
    getImagesActivity,
    getImageActivityById,
    createImageActivity,
    deleteImageActivity,
    getImageActivitiesById
} from '../controllers/imageActivityController.js';
import upload from '../helpers/uploadImage.js';
import { checkAuth, isAdmin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/image-activity', getImagesActivity);
router.get('/image-activity/:id_academy', getImageActivitiesById);
router.get('/image-activity/:id', getImageActivityById);
router.post('/image-activity', checkAuth, isAdmin, upload.single('image'), createImageActivity);
router.delete('/image-activity/:id', checkAuth, isAdmin, deleteImageActivity);

export default router;