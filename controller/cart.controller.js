import { Cart } from "../model/cart.model.js";
import { Product } from "../model/product.model.js";

export const fetchCartByUserId = async (req, res) => {
  const { userId } = req.params;

  // Input validation
  if (!userId) {
    return res
      .status(400)
      .json({ message: "User  ID is required", success: false });
  }

  try {
    const cartItems = await Cart.find({ user: userId }).populate("product");

    // Check if cart is empty
    if (cartItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No cart items found for this user", success: false });
    }

    res.status(200).json({
      message: "Cart items found for this user",
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.error("An error occurred while fetching cart items", error); // Log the error for debugging
    res.status(500).json({ message: error.message, success: false });
  }
};

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Input validation
  if (!userId || !productId || !quantity) {
    return res.status(400).json({
      message: "User  ID, product ID, and quantity are required",
      success: false,
    });
  }

  try {
    // Check if the product exists (optional but recommended)
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    // Create a new cart item
    const cart = new Cart({
      user: userId,
      product: productId,
      quantity,
    });

    // Save the cart item
    const doc = await cart.save();
    const result = await doc.populate("product");

    res
      .status(201)
      .json({
        message: "Added to cart successfuly",
        success: true,
        data: result,
      });
  } catch (error) {
    console.error("An error occurred while adding to the cart", error); // Log the error for debugging
    res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteFromCart = async (req, res) => {
  const { itemId } = req.params;

  // Input validation
  if (!itemId) {
    return res
      .status(400)
      .json({ message: "Item ID is required", success: false });
  }

  try {
    // Attempt to find and delete the cart item by ID
    const doc = await Cart.findByIdAndDelete(itemId);

    // Check if the document was found and deleted
    if (!doc) {
      return res
        .status(404)
        .json({ message: "Cart item not found", success: false });
    }

    // Respond with the deleted document
    res.status(200).json({
      message: "Item deleted successfully from Cart",
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error("An error occurred while deleting the cart item", error); // Log the error for debugging
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateCart = async (req, res) => {
  const { itemId } = req.params;

  // Input validation
  if (!itemId) {
    return res
      .status(400)
      .json({ message: "Item ID is required", success: false });
  }

  try {
    // Attempt to find and update the cart item by ID
    const updatedCart = await Cart.findByIdAndUpdate(itemId, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that validators are run on the update
    });

    // Check if the document was found and updated
    if (!updatedCart) {
      return res
        .status(404)
        .json({ message: "Cart item not found", success: false });
    }

    // Respond with the updated cart item
    res.status(200).json({
      message: "Cart item updated successfully",
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    console.error("An error occurred while updating the cart item", error); // Log the error for debugging
    res.status(500).json({ message: error.message, success: false });
  }
};
