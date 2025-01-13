import mongoose from "mongoose";
import { User } from "../model/user.model.js";

// Auth Related Section
export const createUser = async (req, res) => {
  // Validate the request body
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: "fullName, email, and password are required." });
  }

  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error("Error creating user:", err); // Log the error for debugging

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    // Handle other types of errors
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    // TODO: this is just temporary, we will use strong password auth
    if (!user) {
      res.status(401).json({ message: "no such user email" });
    } else if (user.password === req.body.password) {
      // TODO: We will make addresses independent of login
      res
        .status(200)
        .json({
          id: user.id,
          email: user.email,
          name: user.name,
          addresses: user.addresses,
          orders: user.orders,
        });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};


// User Related Section
export const fetchUserById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format using Mongoose
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(id);

    // Check if user was found
    if (!user) {
      return res.status(404).json({ error: "User  not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
};

export const updateUser  = async (req, res) => {
    const { id } = req.params;
  
    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
  
    try {
      // Update the user and return the updated document
      const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  
      // Check if the user was found
      if (!user) {
        return res.status(404).json({ error: "User  not found" });
      }
  
      // Return the updated user in a consistent response structure
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      console.error("Error updating user:", err); // Log the error for debugging
      res.status(400).json({ error: "An error occurred while updating the user", details: err.message });
    }
  };
