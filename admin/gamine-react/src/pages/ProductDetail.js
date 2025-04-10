import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Giả lập việc tải thông tin sản phẩm từ API
    const fetchProductData = () => {
      setLoading(true);
      
      // Dữ liệu sản phẩm giả định
      const productData = {
        id: parseInt(productId),
        name: `Gaming ${productId === '1' ? 'Monitor CBP2250' : 
               productId === '2' ? 'Keyboard CBP1920' :
               productId === '3' ? 'Mouse CBP550' :
               productId === '4' ? 'Headset CBP772' :
               productId === '5' ? 'Speaker CBP1218' :
               'Controller CBPS5'}`,
        price: productId === '1' ? 6800000 :
               productId === '2' ? 2050000 :
               productId === '3' ? 800000 :
               productId === '4' ? 400000 :
               productId === '5' ? 1500000 : 3000000,
        discount: 10, // Giảm giá 10%
        stock: 15,
        rating: 4.8,
        reviews: 24,
        description: `High-performance gaming ${productId === '1' ? 'monitor' : 
                      productId === '2' ? 'keyboard' :
                      productId === '3' ? 'mouse' :
                      productId === '4' ? 'headset' :
                      productId === '5' ? 'speaker' : 'controller'} with advanced features for serious gamers.`,
        longDescription: `Experience the ultimate gaming ${productId === '1' ? 'monitor' : 
                          productId === '2' ? 'keyboard' :
                          productId === '3' ? 'mouse' :
                          productId === '4' ? 'headset' :
                          productId === '5' ? 'speaker' : 'controller'} designed for professional gamers. This product features state-of-the-art technology, premium materials, and stunning design to enhance your gaming experience.`,
        images: [
          productId === '1' ? '../assets/products/screen.webp' :
          productId === '2' ? '../assets/products/keyboard.webp' :
          productId === '3' ? '../assets/products/mouse.webp' :
          productId === '4' ? '../assets/products/headphone.webp' :
          productId === '5' ? '../assets/products/speaker.webp' : '../assets/products/controller.webp',
          '../assets/products/detail1.webp',
          '../assets/products/detail2.webp'
        ],
        specs: {
          brand: 'CBP Gaming',
          model: `CBP-${productId === '1' ? '2250' : 
                  productId === '2' ? '1920' :
                  productId === '3' ? '550' :
                  productId === '4' ? '772' :
                  productId === '5' ? '1218' : 'S5'}`,
          weight: '1.2 kg',
          dimensions: '45 x 21 x 8 cm',
          warranty: '24 months',
          features: productId === '1' ? ['27-inch IPS panel', '165Hz refresh rate', '1ms response time', '2560x1440 resolution'] :
                    productId === '2' ? ['Mechanical switches', 'Full RGB lighting', 'N-key rollover', 'Aluminum frame'] :
                    productId === '3' ? ['16000 DPI optical sensor', '8 programmable buttons', 'RGB lighting', '1000Hz polling rate'] :
                    productId === '4' ? ['7.1 virtual surround sound', 'Memory foam ear pads', 'Noise-cancelling microphone', 'RGB lighting'] :
                    productId === '5' ? ['2.1 channel system', '120W total power', 'RGB lighting', 'Bluetooth connectivity'] :
                    ['Wireless', 'Haptic feedback', 'Adaptive triggers', 'Rechargeable battery']
        }
      };
      
      // Giả lập thời gian tải
      setTimeout(() => {
        setProduct(productData);
        setActiveImage(0);
        
        // Sản phẩm liên quan
        setRelatedProducts([
          {
            id: productId === '1' ? 2 : 1,
            name: `Gaming ${productId === '1' ? 'Keyboard CBP1920' : 'Monitor CBP2250'}`,
            price: productId === '1' ? 2050000 : 6800000,
            image: productId === '1' ? '../assets/products/keyboard.webp' : '../assets/products/screen.webp'
          },
          {
            id: productId === '3' ? 4 : 3,
            name: `Gaming ${productId === '3' ? 'Headset CBP772' : 'Mouse CBP550'}`,
            price: productId === '3' ? 400000 : 800000,
            image: productId === '3' ? '../assets/products/headphone.webp' : '../assets/products/mouse.webp'
          },
          {
            id: productId === '5' ? 6 : 5,
            name: `Gaming ${productId === '5' ? 'Controller CBPS5' : 'Speaker CBP1218'}`,
            price: productId === '5' ? 3000000 : 1500000,
            image: productId === '5' ? '../assets/products/controller.webp' : '../assets/products/speaker.webp'
          }
        ]);
        
        setLoading(false);
      }, 500);
    };
    
    fetchProductData();
  }, [productId]);

  const setMainImage = (index) => {
    setActiveImage(index);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  const addToWishlist = () => {
    // Add to wishlist functionality
    console.log("Added to wishlist");
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/products" className="back-to-products">Back to Products</Link>
      </div>
    );
  }

  // Calculate sale price if there's a discount
  const salePrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

  return (
    <div className="product-detail-container">
      {/* Cyberpunk decorative elements */}
      <div className="cyber-circuit left"></div>
      <div className="cyber-circuit right"></div>
      <div className="cyber-dot dot1"></div>
      <div className="cyber-dot dot2"></div>
      <div className="cyber-line line1"></div>
      <div className="cyber-line line2"></div>
      
      <div className="product-detail">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <Link to="/products">Products</Link> &gt; 
          <span>{product.name}</span>
        </div>

        {/* Product Main Info */}
        <div className="product-main">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[activeImage]} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${activeImage === index ? 'active' : ''}`} 
                  onClick={() => setMainImage(index)}
                >
                  <img src={image} alt={`${product.name} - view ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating-detail">
              <div className="stars">
                {'★'.repeat(Math.floor(product.rating))}
                {product.rating % 1 >= 0.5 ? '★' : ''}
                {'☆'.repeat(5 - Math.ceil(product.rating))}
              </div>
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>
            
            <div className="product-price-detail">
              {product.discount ? (
                <>
                  <span className="original-price">{formatPrice(product.price)}</span>
                  <span className="sale-price">{formatPrice(salePrice)}</span>
                  <span className="discount-badge">-{product.discount}%</span>
                </>
              ) : (
                <span className="regular-price">{formatPrice(product.price)}</span>
              )}
            </div>
            
            <div className="product-short-desc">
              <p>{product.description}</p>
            </div>
            
            <div className="product-availability">
              <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.stock > 0 && <span className="stock-qty">({product.stock} available)</span>}
            </div>
            
            <div className="product-quantity">
              <button onClick={decreaseQuantity} disabled={quantity <= 1}>-</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={increaseQuantity} disabled={quantity >= product.stock}>+</button>
            </div>
            
            <div className="product-actions-detail">
              <button className="add-to-cart-btn">Add to Cart</button>
              <button className="buy-now-btn">Buy Now</button>
              <button className="add-to-wishlist-btn" onClick={addToWishlist}>♡</button>
            </div>
            
            <div className="product-meta">
              <p><strong>SKU:</strong> {product.specs.model}</p>
              <p><strong>Brand:</strong> {product.specs.brand}</p>
              <p><strong>Category:</strong> Gaming {
                productId === '1' ? 'Monitors' : 
                productId === '2' ? 'Keyboards' :
                productId === '3' ? 'Mice' :
                productId === '4' ? 'Headsets' :
                productId === '5' ? 'Speakers' : 'Accessories'
              }</p>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button 
              className={activeTab === 'description' ? 'active' : ''} 
              onClick={() => changeTab('description')}
            >
              Description
            </button>
            <button 
              className={activeTab === 'specifications' ? 'active' : ''} 
              onClick={() => changeTab('specifications')}
            >
              Specifications
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''} 
              onClick={() => changeTab('reviews')}
            >
              Reviews ({product.reviews})
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-tab">
                <h3>Product Description</h3>
                <p>{product.longDescription}</p>
                <p>This high-quality product is designed to meet the needs of demanding gamers who require precision, reliability, and performance. Crafted with premium materials and utilizing the latest technology, it offers an exceptional gaming experience that sets it apart from competitors.</p>
                <p>Key highlights:</p>
                <ul>
                  {product.specs.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="specifications-tab">
                <h3>Technical Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <th>Brand</th>
                      <td>{product.specs.brand}</td>
                    </tr>
                    <tr>
                      <th>Model</th>
                      <td>{product.specs.model}</td>
                    </tr>
                    <tr>
                      <th>Weight</th>
                      <td>{product.specs.weight}</td>
                    </tr>
                    <tr>
                      <th>Dimensions</th>
                      <td>{product.specs.dimensions}</td>
                    </tr>
                    <tr>
                      <th>Warranty</th>
                      <td>{product.specs.warranty}</td>
                    </tr>
                    {product.specs.features.map((feature, index) => (
                      <tr key={index}>
                        <th>Feature {index + 1}</th>
                        <td>{feature}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <h3>Customer Reviews</h3>
                <div className="review-summary">
                  <div className="average-rating">
                    <div className="big-rating">{product.rating}</div>
                    <div className="rating-stars">
                      {'★'.repeat(Math.floor(product.rating))}
                      {product.rating % 1 >= 0.5 ? '★' : ''}
                      {'☆'.repeat(5 - Math.ceil(product.rating))}
                    </div>
                    <div className="total-reviews">{product.reviews} reviews</div>
                  </div>
                  <div className="rating-bars">
                    <div className="rating-bar">
                      <span>5 ★</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: '80%' }}></div>
                      </div>
                      <span>80%</span>
                    </div>
                    <div className="rating-bar">
                      <span>4 ★</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: '15%' }}></div>
                      </div>
                      <span>15%</span>
                    </div>
                    <div className="rating-bar">
                      <span>3 ★</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: '5%' }}></div>
                      </div>
                      <span>5%</span>
                    </div>
                    <div className="rating-bar">
                      <span>2 ★</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: '0%' }}></div>
                      </div>
                      <span>0%</span>
                    </div>
                    <div className="rating-bar">
                      <span>1 ★</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: '0%' }}></div>
                      </div>
                      <span>0%</span>
                    </div>
                  </div>
                </div>
                
                <div className="customer-reviews">
                  <div className="review-item">
                    <div className="review-header">
                      <div className="reviewer-name">Nguyen Van A</div>
                      <div className="review-date">January 15, 2023</div>
                    </div>
                    <div className="reviewer-rating">{'★'.repeat(5)}</div>
                    <div className="review-content">
                      <p>Excellent product, works perfectly for my gaming setup. The quality is outstanding and the performance exceeds expectations.</p>
                    </div>
                  </div>
                  
                  <div className="review-item">
                    <div className="review-header">
                      <div className="reviewer-name">Tran Thi B</div>
                      <div className="review-date">February 22, 2023</div>
                    </div>
                    <div className="reviewer-rating">{'★'.repeat(4)}</div>
                    <div className="review-content">
                      <p>Very good product, fast delivery and excellent customer service. Would recommend to friends!</p>
                    </div>
                  </div>
                  
                  <div className="review-item">
                    <div className="review-header">
                      <div className="reviewer-name">Le Van C</div>
                      <div className="review-date">March 10, 2023</div>
                    </div>
                    <div className="reviewer-rating">{'★'.repeat(5)}</div>
                    <div className="review-content">
                      <p>Amazing quality and performance. This is my second purchase from this brand and I'm very satisfied with both products.</p>
                    </div>
                  </div>
                </div>
                
                <div className="write-review">
                  <h4>Write a Review</h4>
                  <div className="rating-select">
                    <span>Your rating: </span>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="star">★</span>
                      ))}
                    </div>
                  </div>
                  <div className="review-form">
                    <input type="text" placeholder="Your Name" />
                    <input type="email" placeholder="Your Email" />
                    <textarea placeholder="Write your review here..."></textarea>
                    <button className="submit-review">Submit Review</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="product-grid">
            {relatedProducts.map((relProduct) => (
              <div className="product-card" key={relProduct.id}>
                <div className="product-img">
                  <img src={relProduct.image} alt={relProduct.name} />
                </div>
                <div className="product-details">
                  <h3>{relProduct.name}</h3>
                  <div className="product-price">{formatPrice(relProduct.price)}</div>
                  <div className="product-actions">
                    <Link to={`/product-detail/${relProduct.id}`} className="view-details">Details</Link>
                    <button className="add-to-cart">Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 