import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-container">
      {/* Cyberpunk decorative elements */}
      <div className="cyber-circuit top"></div>
      <div className="cyber-circuit bottom"></div>
      <div className="cyber-dot dot1"></div>
      <div className="cyber-dot dot2"></div>
      
      <div className="contact-header">
        <h2>Contact Us</h2>
        <p>We're here to help with any questions or concerns</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <div className="info-item">
            <i className="info-icon location"></i>
            <div>
              <h4>Visit Us</h4>
              <p>123 Cyber Street, Tech District, CA 94103</p>
            </div>
          </div>
          <div className="info-item">
            <i className="info-icon phone"></i>
            <div>
              <h4>Call Us</h4>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="info-item">
            <i className="info-icon email"></i>
            <div>
              <h4>Email Us</h4>
              <p>support@gamine.com</p>
            </div>
          </div>
          <div className="info-item">
            <i className="info-icon hours"></i>
            <div>
              <h4>Hours</h4>
              <p>Monday - Friday: 9AM - 6PM</p>
              <p>Saturday: 10AM - 4PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          <h3>Send a Message</h3>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" placeholder="Enter subject" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="Enter your message"></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact; 