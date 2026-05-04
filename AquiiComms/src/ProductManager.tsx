import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Product } from './types';

const ProductManager = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/all`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch global inventory", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [userInfo]);

  const handleDelete = async (productId:string) => {
    if (window.confirm("DELETE THIS PRODUCT? This cannot be undone.")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });

        if (response.ok) {
          setProducts(products.filter(p => p._id !== productId));
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = product.title.toLowerCase().includes(searchLower);
    const sellerMatch = product.user?.name?.toLowerCase().includes(searchLower);
    return titleMatch || sellerMatch;
  });

  return (
    <div style={{ minHeight: '100vh', padding: '40px 5%', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ margin: '0', color: '#333' }}> Global Product Manager</h1>
            <p style={{ color: '#666', margin: '5px 0 0' }}>Total Products: {products.length}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Search by title or seller..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', width: '250px' }}
            />
            <Link to="/admin-dashboard">
              <button style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading the global inventory...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '15px' }}>Image</th>
                  <th style={{ padding: '15px' }}>Product Details</th>
                  <th style={{ padding: '15px' }}>Seller</th>
                  <th style={{ padding: '15px' }}>Price</th>
                  <th style={{ padding: '15px' }}>Stock</th>
                  <th style={{ padding: '15px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id} style={{ borderBottom: '1px solid #eee', transition: '0.2s' }}>
                    <td style={{ padding: '15px' }}>
                      <img src={product.thumbnail} alt={product.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </td>
                    <td style={{ padding: '15px' }}>
                      <p style={{ margin: '0', fontWeight: 'bold' }}>{product.title}</p>
                      <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666' }}>ID: {product._id.substring(product._id.length - 6)}</p>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <p style={{ margin: '0', fontWeight: '500' }}>{product.user?.name || "Unknown Seller"}</p>
                      <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666' }}>{product.user?.email || "N/A"}</p>
                    </td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#2e7d32' }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', background: product.stock > 0 ? '#e8f5e9' : '#ffebee', color: product.stock > 0 ? '#2e7d32' : '#c62828' }}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        style={{ padding: '8px 15px', background: '#ffebee', color: '#d32f2f', border: '1px solid #ffcdd2', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No products found matching your search.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;