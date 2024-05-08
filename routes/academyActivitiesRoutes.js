import express from 'express';
import {
    getAcademyActivities,
    getAcademyActivityById,
    createAcademyActivity,
    updateAcademyActivity,
    deleteAcademyActivity
} from '../controllers/academyActivitiesController.js';

const router = express.Router();

router.get('/academy-activities', getAcademyActivities);
router.get('/academy-activities/:id', getAcademyActivityById);
router.post('/academy-activities', createAcademyActivity);
router.put('/academy-activities/:id', updateAcademyActivity);
router.delete('/academy-activities/:id', deleteAcademyActivity);



export default router;