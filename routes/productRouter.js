import express from 'express';
import { createProduct, deleteProducts, getProductById, getProducts, seacrhProducts, updateProduct } from '../controllers/productController.js';
// import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:slug', getProductById);
router.get('/search-products', seacrhProducts);
router.post('/products', createProduct);
router.patch('/products/:slug', updateProduct);
router.delete('/products/:slug', deleteProducts);

export default router;