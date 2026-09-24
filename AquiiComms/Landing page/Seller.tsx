import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import ProfilePicUpload from './profilepic';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_SELLER_PRODUCTS, GET_USER_PROFILE, GET_SELLER_REVENUE } from '../graphql/queries';
import { UPDATE_PRODUCT, DELETE_PRODUCT } from '../graphql/mutations';
import type { Product, UserProfile, UserInfo } from './types';
import './Dashboard.css'; // Make sure this is imported!

interface getUserProfileQuery {
  getUserProfile: UserProfile;
}

interface GetRevenueQuery {
  getSellerRevenue: {
    totalRevenue: number;
    totalItemsSold: number;
  };
}

interface GetProductsQuery {
  getSellerProducts: Product[];
}

const Seller = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'myProducts' | 'addProduct' | 'analytics'>('myProducts');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Tech');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || "null") as UserInfo | null;

  const { data: profileData, error: profileError } = useQuery<getUserProfileQuery>(GET_USER_PROFILE, {
    context: { headers: { Authorization: `Bearer ${userInfo?.token}` } }
  });

  useEffect(() => {
    if (profileError) {
      localStorage.removeItem('userInfo');
      navigate('/login');
    }
  }, [profileError, navigate]);

  const { data: productsData, loading: loadingProducts } = useQuery<GetProductsQuery>(GET_SELLER_PRODUCTS, {
    skip: activeTab !== 'myProducts',
    context: { headers: { Authorization: `Bearer ${userInfo?.token}` } },
    fetchPolicy: 'network-only' 
  });

  const { data: analyticsData, loading: loadingAnalytics } = useQuery<GetRevenueQuery>(GET_SELLER_REVENUE, {
    skip: activeTab !== 'analytics',
    context: { headers: { Authorization: `Bearer ${userInfo?.token}` } }
  });
  
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_SELLER_PRODUCTS }] 
  });

  const profile = profileData?.getUserProfile;
  const myProducts: Product[] = productsData?.getSellerProducts || [];
  const revenueData = analyticsData?.getSellerRevenue || { totalRevenue: 0, totalItemsSold: 0 };

  const handleUpdateStock = async (productId: string, currentStock: number) => {
    const stockStr = window.prompt("Update Stock Quantity:", currentStock.toString());
    if (stockStr === null || stockStr.trim() === "") return; 

    const updatedStock = parseInt(stockStr);
    if (isNaN(updatedStock) || updatedStock < 0) {
      alert("Please enter a valid number!");
      return;
    }

    try {
      await updateProduct({ variables: { productId, stock: updatedStock } });
      alert("✅ Stock Updated!");
    } catch (error: any) {
      console.error("Update stock error:", error);
      alert(error.message || "Server error while updating stock.");
    }
  };

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) { alert("Please upload a product image!"); return; }

    setIsPublishing(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${userInfo?.token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Product published successfully!");
        setTitle(''); setPrice(''); setStock(''); setDescription(''); setImage(null);
      } else {
        alert(data.message || "Failed to publish product");
      }
    } catch (error) {
      alert("Something went wrong hitting the server.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      try {
        await deleteProduct({ variables: { productId } });
      } catch (error: any) {
        alert(error.message || "Failed to delete product");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profile) return <div className="empty-state" style={{marginTop: '100px'}}>Loading your seller profile...</div>;

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
            <button className={`tab-btn ${activeTab === 'myProducts' ? 'active' : ''}`} onClick={() => setActiveTab('myProducts')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              My Products
            </button>
            <button className={`tab-btn ${activeTab === 'addProduct' ? 'active' : ''}`} onClick={() => setActiveTab('addProduct')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add New Product
            </button>
            <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              Store Analytics
            </button>
            
            <Link to="/account" style={{ textDecoration: 'none', marginTop: '16px', display: 'block' }}>
              <button className="tab-btn" style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Switch to Buying
              </button>
            </Link>
            
            <button className="tab-btn danger-btn" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Log Out
            </button>
          </nav>
        </div>

        {/* CONTENT AREA */}
        <div className="dashboard-content">
          
          {activeTab === 'myProducts' && (
            <div className="fade-in">
              <h2 className="section-title">My Store Inventory</h2>
              
              {loadingProducts ? (
                <div className="empty-state">Loading your inventory...</div>
              ) : myProducts.length === 0 ? (
                <div className="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                  <h3>No Products Yet</h3>
                  <p>You haven't published any products to your store.</p>
                  <button onClick={() => setActiveTab('addProduct')} className="primary-btn">Create First Product</button>
                </div>
              ) : (
                <div className="inventory-grid">
                  {myProducts.map(product => (
                    <div key={product._id} className="inventory-card">
                      <div className="inventory-img-wrapper">
                        <img src={product.thumbnail} alt={product.title} />
                      </div>
                      <div className="inventory-details">
                        <h4 title={product.title}>{product.title}</h4>
                        <p className="inventory-price">${product.price.toFixed(2)}</p>
                        
                        <div className="inventory-metrics">
                          <div className="metric-group">
                            <span>Stock: {product.stock}</span>
                            <button className="edit-stock-btn" onClick={() => handleUpdateStock(product._id, product.stock)}>✎</button>
                          </div>
                          <span className="metric-sold">Sold: {product.sold || 0}</span>
                        </div>
                        
                        <button onClick={() => handleDeleteProduct(product._id)} className="secondary-btn danger-btn-outline">
                          Delete Product
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addProduct' && (
            <div className="fade-in">
              <h2 className="section-title">Add a New Product</h2>

              <form onSubmit={handleProductSubmit} className="settings-card form-card">
                <div className="form-group">
                  <label>Product Title</label>
                  <input type="text" className="form-input" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Wireless Noise-Cancelling Headphones" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input type="number" className="form-input" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="99.99" />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input type="number" className="form-input" required value={stock} onChange={(e) => setStock(e.target.value)} placeholder="50" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Tech">Tech</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-input form-textarea" rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product..."></textarea>
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input type="file" accept="image/*" required onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="form-file-input" />
                  {image && (
                    <div className="image-preview">
                      <img src={URL.createObjectURL(image)} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={isPublishing} className="primary-btn submit-btn">
                    {isPublishing ? 'Publishing to Store...' : 'Publish Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="fade-in">
              <h2 className="section-title">Store Analytics</h2>
              
              {loadingAnalytics ? (
                <div className="empty-state">Loading your analytics...</div>
              ) : (
                <div className="analytics-grid">
                  <div className="analytics-card success-card">
                    <h3>${revenueData.totalRevenue.toFixed(2)}</h3>
                    <p>Total Revenue</p>
                  </div>
                  <div className="analytics-card primary-card">
                    <h3>{revenueData.totalItemsSold}</h3>
                    <p>Items Sold</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Seller;