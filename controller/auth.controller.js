import { User } from "../model/user.model.js";
import crypto from "crypto";
import { sanitizeUser } from "../service/common.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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

  try {
    [fullName, email, password].some((field) => field?.trim() === "");

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(400).json({
        message: "User with email already exists",
        success: false,
      });
    }
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        if (err) {
          res.status(400).json({ message: err, success: false });
        }
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          //this also call serializer and adds to session
          if (err) {
            res.status(400).json({
              message: "Something went wrong",
              success: false,
            });
          } else {
            //token
            const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET);

            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({
                message: "User created successfuly",
                success: true,
                // token: token,
                data: sanitizeUser(doc),
              });
          }
        });
      }
    );
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, success: false });
    }

    // Handle other types of errors
    res.status(500).json({ message: error.message, success: false });
  }
};

export const loginUser = async (req, res) => {
  try {
    res
      .cookie("jwt", req.user.token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "User Logged In successfuly.",
        success: true,
        data: req.user,
      });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};
export const logoutUser  = async (req, res) => {
  try {
    res
      .cookie("jwt", "", {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        sameSite: "Strict", // Helps prevent CSRF attacks
        expires: new Date(0), // Set expiration date to the past
      })
      .status(200)
      .json({
        message: "User  logged out successfully.",
        success: true,
      });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};




export const checkUser = (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "already logged in",
      success: true,
      data: req.user,
    });
  }else{
    res.sendStatus(401)
  }
};
