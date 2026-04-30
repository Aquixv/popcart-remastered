import React from 'react'
import './Footer.css';
import logo from '/default.png';

const Footer = () => {
  return (
    <footer id="footer-section" className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src={logo} alt="Popcart" />
          <p>The future of shopping, delivered to your screen. Premium quality, sustainable choices.</p>
          <div className="payment-methods">
            <h4>Accepted Payments</h4>
            <div className="payment-grid">
              <div className="payment-card"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce82d440b7ab84a993f_visa.png" loading="lazy" alt=""/></div>
              <div className="payment-card"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce8816711ebecac46d8_stripe.png" loading="lazy" alt=""/></div>
              <div className="payment-card"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce7c4510cf9a55828a0_PayPal.png" loading="lazy" alt=""/></div>
              <div className="payment-card"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63e8c4e4707380264b25e680_ApplePay.png" loading="lazy" alt=""/></div>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h5>Department</h5>
            <ul><li>Fashion</li><li>Education</li><li>Tech</li></ul>
          </div>
          <div className="link-group">
            <h5>About Us</h5>
            <ul><li>Careers</li><li>News & Blog</li><li>Help</li></ul>
          </div>
          <div className="link-group">
            <h5>Services</h5>
            <ul><li>Gift Card</li><li>Mobile App</li><li>Shipping</li></ul>
          </div>
          <div className="link-group">
            <h5>Help</h5>
            <ul><li>Shopcart Help</li><li>Returns</li><li>Track Orders</li></ul>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>© 2026 Popcart. All Rights Reserved.</p>
        <div className="legal-links">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer