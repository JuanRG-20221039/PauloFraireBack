import express from 'express';
import {
    getAcademyActivities,
    getAcademyActivityById,
    createAcademyActivity,
    updateAcademyActivity,
    deleteAcademyActivity
} from '../controllers/academyActivitiesController.js';
import { checkAuth, isAdmin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/academy-activities', getAcademyActivities);
router.get('/academy-activities/:id', getAcademyActivityById);
router.post('/academy-activities', checkAuth, isAdmin, createAcademyActivity);
router.put('/academy-activities/:id', checkAuth, isAdmin, updateAcademyActivity);
router.delete('/academy-activities/:id', checkAuth, isAdmin, deleteAcademyActivity);


export default router;