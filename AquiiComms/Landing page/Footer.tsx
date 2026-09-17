import React from 'react';
import './Footer.css';
import logo from '/default.png';

const Footer = () => {
  return (
    <footer id="footer-section" className="main-footer">
      <div className="footer-container">
        
        {/* Left: Brand / Logo */}
        <div className="footer-brand">
          <img src={logo} alt="Popcart" className="footer-logo" />
        </div>

        {/* Middle: Minimalist Link Columns */}
        <div className="footer-links">
          <ul>
            <li>Fashion</li>
            <li>Books</li>
            <li>Gadgets</li>
            <li>Tech</li>
          </ul>
          <ul>
            <li>Legal warning</li>
            <li>Copyright claims</li>
            <li>Right to Representation</li>
          </ul>
          <ul>
            <li>Return policy</li>
            <li>Cookies policy</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Right: Copyright & Socials */}
        <div className="footer-right">
          <p className="copyright">Popcart. All rights reserved</p>
          <div className="social-icons">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            {/* X / Twitter */}
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.73 16h5L9 4z"></path></svg>
            {/* Facebook */}
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;