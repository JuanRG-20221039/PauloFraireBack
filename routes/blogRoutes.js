import express from 'express';
import {
    getBlogs,
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog
} from '../controllers/blogController.js';
import upload from '../helpers/uploadImage.js';

const router = express.Router();

router.get('/blog', getBlogs);
router.get('/blog/:id', getBlogById);
router.post('/blog', upload.single('img'), createBlog);
router.put('/blog/:id', upload.single('img'), updateBlog);
router.delete('/blog/:id', deleteBlog);


export default router;