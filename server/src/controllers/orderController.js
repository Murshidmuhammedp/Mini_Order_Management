import Order from "../models/orderSchema.js";

export const addOrder = async (req, res, next) => {
    try {
        const { customerId, products, totalPrice, quantity } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ error: "Products are required" });
        }
        const newOrder = new Order({
            customerId,
            products,
            totalPrice,
            quantity,
        });

        await newOrder.save();
        return res.status(201).json({ message: "Order placed successfully", sale: newOrder });

    } catch (error) {
        next(error);
    }
};

export const getAllOrder = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Order.countDocuments();

        const orders = await Order.find()
            .populate("products.productId customerId")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            total,
            page,
            limit,
            orders,
        });

    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.Status = status;
    await order.save();

    return res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
