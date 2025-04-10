import React from 'react';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  return (
    <div className="policy-container">
      {/* Cyberpunk decorative corners */}
      <div className="cyber-corner top-left"></div>
      <div className="cyber-corner top-right"></div>
      <div className="cyber-corner bottom-left"></div>
      <div className="cyber-corner bottom-right"></div>
      
      <div className="policy-header">
        <h2>Privacy Policy</h2>
        <p>Last Updated: June 1, 2023</p>
      </div>

      <div className="policy-content">
        <div className="policy-section">
          <h3>1. Introduction</h3>
          <p>At GaMine, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or make purchases through our platform.</p>
          <p>Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this policy.</p>
        </div>

        <div className="data-visual"></div>

        <div className="policy-section">
          <h3>2. Information We Collect</h3>
          
          <h4>2.1 Personal Information</h4>
          <p>We may collect personal information that you voluntarily provide when you:</p>
          <ul>
            <li>Create an account or place an order</li>
            <li>Sign up for our newsletter</li>
            <li>Participate in contests, surveys, or promotions</li>
            <li>Contact our customer support</li>
          </ul>
          <p>This information may include your name, email address, postal address, phone number, and payment information.</p>
          
          <h4>2.2 Automatically Collected Information</h4>
          <p>When you visit our website or use our app, we may automatically collect certain information about your device, including:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Referring website</li>
            <li>Pages viewed</li>
            <li>Time spent on pages</li>
            <li>Links clicked</li>
          </ul>
        </div>

        <div className="data-visual"></div>

        <div className="policy-section">
          <h3>3. How We Use Your Information</h3>
          <p>We may use the information we collect for various purposes, including:</p>
          <ul>
            <li>Processing and fulfilling your orders</li>
            <li>Creating and managing your account</li>
            <li>Providing customer support</li>
            <li>Sending transactional emails (order confirmations, shipping updates)</li>
            <li>Sending marketing communications (if you've opted in)</li>
            <li>Improving our website, products, and services</li>
            <li>Conducting research and analysis</li>
            <li>Preventing fraud and enhancing security</li>
          </ul>
        </div>

        <div className="policy-section">
          <h3>4. Sharing Your Information</h3>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers who help us operate our business (payment processors, shipping companies, etc.)</li>
            <li>Marketing partners (with your consent)</li>
            <li>Legal authorities when required by law</li>
            <li>Affiliated companies within our corporate group</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </div>

        <div className="data-visual"></div>

        <div className="policy-section">
          <h3>5. Your Rights and Choices</h3>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>Accessing your personal information</li>
            <li>Correcting inaccurate information</li>
            <li>Deleting your information</li>
            <li>Restricting or objecting to processing</li>
            <li>Data portability</li>
            <li>Withdrawing consent</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>
        </div>

        <div className="policy-section">
          <h3>6. Security</h3>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or alteration. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.</p>
        </div>

        <div className="policy-section">
          <h3>7. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.</p>
        </div>

        <div className="policy-section">
          <h3>8. Contact Us</h3>
          <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
          <div className="contact-info">
            <p><i className="far fa-envelope"></i> Email: privacy@gamine.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Address: 123 Cyber Street, Tech District, CA 94103</p>
            <p><i className="fas fa-phone"></i> Phone: +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy; 