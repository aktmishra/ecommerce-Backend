import { Brand } from "../model/brand.model.js";
 

export const fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();

    // Return the categories in a consistent response structure
    res.status(200).json({ success: true, data: brands });
  } catch (err) {
    console.error("Error fetching brands:", err); // Log the error for debugging
    res
      .status(500)
      .json({
        error: "An error occurred while fetching brands",
        message: false,
      });
  }
};
export const createBrand = async (req, res) => {
  // Validate the incoming data
  const { value, label } = req.body; // Assuming field is a required 
  if (!(value || label)) {
    return res
      .status(400)
      .json({ error: "Brands value and label is required" });
  }

  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();

    // Return the created Brand in a consistent response structure
    res
      .status(201)
      .json({
        message: "Brand created successfuly",
        success: true,
        data: doc,
      });
  } catch (err) {
    console.error("Error creating Brand:", err); // Log the error for debugging
    res
      .status(500)
      .json({
        message: "An error occurred while creating the Brand",
        success: false,
      });
  }
};
