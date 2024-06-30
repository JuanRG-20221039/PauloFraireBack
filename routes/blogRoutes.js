import express from 'express';
import {
    getBlogs,
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog
} from '../controllers/blogController.js';
import upload from '../helpers/uploadImage.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/blog', getBlogs);
router.get('/blog/:id', getBlogById);
router.post('/blog', checkAuth, upload.single('img'), createBlog);
router.put('/blog/:id', checkAuth, upload.single('img'), updateBlog);
router.delete('/blog/:id', checkAuth, deleteBlog);


export default router;