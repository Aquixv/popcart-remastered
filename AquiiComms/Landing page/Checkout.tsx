import React, { useState } from 'react';
import { useCart } from '../src/CartContext'; 
import { PaystackButton } from 'react-paystack';
import { useNavigate } from 'react-router-dom';
import type { ShippingAddress, UserInfo } from './types';
import { useApolloClient } from '@apollo/client/react';
import { CREATE_ORDER } from '../graphql/mutations';
import './Checkout.css'
type PaystackResponse = {
  reference: string;
  status: string;
};
const Checkout = () => {
  const { cart, cartCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const client = useApolloClient()

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
  address: '',
  city: '',
  postalCode: '',
  country: ''
});

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || "null") as UserInfo | null;
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
    } as any,
    text: `Pay $${totalAmount.toFixed(2)} Now`,
    onSuccess: async (response: PaystackResponse) => {
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
        
      const { data } = await client.mutate({
  mutation: CREATE_ORDER, 
  variables: {
    orderItems: formattedItems,
    shippingAddress,
    paymentMethod: "Paystack", 
    paymentResult: {
      id: response.reference,
      status: response.status,
      email_address: userInfo?.email
    },
    itemsPrice: totalAmount,
    shippingPrice: 0.00,
    totalPrice: totalAmount
  },
  context: {
    headers: { Authorization: `Bearer ${userInfo?.token}` }
  }
});

      // 4. Success block!
      console.log("✅ Order saved to database!");
      localStorage.removeItem('guestCart');
      fetchCart(); 
      navigate('/delivery'); 

    } catch (error) {
      // 5. Catch block handles network failures AND server rejections
      console.error("❌ Checkout mutation failed:", error);
      if (error instanceof Error) {
        alert(`Database Error: ${error.message}`);
      } else {
        alert("Something went wrong saving the order!");
      }
    }
  },
  onClose: () => {
    alert("Wait! Complete Checkout!");
  },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };
  if (!cart || !cart.items || cart.items.length === 0) {
  return (
    <div className="empty-cart-container">
      <h2>Your Cart is Empty</h2>
      <button className="primary-action-btn" onClick={() => navigate('/')}>
        Go Shopping
      </button>
    </div>
  );
}

const isFormIncomplete = !shippingAddress.address || !shippingAddress.city || !shippingAddress.country;

return (
  <div className="checkout-container">
    <div className="checkout-summary">
      <h3>Order Summary ({cartCount} Items)</h3>
      <p className="checkout-total">Total: ${totalAmount.toFixed(2)}</p>
    </div>
    
    <div className="checkout-form">
      <h3>Shipping Address</h3>
      <div className="input-group">
        <input type="text" name="address" placeholder="Street Address" onChange={handleInputChange} required />
        <input type="text" name="city" placeholder="City" onChange={handleInputChange} required />
        <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleInputChange} required />
        <input type="text" name="country" placeholder="Country" onChange={handleInputChange} required />
      </div>
    </div>

    <div className={`checkout-action ${isFormIncomplete ? 'disabled' : ''}`}>
      <PaystackButton className="paystack-btn" {...paystackProps} />
    </div>
  </div>
);
}
export default Checkout;