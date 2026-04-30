import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Landing page/Productcard'; // Adjust this path to your actual component!
import { useFavorites } from '../src/FavoritesContext'; // Adjust path

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // We bring in the context just to listen for changes. 
  // If a user "un-hearts" an item on this page, this array updates and triggers a re-fetch!
  const { favorites } = useFavorites(); 

  useEffect(() => {
    const fetchFullFavorites = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/favorites`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });

        if (response.ok) {
          const data = await response.json();
          // Because your backend `getFavorites` controller uses `.populate('favorites')`,
          // this 'data' is an array of fully-fleshed-out product objects!
          setFavoriteProducts(data);
        }
      } catch (error) {
        console.error("Failed to load wishlist", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullFavorites();
  }, [favorites.length]); // Re-run this if they remove an item from their wishlist

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading your wishlist...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', minHeight: '60vh' }}>
      <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>My Wishlist</h2>
      
      {favoriteProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '10px' }}>
          <h3 style={{ color: '#666' }}>You haven't saved any items yet!</h3>
          <p style={{ marginBottom: '20px', color: '#999' }}>Find something you love and click the heart icon to save it for later.</p>
          <Link to="/">
            <button style={{ padding: '12px 25px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer' }}>
              Go Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {favoriteProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;