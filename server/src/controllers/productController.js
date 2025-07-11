import Product from "../models/productSchema.js";


export const getAllProducts = async (req, res, next) => {
    try {

        const products = await Product.find();
        return res.status(200).json({ products });
    } catch (error) {
        next(error);
    }
};


export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not Found" });
        }

        return res.status(200).json({ product });
    } catch (error) {
        next(error);
    }
};


export const productblock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not Found"});
        }

        product.isListed = !product.isListed;
        await product.save();

        return res.status(200).json({
            message: product.isListed ? "Listed" : "Unlisted",
            product,
        });
    } catch (error) {
        next(error);
    }
};
