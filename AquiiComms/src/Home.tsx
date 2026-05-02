import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../Landing page/Hero'
import Header from '../Landing page/Navbar'
import ProductList from '../Landing page/Products'
import CategoryList from '../Landing page/Categories'
import ServiceSection from '../Landing page/Servicesection'
import Footer from '../Landing page/Footer'
import ProductCard from '../Landing page/Productcard';
import { Product } from './types';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();
  
  const keyword = new URLSearchParams(location.search).get('keyword');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = keyword 
          ? `${import.meta.env.VITE_API_URL}/products?keyword=${keyword}`
          : `${import.meta.env.VITE_API_URL}/products`;

        const response = await fetch(url);
        const data = await response.json();
        
        setProducts(data.products || data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, [keyword]); 

  return (
    <>
      {keyword ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <h2>Search Results for "{keyword}"</h2>
          
          {products.length === 0 ? (
            <p>No products found matching your search.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {products.map((product) => (
  <ProductCard 
    key={product._id}
    product={product}
  />
))}
            </div>
          )}
        </div>

      ) : (
        <>
          <Hero />
          <CategoryList />
          <ProductList title="Makeup and Skincare" categoryName="beauty" limit={4} />
          <ProductList title="Trending Tech" categoryName="smartphones" limit={4} />
          <ProductList title="Summer Fashion" categoryName="tops" limit={4} />
          <ServiceSection />
        </>
        
      )}
    </>
  );
};

export default Home;