import React from 'react';
import { Link } from 'react-router-dom';
import { FiFrown, FiShoppingCart } from 'react-icons/fi'; 
import './EmptyCart.css';

const EmptyCart = () => {
  return (
    <div className="empty-cart-container">
      <FiFrown className="empty-cart-icon" />
      <h2 className="empty-cart-message">Your Cart is Empty</h2>
      <Link to="/" className="continue-shopping-btn">
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;