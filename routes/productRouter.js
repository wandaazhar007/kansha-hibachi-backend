import express from 'express';
import { getProducts } from '../controllers/productController.js';
// import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/products', getProducts);

export default router;