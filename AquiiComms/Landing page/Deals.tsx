import React, { useState, useEffect } from 'react';
import ProductCard from './Productcard';
import { Product } from './types';
import { GET_PRODUCTS } from '../graphql/queries';
import { useApolloClient } from '@apollo/client/react';

interface GetProductsResponse {
  getProducts: {
    products: Product[];
  };
}

const Deals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const client =  useApolloClient()

  useEffect(() => {
      const fetchProducts = async () => {
        try {
          const { data } = await client.query<GetProductsResponse>({
            query: GET_PRODUCTS,
            variables: { 
              skip: 30, 
              limit: 20 
            },
            fetchPolicy: 'network-only'
          });
          setProducts(data?.getProducts?.products || []);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };
  
      fetchProducts();
    }, [client]);
  

  

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