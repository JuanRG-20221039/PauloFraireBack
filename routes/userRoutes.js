import express from 'express';
import {
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    login
} from '../controllers/userController.js';

const router = express.Router();

router.get('/user', getUsers);
router.get('/user/:id', getUserById);
router.get('/user/email/:email', getUserByEmail);
router.post('/user', addUser);
router.post('/login', login);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

export default router;
