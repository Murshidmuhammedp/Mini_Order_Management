import { Router } from "express";
import { blockCustomer, getAllCustomers, getCustomerById } from "../controllers/customerController.js";
import verifyToken from "../middlewares/jwtAuthValidation.js";

export const customerRouter = Router();

customerRouter.get("/customers", getAllCustomers);
customerRouter.get("/customer/:id", getCustomerById);
customerRouter.patch("/block/:id", blockCustomer);