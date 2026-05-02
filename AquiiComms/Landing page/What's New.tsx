import React, { useState, useEffect } from 'react';
import ProductCard from './Productcard';
import { Product } from './types';

const New = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products?skip=50&limit=20`)
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  return (
    <section className="product-section" style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <div className="section-header">
        <h2>New Arrivals!</h2>
      </div>
      <div className="product-grid page-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} mode="new" /> 
        ))}
      </div>
    </section>
  );
};
export default New;