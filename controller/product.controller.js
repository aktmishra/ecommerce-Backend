import { Product } from "../model/product.model.js";

export const createProduct = async (req, res) => {
  const product = new Product(req.body);
  // console.log(product)
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(401).json(error);
  }
};
