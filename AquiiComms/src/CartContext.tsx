import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [authCart, setAuthCart] = useState(null); 
  
  const [guestCart, setGuestCart] = useState(() => {
    const saved = localStorage.getItem('guestCart');
    return saved ? JSON.parse(saved) : [];
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isLoggedIn = userInfo && userInfo.token;

  const displayCart = { items: isLoggedIn && authCart ? authCart.items : guestCart };

  const cartCount = displayCart.items.reduce((total, item) => total + item.quantity, 0);

  const fetchCart = async () => {
    if (!isLoggedIn) return; 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/cart`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAuthCart(data);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          },
          body: JSON.stringify({ productId: product._id, quantity }) 
        });
        if (response.ok) fetchCart();
      } catch (error) {
        console.error("Failed to add to auth cart", error);
      }
    } const updatedCart = [...guestCart];
const existingItemIndex = updatedCart.findIndex(item => item?.product?._id === product._id);

if (existingItemIndex >= 0) {
  updatedCart[existingItemIndex].quantity += 1;
} else {
  updatedCart.push({ product: product, quantity: 1 });
}
setGuestCart(updatedCart);
localStorage.setItem('guestCart', JSON.stringify(updatedCart));
  };

  const removeFromCart = async (productId) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/cart/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        if (response.ok) fetchCart();
      } catch (error) {
        console.error("Failed to remove item", error);
      }
    } else {
      const updatedCart = guestCart.filter(item => item.product._id !== productId);
      setGuestCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    }
  };
const decreaseQuantity = async (productId) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/cart/${productId}/decrease`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        if (response.ok) fetchCart();
      } catch (error) {
        console.error("Failed to decrease item", error);
      }
    } else {
      const updatedCart = [...guestCart];
      const itemIndex = updatedCart.findIndex(item => item.product._id === productId);

      if (itemIndex > -1) {
        if (updatedCart[itemIndex].quantity > 1) {
          updatedCart[itemIndex].quantity -= 1;
        } else {
          updatedCart.splice(itemIndex, 1);
        }
        setGuestCart(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      }
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart: displayCart, cartCount, addToCart, removeFromCart, fetchCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);