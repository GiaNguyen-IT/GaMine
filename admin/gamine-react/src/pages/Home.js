import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const whyChooseUsRef = useRef(null);
  const newsRef = useRef(null);
  const newsletterRef = useRef(null);
  const bannerRef = useRef(null);

  // State for products, categories, promotions and blogs from database
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Promo banner state
  const [showPromo, setShowPromo] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  // Mouse move effect for hero section
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (heroRef.current) {
      const { clientX, clientY } = e;
      const { width, height } = heroRef.current.getBoundingClientRect();
      const x = (clientX / width - 0.5) * 20;
      const y = (clientY / height - 0.5) * 20;
      setMousePosition({ x, y });
    }
  };

  // Fetch data from databases (simulated with static data for now)
  useEffect(() => {
    // Fetch promotions (simulated)
    const promotionsData = [
      {
        promotion_id: 1,
        title: "Giảm giá Tháng 6",
        description: "Giảm giá 20% cho tất cả bàn phím",
        discount_percentage: 20,
        start_date: "2023-06-01T00:00:00Z",
        end_date: "2023-06-30T23:59:59Z",
        img_banner: "/assets/promotions/keyboard-sale.png"
      },
      {
        promotion_id: 2,
        title: "Miễn phí vận chuyển",
        description: "Miễn phí vận chuyển cho đơn hàng trên 500K",
        discount_percentage: null,
        start_date: "2023-06-15T00:00:00Z",
        end_date: "2023-07-15T23:59:59Z",
        img_banner: "/assets/promotions/free-shipping.png"
      },
      {
        promotion_id: 3,
        title: "Tai nghe GaMine X9",
        description: "Sản phẩm mới: Tai nghe GaMine X9 - Giảm 30%",
        discount_percentage: 30,
        start_date: "2023-07-01T00:00:00Z",
        end_date: "2023-07-31T23:59:59Z",
        img_banner: "/assets/promotions/headset-x9.png"
      }
    ];
    setPromotions(promotionsData);

    // Simulate promoSlides from Promotions table
    const promoSlides = promotionsData.map(promo => ({
      id: promo.promotion_id,
      text: promo.description,
      code: promo.promotion_id === 1 ? "CYBER20" : null,
      countdown: promo.promotion_id === 2 ? "48:00:00" : null,
      highlight: promo.promotion_id === 3 ? `${promo.discount_percentage}%` : null,
      action: promo.promotion_id === 1 ? "Mua ngay" : 
              promo.promotion_id === 2 ? "Xem thêm" : "Pre-order",
      link: promo.promotion_id === 1 ? "/products/category/keyboards" :
            promo.promotion_id === 2 ? "/promotions" : "/products/headset-x9"
    }));

    // Fetch categories (simulated)
    const categoriesData = [
      { category_id: 1, name: "Keyboards", description: "Gaming keyboards with RGB lighting" },
      { category_id: 2, name: "Mice", description: "Precision gaming mice" },
      { category_id: 3, name: "Headsets", description: "Immersive gaming headsets" },
      { category_id: 4, name: "Accessories", description: "Gaming accessories" }
    ];
    setCategories(categoriesData);

    // Fetch featured products (simulated)
    const productsData = [
      {
        product_id: 1,
        name: "Quantum Keyboard",
        description: "Mechanical RGB gaming keyboard with custom switches",
        price: 3500000,
        stock_quantity: 20,
        sold_quantity: 8,
        category_id: 1,
        created_at: "2023-05-15T10:00:00Z",
        images: [
          { image_id: 1, image_url: "/assets/images/keyboard.png", is_primary: true }
        ],
        details: {
          specification: "Mechanical switches, Full RGB lighting, N-key rollover, Aluminum frame"
        },
        isNew: true,
        rating: 5
      },
      {
        product_id: 2,
        name: "Neuro Mouse",
        description: "High-precision gaming mouse with customizable weights",
        price: 1600000,
        old_price: 2000000,
        stock_quantity: 15,
        sold_quantity: 5,
        category_id: 2,
        created_at: "2023-06-01T10:00:00Z",
        images: [
          { image_id: 2, image_url: "/assets/images/mouse.png", is_primary: true }
        ],
        details: {
          specification: "16000 DPI optical sensor, 8 programmable buttons, RGB lighting, Adjustable weights"
        },
        isOnSale: true,
        rating: 4.5
      },
      {
        product_id: 3,
        name: "Sonic Headset",
        description: "Immersive gaming headset with 7.1 surround sound",
        price: 2800000,
        stock_quantity: 12,
        sold_quantity: 3,
        category_id: 3,
        created_at: "2023-06-15T10:00:00Z",
        images: [
          { image_id: 3, image_url: "/assets/images/Headsets.png", is_primary: true }
        ],
        details: {
          specification: "7.1 virtual surround sound, Memory foam ear pads, Noise-cancelling microphone, RGB lighting"
        },
        rating: 4.8
      },
      {
        product_id: 4,
        name: "Nova Controller",
        description: "Premium gaming controller compatible with multiple platforms",
        price: 1800000,
        stock_quantity: 10,
        sold_quantity: 2,
        category_id: 4,
        created_at: "2023-07-01T10:00:00Z",
        images: [
          { image_id: 4, image_url: "/assets/images/controller.png", is_primary: true }
        ],
        details: {
          specification: "Wireless, Haptic feedback, Adaptive triggers, Rechargeable battery, Compatible with PC/Console"
        },
        rating: 4.7
      }
    ];
    setFeaturedProducts(productsData);

    // Fetch blog posts (simulated)
    const blogsData = [
      {
        blog_id: 1,
        title: "GaMine Sponsors World Gaming Championship",
        content: "We're excited to announce our sponsorship of this year's World Gaming Championship with exclusive gear for all participants.",
        created_at: "2023-06-15T10:00:00Z",
        images: [
          { image_id: 1, blog_id: 1, image_url: "/assets/images/New Gear Drop.png", is_primary: true }
        ]
      },
      {
        blog_id: 2,
        title: "Introducing Our New Quantum Series",
        content: "Our new Quantum Series features revolutionary haptic feedback technology and enhanced RGB lighting for immersive gaming.",
        created_at: "2023-06-03T10:00:00Z",
        images: [
          { image_id: 2, blog_id: 2, image_url: "/assets/images/Tech Updates.png", is_primary: true }
        ]
      },
      {
        blog_id: 3,
        title: "GaMine Control Center 2.0 Now Available",
        content: "Our updated software now includes AI-powered performance optimization and enhanced customization options.",
        created_at: "2023-05-28T10:00:00Z",
        images: [
          { image_id: 3, blog_id: 3, image_url: "/assets/images/Event Recap.png", is_primary: true }
        ]
      }
    ];
    setBlogs(blogsData);

    console.log("Home component mounted");
    console.log("Hero ref:", heroRef.current);

    // Parallax and scroll effects
    const handleScroll = () => {
      const value = window.scrollY;
      setScrollY(value);
      
      // Parallax effect for hero section
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${value * 0.5}px`;
      }
      
      // Parallax effect for banner section
      if (bannerRef.current) {
        bannerRef.current.style.backgroundPositionY = `${-value * 0.1 + 200}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Intersection Observer for fade-in animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = [
      featuredRef.current,
      whyChooseUsRef.current,
      newsRef.current,
      newsletterRef.current,
      bannerRef.current
    ];

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Ensure activeSlide is valid based on the number of promotions
    if (activeSlide >= promotionsData.length) {
      setActiveSlide(0);
    }

    // Promo slide interval
    const slideInterval = setInterval(() => {
      if (showPromo && promotionsData.length > 0) {
        setActiveSlide(prev => (prev + 1) % promotionsData.length);
      }
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
      clearInterval(slideInterval);
    };
  }, [showPromo, activeSlide]);

  // Text typing effect for hero subtitle
  const [typedText, setTypedText] = useState('');
  const fullText = "Discover cutting-edge gaming peripherals engineered for ultimate performance with our exclusive cyberpunk-inspired designs.";
  
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);
    
    return () => clearInterval(typingInterval);
  }, []);

  // Calculate hero transform based on mouse position
  const heroContentTransform = {
    transform: `perspective(1000px) rotateX(${-mousePosition.y / 2}deg) rotateY(${mousePosition.x / 2}deg) translateZ(10px)`
  };
  
  // Get current time for header clock
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Log the component rendering state
  console.log("Home component rendering");

  // Adjust hero-content margin when promo is shown
  const heroContentStyle = {
    ...heroContentTransform,
    marginTop: showPromo ? '60px' : '0'
  };

  return (
    <div className="home-page">

      {/* Categories section based on Categories table */}
      <section>
        <div className="categories-grid">
          {categories.map(category => (
            <Link 
              key={category.category_id} 
              to={`/products/category/${category.name.toLowerCase()}`} 
              className="category-card"
            >
              <div className={`category-icon ${category.name.toLowerCase()}`}></div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products section based on Products table */}
      <section className="featured-products" ref={featuredRef}>
        <div className="section-header">
          <h3>Featured Products</h3>
          <div className="section-line"></div>
        </div>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <div className="product-card glass" key={product.product_id}>
              {product.isNew && <div className="product-badge">NEW</div>}
              {product.isOnSale && <div className="product-badge" style={{background: 'var(--accent-pink)'}}>SALE</div>}
              <div className="product-image">
                <img 
                  src={product.images.find(img => img.is_primary)?.image_url || product.images[0]?.image_url} 
                  alt={product.name} 
                />
              </div>
              <h4>{product.name}</h4>
              <div className="price-container">
                {product.old_price && (
                  <p className="product-price-old">{formatPrice(product.old_price)}</p>
                )}
                <p className="product-price">{formatPrice(product.price)}</p>
              </div>
              <div className="card-hover">
                <div className="product-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <Link to={`/product-detail/${product.product_id}`} className="btn-small">Details</Link>
                  <button className="btn-small btn-primary">Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/products" className="cta-button btn-outline">View All Products</Link>
        </div>
      </section>

      {/* Featured banner based on Promotions table */}
      <section className="featured-banner" ref={bannerRef}>
        <div className="banner-content">
          <h3>NEW COLLECTION</h3>
          <h2>Project Neon: Limited Edition</h2>
          <p>Experience our exclusive cyberpunk-themed peripherals with advanced RGB lighting technology</p>
          <Link to="/products/category/limited" className="cta-button">Shop Collection</Link>
        </div>
      </section>

      <section className="why-choose-us" ref={whyChooseUsRef}>
        <div className="section-header">
          <h3>Why Choose Us</h3>
          <div className="section-line"></div>
        </div>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon precision"></div>
            <h4>Precision Engineering</h4>
            <p>Our products are crafted with the highest quality materials and designed for peak performance with 1ms response time and 99.9% accuracy.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon performance"></div>
            <h4>Unmatched Performance</h4>
            <p>Gain competitive edge with our peripherals optimized for professional gaming, featuring advanced sensors and durable components.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon design"></div>
            <h4>Cyberpunk Aesthetics</h4>
            <p>Stand out with our unique cyberpunk-inspired designs, featuring customizable RGB lighting and futuristic aesthetics.</p>
          </div>
        </div>
      </section>

      {/* Latest news section based on Blog table */}
      <section className="latest-news" ref={newsRef}>
        <div className="section-header">
          <h3>Latest News</h3>
          <div className="section-line"></div>
        </div>
        <div className="news-grid">
          {blogs.map(blog => {
            const blogDate = new Date(blog.created_at);
            const day = blogDate.getDate();
            const month = blogDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            
            return (
              <div className="news-card" key={blog.blog_id}>
                <div className="news-image">
                  <img 
                    src={blog.images.find(img => img.is_primary)?.image_url || blog.images[0]?.image_url} 
                    alt={blog.title} 
                  />
                  <div className="news-date">
                    <span className="day">{day}</span>
                    <span className="month">{month}</span>
                  </div>
                </div>
                <div className="news-content">
                  <h4>{blog.title}</h4>
                  <p>{blog.content}</p>
                  <Link to={`/news/${blog.blog_id}`} className="news-link">Read More</Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="view-all-container">
          <Link to="/news" className="cta-button btn-outline">View All News</Link>
        </div>
      </section>

      {/* Newsletter section - would connect to a mailing list database */}
      <section className="newsletter" ref={newsletterRef}>
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for exclusive offers, product updates, and gaming tips.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Floating "Back to Top" button that appears after scrolling */}
      {scrollY > 500 && (
        <button 
          className="back-to-top" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Home; 