import React, { createContext, useState, useContext, useEffect } from 'react';
import type { FavoritesContextType, Product, UserInfo } from './types';
const FavoritesContext = createContext<FavoritesContextType | null>(null);
import {GET_FAVORITES} from '../graphql/queries'
import { TOGGLE_FAVORITE } from '../graphql/mutations';
import { useApolloClient } from '@apollo/client/react';

interface GetFavoritesResponse {
      getFavorites: Product[];
    }

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const client = useApolloClient();

  const fetchFavorites = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    if (!userInfo || !userInfo.token) {
      setFavorites([]);
      return;
    }
    try {
      const { data } = await client.query<GetFavoritesResponse>({
        query: GET_FAVORITES,
        context: {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        },
        fetchPolicy: 'network-only' 
      });
      const favoriteProducts = data?.getFavorites as Product[];
      const favoriteIds = favoriteProducts.map(item => item._id);
      
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Failed to fetch favorites via GraphQL", error);
    }
  }

  const toggleFavorite = async (productId:string) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    if (!userInfo || !userInfo.token) {
      alert("Please log in to save your favorite items!");
      return;
    }

    const isAlreadyFavorited = favorites.includes(productId);
    if (isAlreadyFavorited) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]); 
    }

    try {
      await client.mutate({
        mutation: TOGGLE_FAVORITE,
        context: {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        }
      })
    } catch (error) {
      console.error("Failed to toggle favorite on server", error);
      fetchFavorites(); 
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  
  return context;
};