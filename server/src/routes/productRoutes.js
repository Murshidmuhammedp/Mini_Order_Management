import { Router } from "express";
import { getAllProducts, getProductById, productblock } from "../controllers/productController.js";
import verifyToken from "../middlewares/jwtAuthValidation.js";

export const productRouter = Router();

productRouter.get("/products", getAllProducts);
productRouter.get("/product/:id", getProductById);
productRouter.patch("/islisted/:id", productblock);






