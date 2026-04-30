import React, { useState, useEffect } from 'react';
import ProductCard from './Productcard';

const Deals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products?skip=30&limit=20`)
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  return (
    <section className="product-section" style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <div className="section-header">
        <h2><img style={{width:'4vw', height:'4vh'}} src="https://www.svgrepo.com/show/506715/fire.svg" alt="" /> Today's Best Deals</h2>
      </div>
      <div className="product-grid page-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} mode="deal" /> 
        ))}
      </div>
    </section>
  );
};
export default Deals;