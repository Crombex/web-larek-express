import { Router } from 'express';
import { createOrder } from '../controllers/order';
import validateOrder from '../middlewares/order-validation';

const route = Router();

route.post('/', validateOrder, createOrder);
export { route as orderRoutes };
