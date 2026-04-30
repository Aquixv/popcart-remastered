import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]); 


  const fetchFavorites = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      setFavorites([]);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/favorites`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const favoriteIds = data.map(item => item._id);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error("Failed to fetch favorites", error);
    }
  };

  const toggleFavorite = async (productId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

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
      await fetch(`${import.meta.env.VITE_API_URL}/users/auth/favorites/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
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

export const useFavorites = () => useContext(FavoritesContext);