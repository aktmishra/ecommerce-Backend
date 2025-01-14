import { Order } from "../model/order.model.js";

export const fetchOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  // Input validation
  if (!userId) {
    return res
      .status(400)
      .json({ message: "User  ID is required", success: false });
  }

  try {
    // Fetch orders for the specified user
    const orders = await Order.find({ user: userId });
    // Check if any orders were found
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user", success: false });
    }

    // Respond with the found orders
    res
      .status(200)
      .json({ message: "Orders fetched successfully", success: true, orders });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      message: "An error occurred while fetching orders",
      success: false,
    });
  }
};

export const createOrder = async (req, res) => {
  // Input validation
  const {
    items,
    totalAmount,
    totalItems,
    userId,
    paymentMethod,
    shippingAddress,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Items are required and must be a non-empty array",
      success: false,
    });
  }
  if (totalAmount < 0) {
    return res.status(400).json({
      message: "Total amount must be a non-negative number",
      success: false,
    });
  }
  if (totalItems < 0) {
    return res.status(400).json({
      message: "Total items must be a non-negative number",
      success: false,
    });
  }
  if (!userId) {
    return res
      .status(400)
      .json({ message: "User  ID is required", success: false });
  }
  if (!paymentMethod) {
    return res
      .status(400)
      .json({ message: "Payment method is required", success: false });
  }
  if (!shippingAddress) {
    return res
      .status(400)
      .json({ message: "Shipping address is required", success: false });
  }

  try {
    // Create a new order
    const order = new Order({
      items,
      totalAmount,
      totalItems,
      user: userId,
      paymentMethod,
      shippingAddress,
    });
    const doc = await order.save();

    // Respond with the created order
    res.status(201).json({
      message: "Order created successfully",
      success: true,
      order: doc,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      message: "An error occurred while creating the order",
      success: false,
    });
  }
};

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  // Input validation
  if (!orderId) {
    return res
      .status(400)
      .json({ message: "Order ID is required", success: false });
  }

  try {
    // Attempt to find and delete the order by ID
    const order = await Order.findByIdAndDelete(orderId);

    // Check if the order was found and deleted
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }

    // Respond with the deleted order
    res.status(200).json({
      message: "Order deleted successfully",
      success: true,
      deletedOrder: order,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      message: "An error occurred while deleting the order",
      success: false,
    });
  }
};

export const updateOrder = async (req, res) => {
    const { orderId } = req.params;
  
    // Input validation
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required', success: false });
    }
  
    try {
      // Attempt to find and update the order by ID
      const order = await Order.findByIdAndUpdate(orderId, req.body, {
        new: true, // Return the updated document
        runValidators: true, // Ensure that validators are run on the update
      });
  
      // Check if the order was found and updated
      if (!order) {
        return res.status(404).json({ message: 'Order not found', success: false });
      }
  
      // Respond with the updated order
      res.status(200).json({ message: 'Order updated successfully', success: true, order });
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: 'An error occurred while updating the order', success: false });
    }
  };