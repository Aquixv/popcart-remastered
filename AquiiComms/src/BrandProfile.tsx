import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS_BY_BRAND } from '../graphql/queries'; // Make sure this is exported from queries.ts
import type { Product } from './types';
import './BrandProfile.css';

interface GetBrandProductsResponse {
  getProductsByBrand: Product[];
}

const BrandProfile = () => {
  // Extracts the brand name from the URL (e.g., /brand/Velvet)
  const { brandName } = useParams<{ brandName: string }>();
  
  // The decoded brand name just in case the URL has spaces (e.g., %20)
  const decodedBrandName = brandName ? decodeURIComponent(brandName) : 'Unknown Brand';

  const { data, loading, error } = useQuery<GetBrandProductsResponse>(GET_PRODUCTS_BY_BRAND, {
    variables: { brand: decodedBrandName },
    skip: !brandName,
  });

  const products = data?.getProductsByBrand || [];

  if (loading) {
    return (
      <div className="brand-page-container">
        <div className="empty-state" style={{ marginTop: '100px' }}>
          Loading the {decodedBrandName} store...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brand-page-container">
        <div className="empty-state" style={{ marginTop: '100px', color: '#dc2626' }}>
          Failed to load store. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="brand-page-container">
      {/* Premium Store Header */}
      <div className="brand-header">
        <div className="brand-header-content">
          <div className="brand-avatar">
            {/* Takes the first letter of the brand for a sleek default avatar */}
            {decodedBrandName.charAt(0).toUpperCase()}
          </div>
          <div className="brand-info">
            <div className="brand-title-group">
              <h1>{decodedBrandName}</h1>
              <svg className="verified-badge" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <p className="brand-stats">Official Store • {products.length} Products</p>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="brand-products-section">
        {products.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <h3>No products found</h3>
            <p>This brand hasn't listed any items yet.</p>
          </div>
        ) : (
          <div className="customer-product-grid">
            {products.map(product => (
              <Link to={`/product/${product._id}`} key={product._id} className="customer-product-card">
                <div className="product-image-container">
                  <img src={product.thumbnail} alt={product.title} />
                </div>
                <div className="product-details">
                  <h3 className="product-title" title={product.title}>{product.title}</h3>
                  
                  <div className="product-rating">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span>{product.rating || 'New'}</span>
                  </div>

                  <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandProfile;