import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { Product, Review } from './types';
import { number } from 'yup';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch product", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`, 
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        setReviewSuccess("Review submitted successfully!");
        setRating(5);
        setComment('');
        fetchProduct();
      } else {
        setReviewError(data.message || "Failed to submit review");
      }
    } catch (error) {
      setReviewError("Server error. Please try again later.");
    }
  };

const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (!product) return; 

  if (window.innerWidth <= 768) {
      addToCart(product, 1);
      return;
    }
    const target = e.target as HTMLElement;
    const container = target.closest('.product-details-container'); 
    const img = container?.querySelector('img');
    const cartIcon = document.querySelector('.nav-actions .cart-icon');

    if (!img || !cartIcon) {
      addToCart(product, 1); 
      return;
    }

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImg = document.createElement('img');
    flyingImg.src = product.thumbnail;
    flyingImg.style.position = 'fixed';
    flyingImg.style.left = `${imgRect.left}px`;
    flyingImg.style.top = `${imgRect.top}px`;
    flyingImg.style.width = `${imgRect.width}px`;
    flyingImg.style.height = `${imgRect.height}px`;
    flyingImg.style.borderRadius = '50%';
    flyingImg.style.objectFit = 'cover';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    
    document.body.appendChild(flyingImg);

    setTimeout(() => {
      flyingImg.style.left = `${cartRect.left + 10}px`;
      flyingImg.style.top = `${cartRect.top + 10}px`;
      flyingImg.style.width = '20px';
      flyingImg.style.height = '20px';
      flyingImg.style.opacity = '0.2';
    }, 10);
  
    setTimeout(() => {
      flyingImg.remove();
      addToCart(product, 1); 
      cartIcon.classList.add('pop-animation');
      setTimeout(() => cartIcon.classList.remove('pop-animation'), 300);
    }, 800);
  };

  if (loading) return <div className="loader" style={{ textAlign: 'center', marginTop: '50px' }}>Loading product...</div>;
  if (!product) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Product not found!</div>;

  return (
    <div className="product-details-container" style={{ padding: '40px 5%', display: 'flex', gap: '40px' }}>
    
      <div className="product-gallery" style={{ flex: '1' }}>
        <img 
          src={product.thumbnail} 
          alt={product.title} 
          style={{ width: '100%', borderRadius: '15px', background: '#f5f5f5' }} 
        />
      </div>

      <div className="product-info-panel" style={{ flex: '1' }}>
        <p className="brand">{product.brand}</p>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.title}</h1>
        
        <div className="rating">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" className="bi bi-star-fill" viewBox="0 0 16 16" style={{ marginRight: '5px' }}>
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg> 
          {product.rating ? product.rating.toFixed(1) : '0.0'}
        </div>
        
        <h2 style={{ fontSize: '2rem', color: '#222', margin: '20px 0' }}>
          ${product.price}
        </h2>
        
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>
          {product.description}
        </p>

        <button 
          className="add-to-cart-btn" 
          onClick={handleAddToCart}
          style={{ padding: '15px 30px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer' }}
        >
          Add to Cart
        </button>

        <div style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <h2>Reviews ({product.reviews?.length || 0})</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '30px 0' }}>
          {product.reviews && product.reviews.map((review, index) => {
  
            const displayName = review.name || review.reviewerName || "Anonymous Shopper";
            
            const displayDate = review.createdAt || review.date;

            return (
              <div key={review._id || index} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>{displayName}</strong>
                  <span style={{alignItems:'center', display:'flex', justifyContent:'center'}}><img style={{width:'15px', height:'20px'}} src="https://www.svgrepo.com/show/513408/star.svg" alt="" /> {review.rating} / 5</span>
                </div>
                <p style={{ margin: 0, color: '#555' }}>{review.comment}</p>
                <small style={{ color: '#999', display: 'block', marginTop: '10px' }}>
                  {displayDate?.substring(0, 10) || "Recently"}
                </small>
              </div>
            );
          })}
        </div>

          <h3>Leave a Review</h3>
          
          {reviewError && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: '#f8d7da', borderRadius: '5px' }}>{reviewError}</div>}
          {reviewSuccess && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', background: '#d4edda', borderRadius: '5px' }}>{reviewSuccess}</div>}

          {userInfo ? (
            <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rating</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Comment</label>
                <textarea 
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                  placeholder="What did you think about this product?"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                style={{ padding: '12px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content' }}
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div style={{ padding: '20px', background: '#fff3cd', color: '#856404', borderRadius: '5px', marginTop: '20px' }}>
              Please <Link to="/login" style={{ fontWeight: 'bold', color: '#000' }}>log in</Link> to write a review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;