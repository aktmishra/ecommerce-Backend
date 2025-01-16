import { Brand } from "../model/brand.model.js";
 

export const fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();

    // Return the categories in a consistent response structure
    res.status(200).json({ message:"Brands fetched successfuly", success: true, data: brands });
  } catch (error) {
    console.error("Error fetching brands:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: error.message, success: false });
  }
};
export const createBrand = async (req, res) => {
  // Validate the incoming data
  const { value, label } = req.body; // Assuming field is a required 
  if (!(value || label)) {
    return res
      .status(400)
      .json({ message: "Brands value and label is required", success:false });
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
  } catch (error) {
    console.error("Error creating Brand:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: error.message, success: false });
  }
};
