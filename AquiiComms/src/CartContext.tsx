import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_CART } from '../graphql/queries';
import { ADD_TO_CART, REMOVE_FROM_CART, DECREASE_QUANTITY } from '../graphql/mutations';

import type { CartData, CartItem, Product, UserInfo, CartContextType } from './types';

const CartContext = createContext<CartContextType | null>(null);

interface GetCartResponse {
  getCart: {
    items: CartItem[];
  };
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [guestCart, setGuestCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('guestCart');
    return saved ? JSON.parse(saved) : [];
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || "null") as UserInfo | null;
  const isLoggedIn = Boolean(userInfo && userInfo.token);
  const { data, refetch } = useQuery<GetCartResponse>(GET_CART, {
    skip: !isLoggedIn, 
  });
  const [addToCartMutation] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_CART }]
  });
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, {
    refetchQueries: [{ query: GET_CART }]
  });
  const [decreaseQuantityMutation] = useMutation(DECREASE_QUANTITY, {
    refetchQueries: [{ query: GET_CART }]
  });
  const authCart = data?.getCart;
  const displayCart: CartData = { items: isLoggedIn && authCart ? authCart.items : guestCart };
  const cartCount = displayCart.items.reduce((total, item) => total + item.quantity, 0);

  const addToCart = async (product: Product, quantity = 1) => {
    if (isLoggedIn) {
      try {
        await addToCartMutation({
          variables: { productId: product._id, quantity }
        });
      } catch (error) {
        console.error("Failed to add to auth cart", error);
      }
    } else {
      const updatedCart = [...guestCart];
      const existingItemIndex = updatedCart.findIndex(item => item?.product?._id === product._id);

      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart.push({ product: product, quantity: 1 });
      }
      setGuestCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isLoggedIn) {
      try {
        await removeFromCartMutation({
          variables: { productId }
        });
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
        await decreaseQuantityMutation({
          variables: { productId }
        });
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
const fetchCart = async () => {
    if (isLoggedIn) {
      await refetch();
    }
  };
  
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
//Filler