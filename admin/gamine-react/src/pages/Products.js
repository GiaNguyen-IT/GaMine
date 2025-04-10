import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Products.css';
import { fetchCategories, fetchProducts, fetchProductsByCategory, fetchReviews } from '../services/api';

function Products() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const navigate = useNavigate();

  // Fetch categories from backend API
  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  // Fetch products from backend API
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoadingProducts(true);
        
        // Always fetch all products first
        const allData = await fetchProducts();
        console.log("All products fetched:", allData);
        
        if (allData.length > 0) {
          console.log("Sample product structure:", JSON.stringify(allData[0], null, 2));
        }
        
        let filteredData;
        
        if (selectedCategory) {
          // Filter products client-side based on the category
          console.log("Filtering products for category:", selectedCategory);
          filteredData = allData.filter(product => 
            // The product.category field contains the category ID
            parseInt(product.category) === parseInt(selectedCategory)
          );
          console.log("Filtered products:", filteredData);
        } else {
          filteredData = allData;
        }
        
        // Initialize current image indexes for each product
        const imageIndexes = {};
        filteredData.forEach(product => {
          imageIndexes[product.product_id] = 0;
        });
        setCurrentImageIndexes(imageIndexes);
        
        setProducts(filteredData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    getProducts();
  }, [selectedCategory]);

  // Fetch reviews from backend API
  useEffect(() => {
    const getReviews = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    getReviews();
  }, []);

  // Banner carousel controls
  const prevBanner = () => {
    setCurrentBanner(currentBanner === 0 ? 1 : 0);
  };

  const nextBanner = () => {
    setCurrentBanner(currentBanner === 0 ? 1 : 0);
  };
  
  // Product image navigation
  const prevImage = (productId, imagesCount) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: (prev[productId] - 1 + imagesCount) % imagesCount
    }));
  };

  const nextImage = (productId, imagesCount) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % imagesCount
    }));
  };

  // Handle star rating selection
  const handleStarClick = (value) => {
    setRating(value);
  };

  // Handle review submission
  const handleReviewSubmit = () => {
    if (newReview.trim() !== "" && rating > 0) {
      const newReviewObj = {
        review_id: reviews.length + 1,
        product_id: 1, // Default to first product for demo
        user_id: 1, // Assume user is logged in with ID 1
        rating: rating,
        comment: newReview,
        created_at: new Date().toISOString()
      };
      
      setReviews([newReviewObj, ...reviews]);
      setNewReview('');
      setRating(0);
    }
  };

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    // Toggle selection - if clicking the same category, clear the filter
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate discounted price if product has a promotion
  const getDiscountedPrice = (product) => {
    if (product.promotion && product.promotion.discount_percentage) {
      const discountAmount = (product.price * product.promotion.discount_percentage) / 100;
      return product.price - discountAmount;
    }
    return null;
  };

  // Calculate average rating from reviews
  const getAverageRating = (productId) => {
    const productReviews = reviews.filter(review => review.product_id === productId);
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  };

  return (
    <div className="page-container">
      <div className="container">
        {/* Cyberpunk decorative elements */}
        <div className="cyber-circuit top"></div>
        <div className="cyber-circuit bottom"></div>
        <div className="cyber-dot dot1"></div>
        <div className="cyber-dot dot2"></div>
        
        {/* Sidebar with categories from database */}
        <div className="sidebar">
          <h3>Product Catalog</h3>
          {loading ? (
            <div className="loading-box">Loading categories...</div>
          ) : (
            categories.map(category => (
              <div 
                key={category.category_id} 
                className={`category-box ${selectedCategory === category.category_id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.category_id)}
              >
                {category.name}
                {selectedCategory === category.category_id && <span className="filter-active">✓</span>}
              </div>
            ))
          )}
          {selectedCategory && (
            <div className="clear-filter" onClick={() => setSelectedCategory(null)}>
              Clear Filter
            </div>
          )}
        </div>

        {/* Promotional Banner - could be from Promotions table */}
        <div className="banner">
          <button className="prev" onClick={prevBanner}>&#10094;</button>
          <img 
            src="../assets/products/Banner1.webp" 
            alt="Banner 1" 
            style={{ display: currentBanner === 0 ? 'block' : 'none' }}
          />
          <img 
            src="../assets/products/Banner2.webp" 
            alt="Banner 2" 
            style={{ display: currentBanner === 1 ? 'block' : 'none' }}
          />
          <button className="next" onClick={nextBanner}>&#10095;</button>
        </div>

        {/* Products Grid - using data from backend API */}
        <div className="products" id="product-list">
          {selectedCategory && (
            <div className="filter-indicator">
              Showing products for category: {categories.find(cat => cat.category_id === selectedCategory)?.name}
            </div>
          )}
          {loadingProducts ? (
            <div className="loading-products">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            products.map((product) => {
              const discountedPrice = getDiscountedPrice(product);
              const averageRating = getAverageRating(product.product_id);
              const reviewsCount = reviews.filter(review => review.product_id === product.product_id).length;
              
              const hasImages = product.images && product.images.length > 0;
              const imagesCount = hasImages ? product.images.length : 0;
              const currentImageIndex = currentImageIndexes[product.product_id] || 0;
              const currentImage = hasImages ? product.images[currentImageIndex]?.image_url : "../assets/products/placeholder.webp";
              
              return (
                <div className="product-box" key={product.product_id}>
                  <div className="product-img">
                    {imagesCount > 0 && (
                      <>
                        <button 
                          className="product-img-prev" 
                          onClick={prevImage(product.product_id, imagesCount)}
                          aria-label="Previous image"
                        >
                          &#10094;
                        </button>
                        <img src={currentImage} alt={product.name} />
                        <button 
                          className="product-img-next" 
                          onClick={nextImage(product.product_id, imagesCount)}
                          aria-label="Next image"
                        >
                          &#10095;
                        </button>
                        <div className="product-img-dots">
                          {product.images.map((_, index) => (
                            <span 
                              key={index} 
                              className={`product-img-dot ${index === currentImageIndex ? 'active' : ''}`}
                            ></span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="product-name">
                    <p>{product.name}</p>
                  </div>
                  <div className="product-rating">
                    <div className="rating-content">
                      <div className="stars-container">
                        <span className="stars">{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}</span>
                        <span className="review-count">{reviewsCount} review{reviewsCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="product-price">
                    {discountedPrice ? (
                      <>
                        <p className="original-price">{formatPrice(product.price)}</p>
                        <p className="discounted-price">{formatPrice(discountedPrice)}</p>
                      </>
                    ) : (
                      <p>{formatPrice(product.price)}</p>
                    )}
                  </div>
                  <div className="product-actions">
                    <Link to={`/product-detail/${product.product_id}`} className="btn-details">Details</Link>
                    <button className="btn-cart">Cart</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reviews Section - matching Reviews table */}
        <div className="comments">
          <div className="review-header">Product Reviews</div>
          <div className="review-list">
            {reviews.length === 0 ? (
              <div className="no-reviews">No reviews yet</div>
            ) : (
              reviews.map((review) => (
                <div className="review-item" key={review.review_id}>
                  <p>
                    <strong>{review.rating} ★</strong> - {review.comment}
                    <br />
                    <small>Posted on: {new Date(review.created_at).toLocaleDateString()}</small>
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="review-input">
            <i className="ti-camera upload-image"></i>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <span 
                  key={value}
                  className={`star ${rating >= value ? 'active' : ''}`} 
                  onClick={() => handleStarClick(value)}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <input 
              type="text" 
              className="review-text" 
              placeholder="Write your review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <i className="ti-comment review-submit" onClick={handleReviewSubmit}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products; 