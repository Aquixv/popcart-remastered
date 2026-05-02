import React from 'react';
import { useCart } from '../src/CartContext';
import { useNavigate } from 'react-router-dom';
import { Product } from './types';

const Cart = () => {
  const { cart, removeFromCart, addToCart, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  const calculateTotal = ():string => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      if (!item || !item.product || !item.product.price) return total; 
      
      return total + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Your Cart is Empty</h2>
        <button style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  const validCartItems = cart.items.filter(item => item && item.product && item.product._id);

  if (validCartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Your Cart has invalid items.</h2>
        <button style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => navigate('/')}>Go Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ borderTop: '1px solid transparent' }}>
        {validCartItems.map((item) => (
          <div 
            key={item.product._id} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}
          >
            <img 
              src={item.product?.thumbnail || 'https://via.placeholder.com/80'} 
              alt={item.product?.title || 'Unknown Product'} 
              style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
            />

            <div style={{ flex: 1, paddingLeft: '20px' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{item.product?.title || 'Item Unavailable'}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                <button 
                  onClick={() => decreaseQuantity(item.product._id)}
                  style={{ fontSize:'large', padding: '5px 12px', cursor: 'pointer', background: '#eee', border: '1px solid transparent', borderRadius: '4px' }}
                >
                  -
                </button>
                
                <p style={{ margin: 0, fontWeight: 'bold' }}>{item.quantity}</p>
                
                <button 
                  onClick={() => addToCart(item.product, 1)}
                  style={{ fontSize:'large', padding: '5px 12px', cursor: 'pointer', background: '#eee', border: '1px solid transparent', borderRadius: '4px' }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 'bold' }}>${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
              <button 
                onClick={() => removeFromCart(item.product._id)}
                style={{ background: 'none', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                <img style={{width:'25px', height:'25px'}} src="https://www.svgrepo.com/show/533014/trash-blank.svg" alt="Remove" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <h2>Total: ${calculateTotal()}</h2>
        <button 
          style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', borderRadius: '5px', cursor: 'pointer' }}
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;