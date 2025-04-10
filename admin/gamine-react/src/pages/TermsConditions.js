import React from 'react';
import './TermsConditions.css';

function TermsConditions() {
  return (
    <div className="terms-container">
      {/* Cyberpunk decorative corners */}
      <div className="cyber-corner top-left"></div>
      <div className="cyber-corner top-right"></div>
      <div className="cyber-corner bottom-left"></div>
      <div className="cyber-corner bottom-right"></div>
      
      <div className="terms-header">
        <h2>Terms & Conditions</h2>
        <p>Last Updated: June 1, 2023</p>
      </div>

      <div className="terms-content">
        <div className="terms-section">
          <h3>1. Introduction</h3>
          <p>Welcome to GaMine. These Terms and Conditions govern your use of our website, mobile application, and services. By accessing or using GaMine, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our service.</p>
        </div>

        <div className="terms-section">
          <h3>2. Definitions</h3>
          <ul>
            <li><strong>Service</strong> refers to the GaMine website, mobile application, and related services.</li>
            <li><strong>User</strong>, <strong>You</strong>, and <strong>Your</strong> refer to the individual or entity using our Service.</li>
            <li><strong>We</strong>, <strong>Us</strong>, and <strong>Our</strong> refer to GaMine.</li>
            <li><strong>Terms</strong> refers to these Terms and Conditions.</li>
            <li><strong>Content</strong> refers to text, images, videos, audio, and other materials that may appear on our Service.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h3>3. Account Registration</h3>
          <p>To access certain features of our Service, you may need to create an account. You are responsible for:</p>
          <ul>
            <li>Providing accurate and complete registration information</li>
            <li>Maintaining the security of your account credentials</li>
            <li>All activities that occur under your account</li>
          </ul>
          <p>We reserve the right to terminate accounts or deny service to anyone for any reason at our discretion.</p>
        </div>

        <div className="terms-section">
          <h3>4. Products and Purchases</h3>
          <p><strong>4.1 Product Information</strong></p>
          <p>We strive to display accurate product information, including descriptions, images, prices, and availability. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.</p>
          
          <p><strong>4.2 Pricing and Payment</strong></p>
          <p>All prices are listed in the currency indicated and are subject to change without notice. Payment must be made through one of our approved payment methods. You agree to provide current, complete, and accurate purchase and account information.</p>
          
          <p><strong>4.3 Order Acceptance</strong></p>
          <p>We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or problems with payment processing.</p>
        </div>

        <div className="terms-section">
          <h3>5. Shipping and Delivery</h3>
          <p>Shipping times and methods vary by location and are estimates only. We are not responsible for delays caused by carriers, customs, or other factors outside our control.</p>
        </div>

        <div className="terms-section">
          <h3>6. Returns and Refunds</h3>
          <p>Please refer to our separate Return Policy for detailed information on returns, exchanges, and refunds.</p>
        </div>

        <div className="terms-section">
          <h3>7. Intellectual Property</h3>
          <p>All content, design, graphics, logos, and other intellectual property on our Service are the exclusive property of GaMine or its licensors and are protected by copyright, trademark, and other laws.</p>
          <p>You may not use, reproduce, distribute, or create derivative works from any content without express written permission from us or the respective rights holder.</p>
        </div>

        <div className="terms-section">
          <h3>8. User Conduct</h3>
          <p>When using our Service, you agree not to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Submit false or misleading information</li>
            <li>Upload or transmit viruses or malicious code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with the proper working of the Service</li>
            <li>Engage in any conduct that restricts or inhibits any other user from using the Service</li>
          </ul>
        </div>

        <div className="terms-section">
          <h3>9. Limitation of Liability</h3>
          <p>To the maximum extent permitted by law, GaMine shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the Service.</p>
        </div>

        <div className="terms-section">
          <h3>10. Changes to Terms</h3>
          <p>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the "Last Updated" date at the top of these Terms. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.</p>
        </div>

        <div className="terms-section">
          <h3>11. Contact Information</h3>
          <p>For questions about these Terms, please contact us at:</p>
          <div className="contact-info">
            <p><i className="far fa-envelope"></i> Email: legal@gamine.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Address: 123 Cyber Street, Tech District, CA 94103</p>
            <p><i className="fas fa-phone"></i> Phone: +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions; 