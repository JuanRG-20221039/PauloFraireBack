import express from 'express';
import {
    getBlogs,
    getBlogsPublished,
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog
} from '../controllers/blogController.js';
import upload from '../helpers/uploadImage.js';
import { checkAuth, isAdmin } from '../middleware/checkAuth.js';


const router = express.Router();

router.get('/blog', getBlogs);
router.get('/blog/published', getBlogsPublished);
router.get('/blog/:id', getBlogById);

router.post('/blog', checkAuth,isAdmin, upload.single('img'), createBlog);
router.put('/blog/:id', checkAuth, isAdmin, upload.single('img'), updateBlog);
router.delete('/blog/:id', checkAuth, isAdmin, deleteBlog);


export default router;