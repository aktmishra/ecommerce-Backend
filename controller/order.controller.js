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
      .json({
        message: "Orders fetched successfully",
        success: true,
        data: orders,
      });
  } catch (error) {
    console.error("An error occurred while fetching orders", error); // Log the error for debugging
    res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchAllOrder = async (req, res) => {
 
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
 

  try {

    let orders = Order.find({})
    // Sorting
    if (req.query._sort && req.query._order) {
      const sortOrder = req.query._order === "desc" ? -1 : 1; // Determine sort order
      orders = orders.sort({ [req.query._sort]: sortOrder });
    }

    // Pagination
    const pageSize = parseInt(req.query._per_page) || 10; // Default to 10 if not provided
    const page = parseInt(req.query._page) || 1; // Default to page 1 if not provided
    orders = orders.skip(pageSize * (page - 1)).limit(pageSize);

    // Execute the query
    const docs = await orders.exec();

    // Get total count of products matching the query
    const totalDocs = await Order.countDocuments().exec();

    // Set the total count in the response header
    res.set("X-Total-Count", totalDocs);
    res.status(200).json({ message : "Orders Fetched", success:true, data:docs });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ message : error.message, success:false });
  }
};

export const createOrder = async (req, res) => {
  // Input validation
  const {
    items,
    totalAmount,
    totalItem,
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
  if (totalItem < 0) {
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
      totalItem,
      user: userId,
      paymentMethod,
      shippingAddress,
    });
    const doc = await order.save();

    // Respond with the created order
    res.status(201).json({
      message: "Order created successfully",
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error("An error occurred while creating the order", error); // Log the error for debugging
    res.status(500).json({ message: error.message, success: false });
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
      data: order,
    });
  } catch (error) {
    console.error("Error while deleting order:", error); // Log the error for debugging
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateOrder = async (req, res) => {
  const { orderId } = req.params;

  // Input validation
  if (!orderId) {
    return res
      .status(400)
      .json({ message: "Order ID is required", success: false });
  }

  try {
    // Attempt to find and update the order by ID
    const order = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that validators are run on the update
    });

    // Check if the order was found and updated
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }

    // Respond with the updated order
    res
      .status(200)
      .json({
        message: "Order updated successfully",
        success: true,
        data: order,
      });
  } catch (error) {
    console.error("Error while updating order:", error); // Log the error for debugging
    res.status(500).json({ message: error.message, success: false });
  }
};
