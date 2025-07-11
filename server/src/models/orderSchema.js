import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        products: { type: String, required: true },
        quantity: { type: Number, required: true },
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: false },
        Status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: "Pending" },
        totalPrice: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
