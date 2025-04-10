import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Promotions.css';

function Promotions() {
  const [activeTab, setActiveTab] = useState('current');

  const promotions = {
    current: [
      {
        id: 1,
        title: "Summer Gaming Festival",
        description: "Enjoy up to 30% off on selected gaming monitors and accessories. Plus, get free shipping on orders over 5,000,000 VND.",
        code: "SUMMER30",
        expires: "July 31, 2023",
        image: "../assets/images/summer-promo.jpg"
      },
      {
        id: 2,
        title: "New User Exclusive",
        description: "First-time customers receive 10% off their first purchase. Sign up now to claim your discount!",
        code: "NEWUSER10",
        expires: "No expiration",
        image: "../assets/images/new-user-promo.jpg"
      },
      {
        id: 3,
        title: "Cyberpunk Bundle Deal",
        description: "Get our Neon Mouse and Cyber Keyboard together for 15% off the regular price.",
        code: "CYBER15",
        expires: "August 15, 2023",
        image: "../assets/images/bundle-promo.jpg"
      }
    ],
    upcoming: [
      {
        id: 4,
        title: "Back to School Special",
        description: "Students get 20% off with valid student ID. Perfect time to upgrade your setup before the new semester!",
        code: "Coming soon",
        expires: "Starts August 1, 2023",
        image: "../assets/images/school-promo.jpg"
      },
      {
        id: 5,
        title: "Fall Gaming Championship",
        description: "Gear up for our online tournament with special discounts on pro-level peripherals.",
        code: "Coming soon",
        expires: "Starts September 15, 2023",
        image: "../assets/images/tournament-promo.jpg"
      }
    ],
    expired: [
      {
        id: 6,
        title: "Spring Flash Sale",
        description: "48-hour flash sale with discounts up to 40% on last season's products.",
        code: "FLASH40",
        expires: "Expired May 15, 2023",
        image: "../assets/images/flash-promo.jpg"
      },
      {
        id: 7,
        title: "Memorial Day Weekend",
        description: "Special holiday discounts on all products plus double loyalty points.",
        code: "MEMORIAL23",
        expires: "Expired May 29, 2023",
        image: "../assets/images/memorial-promo.jpg"
      }
    ]
  };

  return (
    <div className="promotions-container">
      {/* Cyberpunk decorative elements */}
      <div className="cyber-circuit top-left"></div>
      <div className="cyber-circuit bottom-right"></div>
      <div className="cyber-dot dot1"></div>
      <div className="cyber-dot dot2"></div>
      <div className="cyber-dot dot3"></div>
      
      <div className="promotions-header">
        <h2>Special Offers & Promotions</h2>
        <p>Exclusive deals on our premium gaming gear</p>
      </div>

      <div className="featured-promotion">
        <div className="featured-content">
          <h3>Featured Offer</h3>
          <h4>Cyberpunk Collection Launch</h4>
          <p>Introducing our newest product line inspired by the futuristic aesthetic of cyberpunk design. Pre-order now and get a free limited edition mousepad with any purchase from the collection.</p>
          <p className="promo-code">Use code: <span>CYBER2023</span></p>
          <Link to="/products" className="shop-now-btn">Shop Now</Link>
        </div>
        <div className="featured-image">
          <img src="../assets/images/featured-promo.jpg" alt="Cyberpunk Collection" />
        </div>
      </div>

      <div className="promotions-tabs">
        <button 
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current Offers
        </button>
        <button 
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Offers
        </button>
        <button 
          className={`tab-button ${activeTab === 'expired' ? 'active' : ''}`}
          onClick={() => setActiveTab('expired')}
        >
          Expired Offers
        </button>
      </div>

      <div className="promotions-grid">
        {promotions[activeTab].map((promo) => (
          <div className="promo-card" key={promo.id}>
            <div className="promo-image">
              <img src={promo.image} alt={promo.title} />
            </div>
            <div className="promo-content">
              <h4>{promo.title}</h4>
              <p>{promo.description}</p>
              <div className="promo-details">
                <div className="promo-code-box">
                  <span>Promo Code:</span>
                  <strong>{promo.code}</strong>
                </div>
                <div className="promo-expiry">
                  <span>Expires:</span>
                  <strong>{promo.expires}</strong>
                </div>
              </div>
              {activeTab !== 'expired' && (
                <Link to="/products" className="use-promo-btn">Shop Now</Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="newsletter-signup">
        <h3>Never Miss a Deal</h3>
        <p>Subscribe to our newsletter to receive exclusive promotions and updates.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email address" />
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  );
}

export default Promotions; 