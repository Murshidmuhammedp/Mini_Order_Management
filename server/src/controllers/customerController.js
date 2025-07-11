import Customer from "../models/customerSchema.js";

export const getAllCustomers = async (req, res, next) => {
    try {

        const customers = await Customer.find();
        return res.status(201).json({ customers });
    } catch (error) {
        next(error);
    }
};


export const getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not Found" });
        }

        return res.status(201).json({ customer });
    } catch (error) {
        next(error);
    }
};

export const blockCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not Found" });
        }

        customer.isBlocked = !customer.isBlocked;
        await customer.save();

        return res.status(200).json({
            message: customer.isBlocked ? "Blocked" : "Unblocked",
            customer,
        });
    } catch (error) {
        next(error);
    }
};
