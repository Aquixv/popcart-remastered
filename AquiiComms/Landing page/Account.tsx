import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import ProfilePicUpload from './profilepic';
import type { UserProfile, Order, UserInfo } from './types'; 

const Account = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'selling' | 'settings'>('profile');
  
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || "null") as UserInfo | null;
  
  const handleUpgradeToSeller = async () => {
    setIsUpgrading(true);
    try {
      if (!userInfo?.token) return; 

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/profile/upgrade`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        window.location.reload(); 
      } else {
        alert(data.message || "Failed to upgrade account");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Something went wrong!");
    } finally {
      setIsUpgrading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders' && userInfo?.token) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/orders`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setMyOrders(data);
          }
        } catch (error) {
          console.error("Failed to fetch orders", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, userInfo?.token]);
  
  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProfile(data);
        } else {
          localStorage.removeItem('userInfo');
          navigate('/login');
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profile) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading your profile...</div>;

  return (
    <div className="account-container" style={{ minHeight: '80vh', padding: '60px 5%', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        <div className="account-sidebar" style={{ flex: '1', minWidth: '250px', background: '#fff', borderRadius: '15px', padding: '20px', height: 'fit-content', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: '#000', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 10px' }}>
              {profile.name.charAt(0)}
              <ProfilePicUpload></ProfilePicUpload>
            </div>
            <h3 style={{ margin: '0', marginTop:'60px' }}>{profile.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0 0' }}>{profile.email}</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => setActiveTab('profile')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'profile' ? '#f0f0f0' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}> <img style={{ width:'4vw', height:'2vh' }} src="https://www.svgrepo.com/show/512729/profile-round-1342.svg" alt="" /> My Profile</button>
            <button onClick={() => setActiveTab('orders')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'orders' ? '#f0f0f0' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}> <img style={{ width:'4vw', height:'2vh' }} src="https://www.svgrepo.com/show/301014/boxes.svg" alt="" /> Order History</button>
            <button onClick={() => setActiveTab('selling')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'selling' ? '#f0f0f0' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}> 
              <img style={{ width:'4vw', height:'2vh' }} src="https://www.svgrepo.com/show/147833/three-dollars-bills.svg" alt="" /> 
              {profile.role === 'admin' ? ' Admin' : profile.role === 'seller' ? ' Seller Dashboard' : 'Selling'}
            </button>
            <button onClick={() => setActiveTab('settings')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'settings' ? '#f0f0f0' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}> <img style={{ width:'4vw', height:'2vh' }} src="https://www.svgrepo.com/show/527439/settings.svg" alt="" /> Settings</button>

            <button onClick={handleLogout} style={{ padding: '12px 15px', textAlign: 'left', background: '#fff0f0', color: '#d32f2f', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '20px' }}> <img style={{ width:'4vw', height:'2vh' }} src="https://www.svgrepo.com/show/472582/door-open.svg" alt="" /> Log Out</button>
          </nav>
        </div>
        
        <div className="account-content" style={{ flex: '3', minWidth: '300px', background: '#fff', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Profile Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase' }}>Full Name</label>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: '5px 0' }}>{profile.name}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase' }}>Email Address</label>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: '5px 0', overflowWrap: 'break-word', wordBreak:'break-all'}}>{profile.email}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase' }}></label>
                  <p style={{ fontSize: '0.9rem', background: '#000', color: '#fff', display: 'inline-block', padding: '4px 10px', borderRadius: '12px', margin: '5px 0' }}>{profile.role.toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Order History</h2>
              
              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading your orders...</div>
              ) : myOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <span style={{ fontSize: '4rem' }}> <img style={{ width:'10vw', height:'10vh' }} src="https://www.svgrepo.com/show/314988/shopping-bags.svg" alt="" /> </span>
                  <h3 style={{ margin: '20px 0 10px' }}>No orders yet</h3>
                  <p style={{ color: '#666', marginBottom: '20px' }}>When you buy something, it will appear here.</p>
                  <Link to="/">
                    <button style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Start Shopping</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {myOrders.map(order => (
                    <div key={order._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px', background: '#fafafa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>
                        <div>
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Order #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                          <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 'bold', color: '#4CAF50', fontSize: '1.1rem' }}>${order.totalPrice.toFixed(2)}</span>
                          <span style={{ display: 'block', fontSize: '0.85rem', color: '#1976d2', marginTop: '4px', fontWeight: '500' }}>
                            {order.isPaid ? 'Paid via Paystack' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {order.orderItems.map((item, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }} />
                            <div>
                              <p style={{ margin: '0', fontWeight: '500' }}>{item.name}</p>
                              <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>Qty: {item.quantity} | ${item.price.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Account Settings</h2>
              <p style={{ color: '#666' }}>Password changing and address management coming soon.</p>
            </div>
          )}
          
          {activeTab === 'selling' && (
            <div>
              <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                {profile?.role === 'customer' ? (
                  <>
                    <h3>Ready to start selling?</h3>
                    <p style={{ color: '#666', marginBottom: '15px' }}>
                      Open your own store and reach millions of customers today.
                    </p>
                    <button 
                      onClick={handleUpgradeToSeller} 
                      disabled={isUpgrading}
                      style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: isUpgrading ? 'not-allowed' : 'pointer' }}
                    >
                      {isUpgrading ? 'Upgrading...' : 'Become a Seller'}
                    </button>
                  </>
                ) : profile?.role === 'seller' ? (
                  <>
                    <h3>Seller Dashboard</h3>
                    <p style={{ color: '#666', marginBottom: '15px' }}>
                      Manage your products, view orders, and track your revenue.
                    </p>
                    <Link to="/seller-dashboard">
                      <button style={{ padding: '10px 20px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Switch to Selling
                      </button>
                    </Link>
                  </>
                ) : (
                  <Link to="/admin-dashboard">
                    <button style={{ padding: '10px 20px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      Admin Dashboard
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;