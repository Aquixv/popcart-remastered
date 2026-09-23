import Order from "../models/Order";
import Product from "../models/Product";
import Cart from "../models/Cart";
import sendEmail from "../util/email";

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

    try {
  const htmlMessage = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Confirmed! 🎉</h2>
      <p>Thanks for shopping with PopCart. Your order <strong>#${createdOrder._id}</strong> is being processed.</p>
      <p>Total Paid: $${totalPrice.toFixed(2)}</p>
      <p>We'll notify you once your items ship to ${shippingAddress.city}.</p>
    </div>
  `;
    sendEmail({
    email: context.user.email,
    subject: 'Your PopCart Order Confirmation',
    html: htmlMessage
  }).catch(err => console.error("Silently failing email so order still completes:", err));
  
} catch (emailTriggerError) {
  console.error("Email setup failed:", emailTriggerError);
}

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
    const orders = await Order.find({ user: context.user._id })
                              .populate('orderItems.product') 
                              .sort({ createdAt: -1 });
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