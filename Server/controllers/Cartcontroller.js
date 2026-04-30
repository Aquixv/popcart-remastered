const Cart = require('../models/Cart');

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body; 
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      let itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
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

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
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
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
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
const decreaseQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
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
module.exports = { addToCart, getCart, removeFromCart, decreaseQuantity };