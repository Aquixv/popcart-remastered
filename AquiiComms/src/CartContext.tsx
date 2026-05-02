import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { CartData, CartItem, Product, UserInfo, CartContextType } from './types';
const CartContext = createContext<CartContextType | null>(null);
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [authCart, setAuthCart] = useState<CartData | null>(null); 

  const [guestCart, setGuestCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('guestCart');
    return saved ? JSON.parse(saved) : [];
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || "null") as UserInfo | null;
  const isLoggedIn = userInfo && userInfo.token;
  const displayCart: CartData = { items: isLoggedIn && authCart ? authCart.items : guestCart };

  const cartCount = displayCart.items.reduce((total, item) => total + item.quantity, 0);

  const fetchCart = async () => {
    if (!isLoggedIn) return; 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/cart`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAuthCart(data);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const addToCart = async (product: Product, quantity = 1) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`
          },
          body: JSON.stringify({ productId: product._id, quantity }) 
        });
        if (response.ok) fetchCart();
      } catch (error) {
        console.error("Failed to add to auth cart", error);
      }
    } 
    
    const updatedCart = [...guestCart];
    const existingItemIndex = updatedCart.findIndex(item => item?.product?._id === product._id);

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({ product: product, quantity: 1 });
    }
    setGuestCart(updatedCart);
    localStorage.setItem('guestCart', JSON.stringify(updatedCart));
  };

  const removeFromCart = async (productId: string) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/cart/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo?.token}` }
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
  const decreaseQuantity = async (productId: string) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/cart/${productId}/decrease`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${userInfo?.token}` }
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};