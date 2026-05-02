import { Product } from './types';
import React, { useEffect, useState } from 'react';
import './Products.css';
import { Link } from 'react-router-dom';
import { useCart } from '../src/CartContext';
import { useFavorites } from '../src/FavoritesContext';

type ProductCardProps = {
  product: Product;
  mode?: 'new' | 'deal' | 'regular';
};

const ProductCard = ({ product, mode } :ProductCardProps) => {

  const [isFavorite, setIsFavorite] = useState(false);
  
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorited = favorites.includes(product._id);
const { addToCart } = useCart();

const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (window.innerWidth <= 768) {
   addToCart(product, 1);
    return;
  }
    e.preventDefault();
    e.stopPropagation(); 
    const target = e.target as HTMLElement;
    
    const card = target.closest('.product-card');
    const img = card?.querySelector('img');
    const cartIcon = document.querySelector('.nav-actions .cart-icon');

    if (!img || !cartIcon) {
      addToCart(product, 1);
      return;
    }

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImg = document.createElement('img');
    flyingImg.src = product.thumbnail;
    flyingImg.style.position = 'fixed';
    flyingImg.style.left = `${imgRect.left}px`;
    flyingImg.style.top = `${imgRect.top}px`;
    flyingImg.style.width = `${imgRect.width}px`;
    flyingImg.style.height = `${imgRect.height}px`;
    flyingImg.style.borderRadius = '50%'; 
    flyingImg.style.objectFit = 'cover';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    
    document.body.appendChild(flyingImg);

    setTimeout(() => {
      flyingImg.style.left = `${cartRect.left + 10}px`;
      flyingImg.style.top = `${cartRect.top + 10}px`;
      flyingImg.style.width = '20px';
      flyingImg.style.height = '20px';
      flyingImg.style.opacity = '0.2';
    }, 10);

    setTimeout(() => {
      flyingImg.remove();
      addToCart(product, 1);
      
      cartIcon.classList.add('pop-animation');
      setTimeout(() => cartIcon.classList.remove('pop-animation'), 300);
    }, 800);
  };
  return (
    <div className="product-card">
      {mode === 'new' && (
        <div className="badge new-badge" style={{ position: 'absolute', top: 150, left: 10, background: '#000', color: '#fff', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', zIndex: 10 }}>
          NEW
        </div>
      )}
      {mode === 'deal' && (
        <div className="badge deal-badge" style={{ position: 'absolute', top: 150, left: 10, background: '#ff4757', color: '#fff', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', zIndex: 10 }}>
          -{Math.round(product.discountPercentage)}%
        </div>
      )}
      <div className="wishlist-icon" onClick={() => toggleFavorite(product._id)}>
        {isFavorited ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
            <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-suit-heart" viewBox="0 0 16 16">
            <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
          </svg>
        )}
      </div>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="image-container">
          <img src={product.thumbnail} alt={product.title} />
        </div>
        <div className="product-info">
          <div className="title-price">
            <h3>{product.title}</h3>
            {mode === 'deal' ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="price" style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>${originalPrice}</span>
                  <span className="price" style={{ color: '#ff4757' }}>${product.price}</span>
                </div>
              ) : (
                <span className="price">${product.price}</span>
              )}
          </div>
          <p className="description">
  {product.description 
    ? `${product.description.substring(0, 50)}...` 
    : 'No description available.'}
</p>
          <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '10px' }}>
            {[...Array(Math.round(product.rating))].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#000" className="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
            ))}
            <span style={{ marginLeft: '5px' }}>( {product.stock})</span>
          </div>
        </div>
      </Link>

      <div style={{ padding: '0 20px 20px 20px', marginTop: 'auto' }}>
        <button className="add-to-cart-btn" onClick={handleAddToCart} style={{ width: '100%' }}>Add to Cart</button>
      </div>
    </div>
  );
};
export default ProductCard;