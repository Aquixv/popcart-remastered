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
  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);
  const [decreaseQuantityMutation] = useMutation(DECREASE_QUANTITY);
  const authCart = data?.getCart;
  const displayCart: CartData = { items: isLoggedIn && authCart ? authCart.items : guestCart };
  const cartCount = displayCart.items.reduce((total, item) => total + item.quantity, 0);

  const addToCart = async (product: Product, quantity = 1) => {
    if (isLoggedIn && authCart) {
      
      const existingItem = authCart.items.find(item => item.product._id === product._id);
      
      // Rebuild what the cart WILL look like
      const optimisticItems = existingItem
        ? authCart.items.map(item => 
            item.product._id === product._id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          )
        : [...authCart.items, { __typename: "CartItem", product, quantity }];

      try {
        await addToCartMutation({
          variables: { productId: product._id, quantity },
          optimisticResponse: {
            __typename: "Mutation",
            addToCart: { 
              ...authCart, // Magic fix: Copies the correct Cart _id and user fields!
              items: optimisticItems
            }
          }
        });
      } catch (error){
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
    if (isLoggedIn && authCart) {
      const optimisticItems = authCart.items.filter(item => item.product._id !== productId);

      try {
        await removeFromCartMutation({
          variables: { productId },
          optimisticResponse: {
            __typename: "Mutation",
            removeFromCart: {
              ...authCart, // Magic fix
              items: optimisticItems
            }
          }
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
  if (isLoggedIn && authCart) {
    // 1. Find the item we are about to change
    const targetItem = authCart.items.find(item => item.product._id === productId);
    if (!targetItem) return;

    // 2. Calculate the new quantity instantly
    const newQuantity = targetItem.quantity - 1;

    // 3. Rebuild the cart array exactly as it would look AFTER the server responds
    const optimisticItems = newQuantity > 0 
      ? authCart.items.map(item => 
          item.product._id === productId ? { ...item, quantity: newQuantity } : item
        )
      : authCart.items.filter(item => item.product._id !== productId);

    try {
      await decreaseQuantityMutation({
        variables: { productId },
        optimisticResponse: {
          __typename: "Mutation", 
          decreaseQuantity: { 
            ...authCart, // Magic fix
            items: optimisticItems
          }
        }
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