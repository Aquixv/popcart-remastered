const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
import { AuthRequest } from "../middleware/authMiddleware";

const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderItems, shippingAddress, paymentResult, itemsPrice, totalPrice } = req.body;
    const userId = req.user._id;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod: 'Paystack',
      paymentResult,
      itemsPrice,
      totalPrice,
      isPaid: true,     
      paidAt: Date.now() 
    });

    const createdOrder = await order.save();
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    return res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ message: "Server error creating order" });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};
const getSellerRevenue = async (req, res) => {
  try {
    const sellerProducts = await Product.find({ user: req.user._id }).select('_id');
    const productIds = sellerProducts.map(p => p._id.toString());
    const allOrders = await Order.find({});

    let totalRevenue = 0;
    let totalItemsSold = 0;

    allOrders.forEach(order => {
      if (order.isPaid) {
        order.orderItems.forEach(item => {
          if (productIds.includes(item.product.toString())) {
            totalRevenue += (item.price * item.quantity);
            totalItemsSold += item.quantity;
          }
        });
      }
    });

    res.json({ totalRevenue, totalItemsSold });

  } catch (error) {
    console.error("Revenue calculation error:", error);
    res.status(500).json({ message: "Server error calculating revenue" });
  }
};
module.exports = { createOrder, getMyOrders, getSellerRevenue };