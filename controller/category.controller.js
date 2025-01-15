import { Category } from "../model/category.model.js";

export const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();

    // Return the categories in a consistent response structure
    res.status(200).json({ message:"category fetched successfuly", success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: error.message, success: false });
  }
};
export const createCategory = async (req, res) => {
  // Validate the incoming data
  const { value, label } = req.body; // Assuming field is a required 
  if (!(value || label)) {
    return res
      .status(400)
      .json({ message: "Category value and label is required", success:false });
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
  } catch (error) {
    console.error("Error creating category:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: error.message, success: false });
  }
};
