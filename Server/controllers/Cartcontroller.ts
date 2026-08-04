import Cart from '../models/Cart'; 
import Product from '../models/Product';

export const addToCart = async (_: any, args: { productId: string; quantity: number }, context: any) => {
  const { productId, quantity } = args; 
  const userId = context.user?._id;

  if (!userId) throw new Error("Not authenticated");

  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ user: userId });

    let existingQuantity = 0;
    if (cart) {
      const itemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId);
      if (itemIndex > -1) {
        existingQuantity = cart.items[itemIndex].quantity;
      }
    }
    
    if (existingQuantity + quantity > product.stock) {
      throw new Error(`Cannot add to cart. Only ${product.stock} left in stock.`);
    }

    if (cart) {
      let itemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId as any, quantity });
      }
      
      cart = await cart.save();
      return cart;

    } else {
      const newCart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
      return newCart;
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    throw new Error("Server error adding to cart");
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

    cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);

    await cart.save();
    return cart;

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

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    let itemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);
      }
      
      await cart.save();
      return cart;
    }

    return cart;
  } catch (error) {
    console.error("Decrease quantity error:", error);
    throw new Error("Server error decreasing item");
  }
};
