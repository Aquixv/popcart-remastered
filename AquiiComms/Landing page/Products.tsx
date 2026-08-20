import React, { useEffect, useState } from 'react';
import './Products.css';
import ProductCard from './Productcard';
import { Link } from 'react-router-dom';
import type { Product } from './types';
import { GET_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from '../graphql/queries';
import { useApolloClient } from '@apollo/client/react';

type ProductProps = {
  title: string;
  categoryName?: string;
  limit?: number;      
};
interface GetProductsByCategoryResponse {
  getProductsByCategory: {
    products: Product[];
  };
  getProducts: {
    products: Product[];
  };
}

const ProductList = ({ title, categoryName, limit = 8 }: ProductProps) => {
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

 useEffect(() => {
    setLoading(true);

    const fetchProducts = async () => {
      try {
        const queryToUse = categoryName ? GET_PRODUCTS_BY_CATEGORY : GET_PRODUCTS;
        const variablesToUse = categoryName ? { categoryName, limit } : { limit };

        const { data } = await client.query<GetProductsByCategoryResponse>({
          query: queryToUse,
          variables: variablesToUse,
          fetchPolicy: 'network-only' 
        });
        const fetchedProducts = categoryName 
          ? data?.getProductsByCategory?.products 
          : data?.getProducts?.products || null;

        setProducts(fetchedProducts || []);
      } catch (err) {
        console.error("GraphQL Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, limit, client]);

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