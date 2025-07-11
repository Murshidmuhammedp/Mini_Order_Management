import { Router } from "express";
import { addOrder, getAllOrder, updateOrderStatus } from "../controllers/orderController.js";
import verifyToken from "../middlewares/jwtAuthValidation.js";

const orderRouter = Router();

orderRouter.post('/order', addOrder);
orderRouter.get('/listorders', getAllOrder);
orderRouter.put('/:id/status', updateOrderStatus);

export default orderRouter;