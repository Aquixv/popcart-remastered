import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Order from "../models/Order";
import Product from "../models/Product";
import Cart from "../models/Cart";

export const createOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, paymentResult } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    const order = new Order({
      user: req.user?._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,  
      paidAt: new Date(),
    });

    const createdOrder = await order.save();
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product, 
        { 
          $inc: { 
            stock: -item.quantity,
            sold: item.quantity
          } 
        } 
      );
    }

    await Cart.findOneAndUpdate(
      { user: req.user?._id },
      { $set: { items: [] } } 
    );

    return res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Server error creating order" });
  }
};
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};
export const getSellerRevenue = async (req: AuthRequest, res: Response) => {
  try {
    const sellerProducts = await Product.find({ user: req.user?._id }).select('_id');
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