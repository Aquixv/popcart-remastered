import Cart from '../models/Cart'; 
import Product from '../models/Product';

export const addToCart = async (_: any, args: { productId: string; quantity: number }, context: any) => {
  const { productId, quantity } = args; 
  const userId = context.user?._id;

  if (!userId) throw new Error("Not authenticated");

  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    // 1. Fetch to check stock limits (no saving!)
    let cart = await Cart.findOne({ user: userId });

    let existingQuantity = 0;
    let itemExists = false;

    if (cart) {
      const targetItem = cart.items.find((item: any) => item.product.toString() === productId);
      if (targetItem) {
        existingQuantity = targetItem.quantity;
        itemExists = true;
      }
    }
    
    // 2. The Stock Guard
    if (existingQuantity + quantity > product.stock) {
      throw new Error(`Cannot add to cart. Only ${product.stock} left in stock.`);
    }

    // 3. The Atomic Updates
    if (cart) {
      if (itemExists) {
        // ATOMIC INCREMENT: Safely adds to existing quantity
        await Cart.updateOne(
          { user: userId, "items.product": productId },
          { $inc: { "items.$.quantity": quantity } }
        );
      } else {
        // ATOMIC PUSH: Safely shoves a new item into the array
        await Cart.updateOne(
          { user: userId },
          { $push: { items: { product: productId, quantity } } }
        );
      }
      
      // 4. Return the fresh, populated cart (Don't forget to populate 'user' for Apollo!)
      return await Cart.findById(cart._id).populate('items.product').populate('user');

    } else {
      // 5. Create fresh cart
      const newCart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
      return await Cart.findById(newCart._id).populate('items.product').populate('user');
    }
  } catch (error: any) {
    console.error("Add to cart error:", error);
    // Preserves your custom stock limit error so the frontend can read it!
    throw new Error(error.message || "Server error adding to cart");
  }
};

export const getCart = async (_: any, __: any, context: any) => {
  try {
    const userId = context.user?._id;
    if (!userId) throw new Error("Not authenticated");

    const cart = await Cart.findOne({ user: userId }).populate('items.product'); 

    if (!cart) {
      return { items: [] }; 
    }
    return cart;
  } catch (error) {
    console.error("Get cart error:", error);
    throw new Error("Server error fetching cart");
  }
};

export const removeFromCart = async (_: any, args: { productId: string }, context: any) => {
  try {
    const userId = context.user?._id;
    if (!userId) throw new Error("Not authenticated");
    
    const productId = args.productId; 

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.markModified('items');

    await cart.save();
const populatedCart = await Cart.findById(cart._id).populate('items.product');

return populatedCart;

  } catch (error) {
    console.error("Remove from cart error:", error);
    throw new Error("Server error removing item");
  }
};

export const decreaseQuantity = async (_: any, args: { productId: string }, context: any) => {
  try {
    const userId = context.user?._id;
    if (!userId) throw new Error("Not authenticated");
    
    const productId = args.productId;

    // 1. Fetch just to check the current state (no saving allowed!)
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) throw new Error("Cart not found");

    const targetItem = cart.items.find((item: any) => item.product.toString() === productId);

    if (targetItem) {
      if (targetItem.quantity > 1) {
        // ATOMIC DECREMENT: Safely subtracts 1 directly in the database queue
        await Cart.updateOne(
          { user: userId, "items.product": productId },
          { $inc: { "items.$.quantity": -1 } }
        );
      } else {
        // ATOMIC PULL: Safely yanks the specific item out of the array
        await Cart.updateOne(
          { user: userId },
          { $pull: { items: { product: productId } } }
        );
      }
    }

    // 2. Fetch the fresh, safely updated cart to send back to Apollo
    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('user'); 

    return populatedCart;

  } catch (error) {
    console.error("Decrease quantity error:", error);
    throw new Error("Server error decreasing item");
  }
};