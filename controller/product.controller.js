import { Product } from "../model/product.model.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  const product = new Product(req.body);
  // console.log(product)
  try {
    const doc = await product.save();
    res.status(201).json({ message: 'Product created', success: true, data:doc});
  } catch (error) {
    console.error("Error while creating product:", error)
    res.status(401).json({ message : error.message, success:false });
  }
};

export const fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  // TODO : we have to try with multiple category and brands after change in front-end

  try {
    // Build the query object
    const query = {deleted:false};
    

    // Filter by category
    if (req.query.category) {
      query.category = { $in: req.query.category.split(",") }; // Support multiple categories
    }

    // Filter by brand
    if (req.query.brand) {
      query.brand = req.query.brand;
    }

    // Create the base query
    let productsQuery = Product.find(query);

    // Sorting
    if (req.query._sort && req.query._order) {
      const sortOrder = req.query._order === "desc" ? -1 : 1; // Determine sort order
      productsQuery = productsQuery.sort({ [req.query._sort]: sortOrder });
    }

    // Pagination
    const pageSize = parseInt(req.query._per_page) || 10; // Default to 10 if not provided
    const page = parseInt(req.query._page) || 1; // Default to page 1 if not provided
    productsQuery = productsQuery.skip(pageSize * (page - 1)).limit(pageSize);

    // Execute the query
    const docs = await productsQuery.exec();

    // Get total count of products matching the query
    const totalDocs = await Product.countDocuments(query).exec();

    // Set the total count in the response header
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ message : error.message, success:false });
  }
};

export const fetchProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID format", success:false});
    }

    const product = await Product.findById(id);

    // Check if the product was found
    if (!product) {
      return res.status(404).json({ message: "Product not found" , success:false});
    }

    res.status(200).json({ message: 'Product fetched', success: true, data:product});
  } catch (error) {
    console.error("Error fetching product:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message : error.message, success:false });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    // Update the product
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Ensure validators are run on the update
    });

    // Check if the product was found
    if (!product) {
      return res.status(404).json({ error: "Product not found", success:false });
    }

    res.status(200).json({ message: 'Product updated', success: true, data:product});
  } catch (error) {
    console.error("Error updating product:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message : error.message, success:false });
  }
};
