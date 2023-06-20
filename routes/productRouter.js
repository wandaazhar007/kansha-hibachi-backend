import express from 'express';
import { createProduct, getProducts } from '../controllers/productController.js';
// import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/products', getProducts);
router.post('/products', createProduct);

export default router;