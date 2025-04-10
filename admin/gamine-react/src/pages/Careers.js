import React from 'react';
import './Careers.css';

function Careers() {
  return (
    <div className="careers-container">
      {/* Cyberpunk decorative elements */}
      <div className="cyber-circuit top"></div>
      <div className="cyber-circuit bottom"></div>
      <div className="cyber-dot dot1"></div>
      <div className="cyber-dot dot2"></div>
      
      <div className="careers-header">
        <h2>Join Our Team</h2>
        <p>Shape the future of gaming technology</p>
      </div>

      <div className="careers-content">
        <div className="careers-intro">
          <h3>Why Work With Us</h3>
          <p>At GaMine, we're passionate about creating gaming gear that pushes boundaries. We're a team of tech enthusiasts, gamers, designers, and innovators who share a common goal: to enhance the gaming experience through cutting-edge hardware.</p>
          <p>We offer a dynamic work environment with competitive benefits, professional growth opportunities, and a culture that values innovation, collaboration, and work-life balance.</p>
        </div>

        <div className="careers-benefits">
          <h3>Benefits & Perks</h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <span>❤️</span>
              </div>
              <h4>Health & Wellness</h4>
              <p>Comprehensive health insurance, wellness programs, and gym membership</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <span>🎓</span>
              </div>
              <h4>Professional Growth</h4>
              <p>Learning stipend, conferences, and mentor programs</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <span>⚖️</span>
              </div>
              <h4>Work-Life Balance</h4>
              <p>Flexible hours, remote work options, and generous PTO</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <span>🎮</span>
              </div>
              <h4>Gaming Perks</h4>
              <p>Employee discounts, testing programs, and gaming stations</p>
            </div>
          </div>
        </div>

        <div className="open-positions">
          <h3>Open Positions</h3>
          
          <div className="position-card">
            <div className="position-info">
              <h4>Senior Hardware Engineer</h4>
              <div className="tags">
                <span className="tag">Full-time</span>
                <span className="tag">Engineering</span>
                <span className="tag">Remote</span>
              </div>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>
          
          <div className="position-card">
            <div className="position-info">
              <h4>UX/UI Designer</h4>
              <div className="tags">
                <span className="tag">Full-time</span>
                <span className="tag">Design</span>
                <span className="tag">Hybrid</span>
              </div>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>
          
          <div className="position-card">
            <div className="position-info">
              <h4>Marketing Specialist</h4>
              <div className="tags">
                <span className="tag">Full-time</span>
                <span className="tag">Marketing</span>
                <span className="tag">Onsite</span>
              </div>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>
          
          <div className="position-card">
            <div className="position-info">
              <h4>Software Developer</h4>
              <div className="tags">
                <span className="tag">Full-time</span>
                <span className="tag">Engineering</span>
                <span className="tag">Remote</span>
              </div>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Careers; 