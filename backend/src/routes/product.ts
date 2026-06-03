import { Router } from 'express';
import { createProduct, getAllProducts } from '../controllers/product';
import validateProduct from '../middlewares/product-validation';

const route = Router();

route.get('/', getAllProducts);
route.post('/', validateProduct, createProduct);

export default route;
