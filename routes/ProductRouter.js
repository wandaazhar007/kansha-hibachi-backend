import express from 'express';
import { createProduct, deleteProducts, getProductById, getProducts, updateProduct, getProductCart, getAllProducts, getProductsPerCategory, searchProducts } from '../controllers/ProductController.js';
// import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/all-products', getAllProducts);
router.get('/products-per-category', getProductsPerCategory);
router.get('/products/:id', getProductById);
router.get('/products-cart/:id', getProductCart);
router.get('/search-products', searchProducts);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProducts);

export default router;