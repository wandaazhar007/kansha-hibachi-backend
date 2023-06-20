import express from 'express';
import { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } from '../controllers/CategoryController.js';

const router = express.Router();

router.get('/category', getCategory);
router.get('/category/:id', getCategoryById);
router.post('/category', createCategory);
router.patch('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory)

export default router;