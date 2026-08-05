import Order from "../models/Order";
import Product from "../models/Product";
import Cart from "../models/Cart";

export const createOrder = async (_: any, args: any, context: any) => {
  try {
    if (!context.user) throw new Error("Not authenticated");

    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, paymentResult } = args;

    if (!orderItems || orderItems.length === 0) {
      throw new Error('No order items');
    }
    
    const order = new Order({
      user: context.user._id,
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
      { user: context.user._id },
      { $set: { items: [] } } 
    );
    return createdOrder;

  } catch (error) {
    console.error("Create order error:", error);
    throw new Error("Server error creating order");
  }
};

export const getMyOrders = async (_: any, __: any, context: any) => {
  try {
    if (!context.user) throw new Error("Not authenticated");
    const orders = await Order.find({ user: context.user._id }).sort({ createdAt: -1 });
    return orders;
    
  } catch (error) {
    console.error("Fetch orders error:", error);
    throw new Error("Server error fetching orders");
  }
};

export const getSellerRevenue = async (_: any, __: any, context: any) => {
  try {
    if (!context.user) throw new Error("Not authenticated");
    const sellerProducts = await Product.find({ user: context.user._id }).select('_id');
    const productIds = sellerProducts.map((p: any) => p._id.toString());
    const allOrders = await Order.find({});

    let totalRevenue = 0;
    let totalItemsSold = 0;

    allOrders.forEach((order: any) => {
      if (order.isPaid) {
        order.orderItems.forEach((item: any) => {
          if (productIds.includes(item.product.toString())) {
            totalRevenue += (item.price * item.quantity);
            totalItemsSold += item.quantity;
          }
        });
      }
    });
    return { totalRevenue, totalItemsSold };

  } catch (error) {
    console.error("Revenue calculation error:", error);
    throw new Error("Server error calculating revenue");
  }
};