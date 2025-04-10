import React from 'react';
import './About.css';

function About() {
  return (
    <div className="page-container about-container">
      {/* Cyberpunk decorative elements */}
      <div className="cyber-circle top-right"></div>
      <div className="cyber-circle bottom-left"></div>
      <div className="cyber-line left"></div>
      <div className="cyber-line right"></div>
      
      <div className="about-header">
        <h2>About GaMine</h2>
        <p>Your Ultimate Destination for Premium Gaming Gear</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h3>Our Mission</h3>
          <p>At GaMine, we believe that every gamer deserves equipment that matches their passion and skill. Our mission is to provide cutting-edge gaming hardware that enhances performance, delivers unparalleled immersion, and stands out with cyberpunk-inspired aesthetics that make your setup as impressive as your gameplay.</p>
        </div>

        <div className="about-section">
          <h3>Our Story</h3>
          <p>Founded in 2020 by a collective of gamers, engineers, and tech enthusiasts, GaMine emerged from a shared frustration with the lack of gaming gear that balanced performance, durability, and aesthetic appeal. What began as a small workshop in a garage has grown into a global brand trusted by casual players and esports professionals alike.</p>
          <p>Our journey has been fueled by a commitment to innovation, quality, and the gaming community. Each product we create is rigorously tested by our team of professional gamers to ensure it meets the demands of even the most intense gaming sessions.</p>
        </div>

        <div className="about-section team-section">
          <h3>Meet Our Team</h3>
          <div className="team-grid">
            <div className="team-member">
              <img src="/assets/images/personnel-1.jpg" alt="Tram Gia Nguyen - Founder & CEO" />
              <h4>Tram Gia Nguyen</h4>
              <p className="title">Founder & CEO</p>
              <p className="bio">Former esports champion turned entrepreneur, Tram leads with a gamer-first philosophy that drives every aspect of GaMine.</p>
            </div>

            <div className="team-member">
              <img src="/assets/images/personnel-2.jpg" alt="Nguyen Ky Quang - Chief Design Officer" />
              <h4>Nguyen Ky Quang</h4>
              <p className="title">Chief Design Officer</p>
              <p className="bio">With a background in industrial design and a passion for cyberpunk aesthetics, Quang ensures our products look as good as they perform.</p>
            </div>

            <div className="team-member">
              <img src="/assets/images/personnel-3.jpg" alt="Tran Minh Huan - CTO" />
              <h4>Tran Minh Huan</h4>
              <p className="title">CTO</p>
              <p className="bio">A pioneer in haptic technology, Huan leads our R&D team in pushing the boundaries of what gaming hardware can do.</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3>Our Values</h3>
          <div className="values-container">
            <div className="value-box">
              <i className="fas fa-lightbulb value-icon"></i>
              <h4>Innovation</h4>
              <p>We continuously push the boundaries of what's possible in gaming hardware, always seeking new technologies and design approaches.</p>
            </div>
            <div className="value-box">
              <i className="fas fa-award value-icon"></i>
              <h4>Quality</h4>
              <p>Every product we create undergoes rigorous testing to ensure durability, precision, and performance that exceeds expectations.</p>
            </div>
            <div className="value-box">
              <i className="fas fa-users value-icon"></i>
              <h4>Community</h4>
              <p>We actively engage with the gaming community, listening to feedback and involving players in our development process.</p>
            </div>
            <div className="value-box">
              <i className="fas fa-leaf value-icon"></i>
              <h4>Sustainability</h4>
              <p>We're committed to reducing our environmental impact through recyclable packaging, energy-efficient manufacturing, and responsibly sourced materials.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 