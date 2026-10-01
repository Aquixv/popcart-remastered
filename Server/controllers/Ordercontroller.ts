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

    const htmlMessage = `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #111827;">Thanks for shopping with PopCart! 🎉</h2>
    <p style="color: #4b5563;">Hi ${context.user.name}, we've successfully received your order.</p>
    
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #111827;">Order Summary</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${args.orderItems.map((item: any) => `
          <li style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <div style="display: flex; align-items: center;">
              <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; margin-right: 12px;" />
              <span>${item.quantity}x ${item.name}</span>
            </div>
            <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        `).join('')}
      </ul>
      <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 2px solid #e5e7eb; font-size: 1.2rem;">
        <strong>Total:</strong>
        <strong>$${args.totalPrice.toFixed(2)}</strong>
      </div>
    </div>
    
    <p style="color: #6b7280; font-size: 0.9rem;">We'll notify you as soon as your items ship.</p>
  </div>
`;

try {
sendEmail({
  email: context.user.email,
  subject: 'Your PopCart Order Confirmation',
  html: htmlMessage
}).catch(err => console.error("Silently failing email so order still completes:", err));
  console.log("Order confirmation email sent to:", context.user.email);
} catch (emailError) {
  // We log the error but DO NOT throw it, because the order itself was already paid and saved!
  console.error("Order saved, but confirmation email failed to send:", emailError);
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