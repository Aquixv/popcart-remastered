import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApolloClient } from '@apollo/client/react';
import { GET_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from '../graphql/queries';

import ProductCard from '../Landing page/Productcard';
import '../Landing page/Products.css'
import type { Product } from './types';

interface GetProductsResponse {
  getProducts: {
    products: Product[];
  };
}

interface GetProductsByCategoryResponse {
  getProductsByCategory: {
    products: Product[];
  };
}

const CategoryPage = ({ isAll = false }: { isAll?: boolean }) => {
  const { categoryName = '' } = useParams(); 
  const [activeFilter, setActiveFilter] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const client = useApolloClient();

  const categoryMap: Record<string, string[]> = {
    "womens-fashion": ["womens-dresses", "womens-shoes", "womens-watches", "womens-bags", "womens-jewellery"],
    "mens-fashion": ["mens-shirts", "mens-shoes", "mens-watches"],
    "electronics": ["smartphones", "laptops", "tablets"],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setActiveFilter('All'); 

    const fetchProducts = async () => {
      try {
        if (isAll) {
          const { data } = await client.query<GetProductsResponse>({
            query: GET_PRODUCTS,
            variables: { limit: null} 
          });
          
          setProducts(data?.getProducts.products|| []);
        } else {
          const subCategoriesToFetch = categoryMap[categoryName] || [categoryName];
        
          const fetchPromises = subCategoriesToFetch.map(subCat => 
            client.query<GetProductsByCategoryResponse>({
              query: GET_PRODUCTS_BY_CATEGORY,
              variables: { categoryName: subCat }
            })
          );

          const results = await Promise.all(fetchPromises);
          
          const combinedProducts = results.flatMap(
            res => res.data?.getProductsByCategory.products || []
          );
          
          setProducts(combinedProducts);
        }
      } catch (error) {
        console.error("GraphQL Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [isAll, categoryName, client]);

  const displayedProducts = products.filter(product => {
    if (activeFilter === 'All') return true;
    
    if (isAll) {
      return categoryMap[activeFilter]?.includes(product.category);
    } else {
      return product.category === activeFilter;
    }
  });

  const pageTitle = isAll 
    ? "All Products" 
    : categoryName?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  if (loading) return <div className="loader">Loading {pageTitle}...</div>;

  const filterButtons = isAll ? Object.keys(categoryMap) : (categoryMap[categoryName] || []);

  return (
    <section className="product-section" style={{ paddingTop: '40px', minHeight: '80vh' }}>
      {filterButtons.length > 0 && (
        <div className="filter-bar">
          <button 
            className={activeFilter === 'All' ? 'active-filter' : ''} 
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>
          
          {filterButtons.map(filterName => (
            <button 
              key={filterName}
              className={activeFilter === filterName ? 'active-filter' : ''} 
              onClick={() => setActiveFilter(filterName)}
            >
              {!isAll 
                ? filterName.replace('womens-', '').replace('mens-', '').toUpperCase() 
                : filterName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
              }
            </button>
          ))}
        </div>
      )}

      <div className="section-header">
        <h2>{pageTitle}</h2>
        <span className="results-count">{displayedProducts.length} Results found</span>
      </div>
      
      <div className="product-grid page-grid">
        {displayedProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CategoryPage;
