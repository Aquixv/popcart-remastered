import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import ProfilePicUpload from './profilepic';
import type { UserProfile, Order, UserInfo, OrderItem } from './types'; 
import { useApolloClient } from '@apollo/client/react';
import { UPGRADE_TO_SELLER } from '../graphql/mutations';
import { GET_USER_PROFILE, GET_ORDERS } from '../graphql/queries';
import './Dashboard.css'
interface GetUpgradeResponse {
      upgradeToSeller: UserInfo;
    }

 interface GetOrderResponse {
        getMyOrders: Order[];
 }
  interface GetUserProfileResponse {
        getUserProfile: UserProfile;
 }

const Account = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'selling' | 'settings'>('profile');
  const client = useApolloClient();
  
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || "null") as UserInfo | null;
  
  const handleUpgradeToSeller = async () => {
    if (!userInfo?.token) return; 

    setIsUpgrading(true);

    try {
      const { data } = await client.mutate<GetUpgradeResponse>({
        mutation: UPGRADE_TO_SELLER,
        context: {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        }
      });
      const updatedUser = data?.upgradeToSeller || null;

      if (updatedUser) {
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        window.location.reload(); 
      } else {
        throw new Error("No data returned from upgrade");
      }

    } catch (error) {
      console.error("Upgrade error:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong!");
      }
    } finally {
      setIsUpgrading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders' && userInfo?.token) {
      const fetchOrders = async () => {
        try {
         const { data } = await client.query<GetOrderResponse>({
                 query: GET_ORDERS,
                 context: {
                   headers: { Authorization: `Bearer ${userInfo.token}` }
                 },
                 fetchPolicy: 'network-only' 
               });
             setMyOrders(data?.getMyOrders || []);
        } catch (error) {
          console.error("Error fetching Orders:", error);
          if (error instanceof Error) {
            alert(error.message);
          } else {
            alert("Something went wrong!");
          }
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
        const { data } = await client.query<GetUserProfileResponse>({
                 query: GET_USER_PROFILE,
                 context: {
                   headers: { Authorization: `Bearer ${userInfo.token}` }
                 },
                 fetchPolicy: 'network-only' 
               });

        if (data?.getUserProfile) {
          setProfile(data.getUserProfile); 
        } else {
          throw new Error("No profile data returned");
        }

      } catch (error) {
        console.error("Fetch profile error:", error);
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate, userInfo?.token, client]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profile) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading your profile...</div>;

  return (
    <div style={{ minHeight: '80vh', padding: '60px 5%', backgroundColor: '#f9fafb' }}>
      <div className="dashboard-layout">
        
        {/* SIDEBAR */}
        <div className="dashboard-sidebar">
          <div className="sidebar-profile">
            <div className="profile-upload-bounds">
              <ProfilePicUpload />
            </div>
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>
          </div>

          <nav className="dashboard-nav">
            <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              My Profile
            </button>
            <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Order History
            </button>
            <button className={`tab-btn ${activeTab === 'selling' ? 'active' : ''}`} onClick={() => setActiveTab('selling')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              {profile.role === 'admin' ? 'Admin' : profile.role === 'seller' ? 'Seller Dashboard' : 'Start Selling'}
            </button>
            <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Settings
            </button>

            <button className="tab-btn danger-btn" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Log Out
            </button>
          </nav>
        </div>
        
        {/* CONTENT AREA */}
        <div className="dashboard-content">
          
          {activeTab === 'profile' && (
            <div className="fade-in">
              <h2 className="section-title">Profile Details</h2>
              <div className="settings-card">
                <div className="settings-row">
                  <span className="settings-label">Full Name</span>
                  <span className="settings-value">{profile.name}</span>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Email Address</span>
                  <span className="settings-value">{profile.email}</span>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Account Type</span>
                  <span className="role-badge">{profile.role}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="fade-in">
              <h2 className="section-title">Order History</h2>
              
              {loadingOrders ? (
                <div className="empty-state">Loading your orders...</div>
              ) : myOrders.length === 0 ? (
                <div className="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <h3>No orders yet</h3>
                  <p>When you buy something, it will appear here.</p>
                  <Link to="/">
                    <button className="primary-btn2">Start Shopping</button>
                  </Link>
                </div>
              ) : (
                <div className="orders-container">
                  {myOrders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-id-group">
                          <span className="order-id">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                          <span className="order-date">{new Date(Number(order.createdAt)).toLocaleDateString()}</span>
                        </div>
                        <div className="order-status-group">
                          <span className="order-total">${order.totalPrice.toFixed(2)}</span>
                          <span className={`status-badge ${order.isPaid ? 'paid' : 'pending'}`}>
                            {order.isPaid ? 'Paid via Paystack' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    
                      <div className="order-items-list">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="order-item">
                            <img src={item.product?.thumbnail} alt={item.name} />
                            <div className="order-item-details">
                              <p className="item-name">{item.name}</p>
                              <p className="item-meta">Qty: {item.quantity} <span>•</span> ${item.price.toFixed(2)} each</p>
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
            <div className="fade-in">
              <h2 className="section-title">Account Settings</h2>
              <div className="settings-card">
                <div className="settings-row">
                  <span className="settings-label">Password</span>
                  <button className="secondary-btn">Change Password</button>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Shipping Addresses</span>
                  <button className="secondary-btn">Manage</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'selling' && (
            <div className="fade-in">
              <h2 className="section-title">Seller Hub</h2>
              <div className="action-card">
                {profile?.role === 'customer' ? (
                  <>
                    <h3>Ready to start selling?</h3>
                    <p>Open your own store and reach millions of customers today.</p>
                    <button onClick={handleUpgradeToSeller} disabled={isUpgrading} className="primary-btn2">
                      {isUpgrading ? 'Upgrading...' : 'Become a Seller'}
                    </button>
                  </>
                ) : profile?.role === 'seller' ? (
                  <>
                    <h3>Seller Dashboard</h3>
                    <p>Manage your products, view orders, and track your revenue.</p>
                    <Link to="/seller-dashboard">
                      <button className="primary-btn2 success-btn">Switch to Selling</button>
                    </Link>
                  </>
                ) : (
                  <Link to="/admin-dashboard">
                    <button className="primary-btn2 danger-btn-solid">Admin Dashboard</button>
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