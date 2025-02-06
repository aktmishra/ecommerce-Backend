import mongoose from "mongoose";
import { User } from "../model/user.model.js";



// User Related Section
export const fetchUserById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format using Mongoose
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ message: "Invalid user ID format", success: false });
  }

  try {
    const user = await User.findById(id).select("-password -salt");

    // Check if user was found
    if (!user) {
      return res
        .status(404)
        .json({ message: "User  not found", success: false });
    }

    res
      .status(200)
      .json({ message: "User found successfuly", success: true, data: user });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message : error.message, success:false });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ message: "Invalid user ID format", success: false });
  }

  try {
    // Update the user and return the updated document
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Check if the user was found
    if (!user) {
      return res
        .status(404)
        .json({ message: "User  not found", success: false });
    }

    // Return the updated user in a consistent response structure
    res
      .status(200)
      .json({ message: "User updated successfuly", success: true, data: user });
  } catch (error) {
    console.error("Error updating user:", error); // Log the error for debugging
    res.status(400).json({ message : error.message, success:false });
  }
};
