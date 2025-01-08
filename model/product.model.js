import mongoose, { Schema } from "mongoose";

const productShema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [1, "Price cannot be 0"],
    max: [150000, "Price more than 150000 is not acceptable"],
    required: true,
  },
  discountPercentage: {
    type: Number,
    min: [0, "Cannot be less than 0"],
    max: [99, "Max discount"],
    required: true,
  },
  rating: {
    type: Number,
    min: [0, "Ratin cannot be less than 1"],
    max: [5, "Rating cannot be more than 5"],
    default: 0,
  },
  stock: { type: Number, min: [0, "Cannnot be less than 0"], default: 0 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
});

export const Product = mongoose.model("Product", productShema)