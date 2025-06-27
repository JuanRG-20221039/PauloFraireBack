import express from 'express';
import {
    getNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
    getNotificationsByType,
    getNotificationsByStatus
} from '../controllers/notifyController.js';
import { checkAuth, isAdmin } from '../middleware/checkAuth.js';

const router = express.Router();

// Rutas públicas (accesibles sin autenticación)
router.get('/notify', getNotifications);
router.get('/notify/:id', getNotificationById);
router.get('/notify/tipo/:tipo', getNotificationsByType);
router.get('/notify/estado/:estado', getNotificationsByStatus);

// Rutas protegidas (requieren autenticación y rol de administrador)
router.post('/notify', checkAuth, isAdmin, createNotification);
router.put('/notify/:id', checkAuth, isAdmin, updateNotification);
router.delete('/notify/:id', checkAuth, isAdmin, deleteNotification);

export default router;