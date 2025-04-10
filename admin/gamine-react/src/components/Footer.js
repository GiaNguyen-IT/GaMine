import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your newsletter API
    if (email && email.includes('@')) {
      alert('Thank you for subscribing to our newsletter!');
      setEmail('');
    } else {
      alert('Please enter a valid email address');
    }
  };

  return (
    <footer>
      {/* Cyberpunk elements */}
      <div className="cyber-line"></div>
      <div className="cyber-glow"></div>
      <div className="cyber-glow"></div>
      
      <div className="footer-container">
        <div className="footer-top">
        <div className="footer-links">
          <div className="link-group">
              <h4>Products</h4>
            <ul>
                <li><Link to="/products/category/keyboards">Keyboards</Link></li>
                <li><Link to="/products/category/mice">Mice</Link></li>
                <li><Link to="/products/category/monitors">Monitors</Link></li>
                <li><Link to="/products/category/headsets">Headsets</Link></li>
                <li><Link to="/products/category/accessories">Accessories</Link></li>
            </ul>
          </div>
            
          <div className="link-group">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/news">News</Link></li>
                <li><Link to="/promotions">Promotions</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
            
          <div className="link-group">
              <h4>Support</h4>
            <ul>
                <li><Link to="/customer-support">Help Center</Link></li>
                <li><Link to="/customer-support?tab=order">Track Order</Link></li>
                <li><Link to="/customer-support?tab=returns">Returns & Warranty</Link></li>
                <li><Link to="/customer-support?tab=faq">FAQs</Link></li>
                <li><Link to="/customer-support?tab=manuals">Product Manuals</Link></li>
            </ul>
          </div>
        </div>
          
        <div className="newsletter-signup">
            <h4>Stay Connected</h4>
            <p>Subscribe to our newsletter for exclusive promotions, product updates, and cyberpunk-themed gaming tips.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            <button type="submit">Subscribe</button>
          </form>
          </div>
        </div>
        
        <div className="footer-bottom">
        <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
            </svg>
          </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.162 5.65593C21.3986 5.99362 20.589 6.2154 19.76 6.31393C20.6337 5.79136 21.2877 4.96894 21.6 3.99993C20.78 4.48793 19.881 4.82993 18.944 5.01493C18.3146 4.34151 17.4804 3.89489 16.5709 3.74451C15.6615 3.59413 14.7279 3.74842 13.9153 4.18338C13.1026 4.61834 12.4564 5.30961 12.0771 6.14972C11.6978 6.98983 11.6067 7.93171 11.818 8.82893C10.1551 8.74558 8.52832 8.31345 7.04328 7.56059C5.55823 6.80773 4.24812 5.75098 3.198 4.45893C2.82629 5.09738 2.63095 5.82315 2.632 6.56193C2.632 8.01193 3.37 9.29293 4.492 10.0429C3.82801 10.022 3.17863 9.84271 2.598 9.51993V9.57193C2.5982 10.5376 2.93242 11.4735 3.54385 12.221C4.15529 12.9684 5.00647 13.4814 5.953 13.6729C5.33669 13.84 4.69 13.8646 4.063 13.7449C4.30998 14.5762 4.80454 15.3031 5.48088 15.824C6.15723 16.345 6.98232 16.6337 7.84 16.6499C6.43764 17.7659 4.7176 18.3797 2.95 18.3779C2.63288 18.3771 2.31616 18.3565 2 18.3159C3.79083 19.4976 5.91577 20.1322 8.09 20.1299C15.732 20.1299 19.916 13.8889 19.916 8.45793C19.916 8.27793 19.911 8.09693 19.902 7.91693C20.7146 7.31854 21.4351 6.58166 22.022 5.73993C21.274 6.07862 20.4774 6.30165 19.661 6.40393C20.5013 5.91661 21.1424 5.16285 21.449 4.26993C20.642 4.71555 19.761 5.02419 18.842 5.17993C18.2302 4.50532 17.4089 4.05669 16.5143 3.90629C15.6197 3.75589 14.7018 3.91301 13.9036 4.3511C13.1054 4.78919 12.4693 5.47766 12.0869 6.31304C11.7045 7.14842 11.599 8.0882 11.788 8.98793C9.47414 8.8949 7.20778 8.29051 5.16552 7.21807C3.12326 6.14564 1.35003 4.63449 3.58805e-07 2.79893L0 2.79993Z" />
            </svg>
          </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.885 5.885 0 001.384 2.126A5.868 5.868 0 004.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.898 5.898 0 002.126-1.384 5.86 5.86 0 001.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.89 5.89 0 00-1.384-2.126A5.847 5.847 0 0019.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 01-.899 1.382 3.744 3.744 0 01-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 01-1.379-.899 3.644 3.644 0 01-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z"/>
            </svg>
          </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
            </svg>
          </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
          
        <div className="copyright">
            <p>© {new Date().getFullYear()} GaMine. All rights reserved. <Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/terms-conditions">Terms & Conditions</Link></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 