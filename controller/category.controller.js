import { Category } from "../model/category.model.js";

export const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();

    // Return the categories in a consistent response structure
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    console.error("Error fetching categories:", err); // Log the error for debugging
    res
      .status(500)
      .json({
        error: "An error occurred while fetching categories",
        message: false,
      });
  }
};
export const createCategory = async (req, res) => {
  // Validate the incoming data
  const { value, label } = req.body; // Assuming field is a required 
  if (!(value || label)) {
    return res
      .status(400)
      .json({ error: "Category value and label is required" });
  }

  const category = new Category(req.body);
  try {
    const doc = await category.save();

    // Return the created category in a consistent response structure
    res
      .status(201)
      .json({
        message: "Category created successfuly",
        success: true,
        data: doc,
      });
  } catch (err) {
    console.error("Error creating category:", err); // Log the error for debugging
    res
      .status(500)
      .json({
        message: "An error occurred while creating the category",
        success: false,
      });
  }
};
