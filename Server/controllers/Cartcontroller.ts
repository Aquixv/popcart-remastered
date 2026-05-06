import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; 
import Cart from '../models/Cart'; 
import Product from '../models/Product';

export const addToCart = async (req: AuthRequest, res: Response): Promise<any> => {
  const { productId, quantity }: { productId: string; quantity: number } = req.body; 
  const userId = req.user?._id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    let existingQuantity = 0;
    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        existingQuantity = cart.items[itemIndex].quantity;
      }
    }
    if (existingQuantity + quantity > product.stock) {
      return res.status(400).json({ 
        message: `Cannot add to cart. Only ${product.stock} left in stock.` 
      });
    }

    if (cart) {
      let itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId as any, quantity });
      }
      
      cart = await cart.save();
      return res.status(200).json(cart);

    } else {
      const newCart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Server error adding to cart" });
  }
};

export const getCart = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id })
      .populate('items.product'); 

    if (!cart) {
      return res.status(200).json({ items: [] }); 
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ message: "Server error fetching cart" });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id;
    const productId = req.params.productId; 

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await cart.save();
    return res.status(200).json(cart);

  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({ message: "Server error removing item" });
  }
};

export const decreaseQuantity = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id;
    const productId = req.params.productId;

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
      }
      
      await cart.save();
      return res.status(200).json(cart);
    }

  } catch (error) {
    console.error("Decrease quantity error:", error);
    return res.status(500).json({ message: "Server error decreasing item" });
  }
};