import mongoose from "mongoose";
import { User } from "../model/user.model.js";

// Auth Related Section
export const createUser = async (req, res) => {
  // Validate the request body
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "fullName, email, and password are required.",
      success: false,
    });
  }

  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json({
      message: "User created successfuly.",
      success: true,
      data: doc,
    });
  } catch (err) {
    console.error("Error creating user:", err); // Log the error for debugging

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, success: false });
    }

    // Handle other types of errors
    res.status(500).json({
      message: "An error occurred while creating the user.",
      success: false,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    // TODO: this is just temporary, we will use strong password auth
    if (!user) {
      res.status(401).json({ message: "no such user email", success: false });
    } else if (user.password === req.body.password) {
      // TODO: We will make addresses independent of login
      const doc = {
        id: user.id,
        role: user.role      
      };
      res.status(200).json({
        message: "User login successfuly.",
        success: true,
        data: doc,
      });
    } else {
      res.status(401).json({ message: "invalid credentials", success: false });
    }
  } catch (err) {
    res.status(400).json({
      message: `An error occurred while login: ${err}`,
      success: false,
    });
  }
};

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
    const user = await User.findById(id);

    // Check if user was found
    if (!user) {
      return res
        .status(404)
        .json({ message: "User  not found", success: false });
    }

    res
      .status(200)
      .json({ message: "User found successfuly", success: true, data: user });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      message: `An error occurred while fetching the user: ${err}`,
      success: false,
    });
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
  } catch (err) {
    console.error("Error updating user:", err); // Log the error for debugging
    res.status(400).json({
      message: err.message,
      success: false,
    });
  }
};
