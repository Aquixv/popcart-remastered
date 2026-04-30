import React, { useState } from 'react';
import { useCart } from '../src/CartContext'; 
import { PaystackButton } from 'react-paystack';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartCount, fetchCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
 const totalAmount = cart?.items?.reduce((total, item) => {
    if (!item || !item.product || !item.product.price) return total;
    return total + (item.product.price * item.quantity);
  }, 0) || 0;

  const publicKey = "pk_test_aed41b8546b5826ba7e2d0c06029c6acc73ccbfa"; 
  const paystackProps = {
    email: userInfo?.email || "guest@example.com",
    amount: Math.round(totalAmount * 100), 
    publicKey,
    metadata: {
      name: userInfo?.name,
    },
    text: `Pay $${totalAmount.toFixed(2)} Now`,
    onSuccess: async (response) => {
      console.log("💳 Paystack Success!", response);
      
      try {
        const formattedItems = cart.items
          .filter(item => item && item.product && item.product._id)
          .map(item => ({
            name: item.product.title, 
            quantity: item.quantity,
            image: item.product.thumbnail, 
            price: item.product.price,
            product: item.product._id
          }));

        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`
          },
          body: JSON.stringify({
            orderItems: formattedItems,
            shippingAddress,
            paymentResult: {
              id: response.reference,
              status: response.status,
              email_address: userInfo?.email
            },
            itemsPrice: totalAmount,
            totalPrice: totalAmount
          })
        });

        if (res.ok) {
          console.log("✅ Order saved to database!");
          localStorage.removeItem('guestCart');
          fetchCart(); 
          navigate('/delivery'); 
        } else {
          const errorData = await res.json();
          console.error("❌ Backend rejected order:", errorData);
          alert(`Database Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("❌ Fetch failed entirely:", error);
      }
    },
    onClose: () => {
      alert("Wait! Complete Checkout!");
    },
  };

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Your Cart is Empty</h2>
        <button style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => navigate('/')}>Go Shopping</button>
      </div>
    );
  }
  const isFormIncomplete = !shippingAddress.address || !shippingAddress.city || !shippingAddress.country;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Order Summary ({cartCount} Items)</h3>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: ${totalAmount.toFixed(2)}</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>Shipping Address</h3>
        <input type="text" name="address" placeholder="Street Address" onChange={handleInputChange} required style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
        <input type="text" name="city" placeholder="City" onChange={handleInputChange} required style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}/>
        <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleInputChange} required style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}/>
        <input type="text" name="country" placeholder="Country" onChange={handleInputChange} required style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
      </div>

      <div style={{
        opacity: isFormIncomplete ? 0.5 : 1, 
        pointerEvents: isFormIncomplete ? 'none' : 'auto'
      }}>
        <PaystackButton  className='pay' 
          {...paystackProps} 
          style={{ 
            width: '100%', padding: '16px', background: 'green', color: 'white', 
            border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};

export default Checkout;