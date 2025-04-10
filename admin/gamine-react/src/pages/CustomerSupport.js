import React, { useState } from 'react';
import './CustomerSupport.css';

function CustomerSupport() {
  const [activeTab, setActiveTab] = useState('faq');
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };

  const faqData = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and navigating to the 'Orders' section. Alternatively, you can use the tracking number provided in your shipping confirmation email."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories. Custom or personalized items cannot be returned unless defective."
    },
    {
      question: "How do I register my product for warranty?",
      answer: "To register your product for warranty, log into your account, go to 'My Products', and select 'Register New Product'. You'll need your order number and the product's serial number."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see shipping options during checkout."
    },
    {
      question: "How do I install drivers for my gaming peripherals?",
      answer: "You can download the latest drivers from our Support page. Select your product category and model to find the appropriate drivers. We also offer GaMine Control Center software that manages all our peripherals in one place."
    }
  ];

  return (
    <div className="support-container">
      {/* Cyberpunk decorative elements */}
      <div className="cyber-circuit left"></div>
      <div className="cyber-circuit right"></div>
      <div className="cyber-dot dot1"></div>
      <div className="cyber-dot dot2"></div>
      <div className="cyber-dot dot3"></div>

      <div className="support-header">
        <h2>Customer Support</h2>
        <p>We're here to help you with any questions or issues</p>
      </div>

      <div className="support-tabs">
        <button 
          className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          Frequently Asked Questions
        </button>
        <button 
          className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact Support
        </button>
        <button 
          className={`tab-button ${activeTab === 'troubleshoot' ? 'active' : ''}`}
          onClick={() => setActiveTab('troubleshoot')}
        >
          Troubleshooting
        </button>
      </div>

      <div className="support-content">
        {activeTab === 'faq' && (
          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-list">
              {faqData.map((faq, index) => (
                <div className="faq-item" key={index}>
                  <div 
                    className={`faq-question ${activeQuestion === index ? 'active' : ''}`}
                    onClick={() => toggleQuestion(index)}
                  >
                    <h4>{faq.question}</h4>
                    <span className="toggle-icon">{activeQuestion === index ? '−' : '+'}</span>
                  </div>
                  {activeQuestion === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            <h3>Contact Support Team</h3>
            <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            
            <form className="support-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input type="email" id="email" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label htmlFor="order">Order Number (optional)</label>
                <input type="text" id="order" placeholder="Enter your order number" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject">
                  <option value="">Select a topic</option>
                  <option value="order">Order Status</option>
                  <option value="return">Returns & Refunds</option>
                  <option value="product">Product Information</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="Describe your issue or question"></textarea>
              </div>
              <button type="submit" className="submit-btn">Submit Request</button>
            </form>
          </div>
        )}

        {activeTab === 'troubleshoot' && (
          <div className="troubleshoot-section">
            <h3>Troubleshooting Guides</h3>
            <p>Select your product category below to view troubleshooting guides.</p>
            
            <div className="product-categories">
              <div className="category-card">
                <img src="../assets/images/screen.png" alt="Monitors" />
                <h4>Monitors</h4>
              </div>
              <div className="category-card">
                <img src="../assets/images/keyboard.png" alt="Keyboards" />
                <h4>Keyboards</h4>
              </div>
              <div className="category-card">
                <img src="../assets/images/mouse.png" alt="Mice" />
                <h4>Mice</h4>
              </div>
              <div className="category-card">
                <img src="../assets/images/Headsets.png" alt="Headsets" />
                <h4>Headsets</h4>
              </div>
              <div className="category-card">
                <img src="../assets/images/Accessories.png" alt="Accessories" />
                <h4>Accessories</h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerSupport; 