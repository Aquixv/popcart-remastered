import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import ProfilePicUpload from './profilepic';

const Seller = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myproducts, setMyproducts] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Tech');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [revenueData, setRevenueData] = useState({ totalRevenue: 0, totalItemsSold: 0 });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  const handleUpgradeToSeller = async () => {
    setIsUpgrading(true);
    try {
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
        alert(data.message || "Failed to upgrade Seller");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Something went wrong!");
    } finally {
      setIsUpgrading(false);
    }
  };
useEffect(() => {
    if (activeTab === 'myProducts' && userInfo) {
      const fetchMyProducts = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products/mine`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setMyProducts(data);
          }
        } catch (error) {
          console.error("Failed to fetch products", error);
        } finally {
          setLoadingProducts(false);
        }
      };
      fetchMyProducts();
    }
  }, [activeTab, userInfo]);
  useEffect(() => {
    if (activeTab === 'analytics' && userInfo) {
      const fetchAnalytics = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/orders/revenue`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setRevenueData(data);
          }
        } catch (error) {
          console.error("Failed to fetch analytics", error);
        } finally {
          setLoadingAnalytics(false);
        }
      };
      fetchAnalytics();
    }
  }, [activeTab, userInfo]);

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

  const handleProductSubmit = async (e) => {
   e.preventDefault();
    
    if (!image) {
      alert("Please upload a product image!");
      return;
    }

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
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          // NO Content-Type header here! The browser handles it automatically for FormData.
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product published successfully!");
        setTitle('');
        setPrice('');
        setStock('');
        setDescription('');
        setImage(null);
      } else {
        alert(data.message || "Failed to publish product");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Something went wrong hitting the server.");
    } finally {
      setIsPublishing(false);
    }
  };
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });

        if (response.ok) {
          setMyProducts(myProducts.filter(p => p._id !== productId));
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };
  if (!profile) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading your profile...</div>;

  return (
    <div className="Seller-container" style={{ minHeight: '80vh', padding: '60px 5%', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        <div className="Seller-sidebar" style={{ flex: '1', minWidth: '250px', background: '#fff', borderRadius: '15px', padding: '20px', height: 'fit-content', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: '#000', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 10px' }}>
              {profile.name.charAt(0)}
              <ProfilePicUpload></ProfilePicUpload>
            </div>
            <h3 style={{ margin: '0', marginTop:'60px' }}>{profile.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0 0' }}>{profile.email}</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => setActiveTab('myProducts')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'myProducts' ? '#f0f0f0' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}> <img style={{ width:'5vw', height:'3vh', marginBottom:'-6px' }}  src="https://www.svgrepo.com/show/520561/box-open.svg" alt="" /> My Products</button>
            <button onClick={() => setActiveTab('addProduct')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'addProduct' ? '#f0f0f0' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}> <img style={{ width:'4vw', height:'2vh' }}  src="https://www.svgrepo.com/show/532994/plus.svg" alt="" /> Add New Product</button>
            <button onClick={() => setActiveTab('analytics')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'analytics' ? '#f0f0f0' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}> <img style={{ width:'4vw', height:'2vh' }}  src="https://www.svgrepo.com/show/404805/bar-chart.svg" alt="" /> Store Analytics</button>
            <Link to="/account" style={{ textDecoration: 'none', marginTop: '20px' }}>
              <button style={{ width: '100%', padding: '12px 15px', textAlign: 'left', background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}> <img style={{ width:'4vw', height:'2vh'}}  src="https://www.svgrepo.com/show/521871/switch.svg" alt="" /> Switch to Buying</button>
            </Link>
            
            <button onClick={handleLogout} style={{ padding: '12px 15px', textAlign: 'left', background: '#fff0f0', color: '#d32f2f', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}> Log Out</button>
          </nav>
        </div>
        <div className="Seller-content" style={{ flex: '3', minWidth: '300px', background: '#fff', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {activeTab === 'myProducts' && (
            <div>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>My Store Inventory</h2>
              
              {loadingProducts ? (
                <p>Loading your inventory...</p>
              ) : myProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
                  <p style={{ color: '#666' }}>You haven't published any products yet.</p>
                  <button onClick={() => setActiveTab('addProduct')} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>Create First Product</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {myProducts.map(product => (
                    <div key={product._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
                      <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} />
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{product.title}</h4>
                      <p style={{ margin: '0 0 10px 0', color: '#4CAF50', fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        style={{ padding: '5px', background: '#ffebee', color: '#d32f2f', border: '1px solid #ffcdd2', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '10px' }}
                      >Delete Product
                      </button>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', fontSize: '0.85rem', color: '#666' }}>
                        <span>Stock: {product.stock}</span>
                        <span>Sold: 0</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addProduct' && (
            <div>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Add a New Product</h2>

              <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Product Title</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Wireless Noise-Cancelling Headphones" 
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Price ($)</label>
                    <input 
                      type="number" 
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="99.99" 
                      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Stock Quantity</label>
                    <input 
                      type="number" 
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="50" 
                      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  >
                    <option value="Tech">Tech</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
                  <textarea 
                    rows="4" 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..." 
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', resize: 'vertical' }}
                  ></textarea>
                </div>

                {/* <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Product Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ width: '100%', padding: '10px', background: '#f9f9f9', borderRadius: '5px', border: '1px dashed #ccc' }} 
                  />
                </div> */}
<div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Product Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ width: '100%', padding: '10px', background: '#f9f9f9', borderRadius: '5px', border: '1px dashed #ccc' }} 
                  />
                  {image && (
                    <div style={{ marginTop: '10px' }}>
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt="Preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isPublishing}
                  style={{ padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: isPublishing ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}
                >
                  {isPublishing ? 'Publishing to Store...' : 'Publish Product'}
                </button>
                {/* <button type="submit" style={{ padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                  Publish Product
                </button> */}
              </form>

            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Store Analytics</h2>
              
              {loadingAnalytics ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}> <img style={{width:'40vw', height:'60vh'}} src="https://th.bing.com/th/id/OIP.vlRhlnh4-SKa6GVtYgJaHgAAAA?w=246&h=135&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" alt="" /> </div>
              ) : (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '200px', padding: '40px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.0rem', margin: '0', color: '#166534' }}>
                      ${revenueData.totalRevenue.toFixed(2)}
                    </h1>
                    <p style={{ color: '#15803d', margin: '5px 0 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</p>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px', padding: '40px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.5rem', margin: '0', color: '#1e40af' }}>
                      {revenueData.totalItemsSold}
                    </h1>
                    <p style={{ color: '#1d4ed8', margin: '5px 0 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Items Sold</p>
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