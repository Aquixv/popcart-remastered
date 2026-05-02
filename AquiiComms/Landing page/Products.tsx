import React, { useEffect, useState } from 'react';
import './Products.css';
import ProductCard from './Productcard';
import { Link } from 'react-router-dom';
import type { Product } from './types';

type ProductProps = {
  title: string;
  categoryName?: string;
  limit?: number;      
};

const ProductList = ({ title, categoryName, limit = 8 }: ProductProps) => {
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = categoryName 
      ? `${import.meta.env.VITE_API_URL}/products/category/${categoryName}?limit=${limit}`
      : `${import.meta.env.VITE_API_URL}/products?limit=${limit}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => console.error("Fetch error:", err));
  }, [categoryName, limit]);

  if (loading) return <div className="loader">Loading {title}...</div>;

  return (
    <section className="product-section">
      <div className="section-header">
        <h2>{title}</h2>
        <Link to='/products/all' className="view-all">View All</Link>
      </div>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;