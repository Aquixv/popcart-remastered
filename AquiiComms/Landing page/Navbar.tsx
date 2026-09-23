import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/default.png';
import './Navbar.css';
import { useCart } from '../src/CartContext';
import { useFavorites } from '../src/FavoritesContext';
import { useAuth } from '../src/AuthContext';

const Header = () => {
  const { favorites } = useFavorites();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSearchOpen(false); // Automatically unblocks the "Search results for..." text!
  
  if (searchTerm.trim()) {
    navigate(`/?keyword=${searchTerm}`);
  } else {
    navigate('/');
  }
};

  return (
    <header className="main-header">
      <div className="nav-container">
        
        {/* LEFT: Logo */}
        <div className="logo-section">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="Popcart Logo" className="nav-logo" />
          </Link>
        </div>

        {/* CENTER: Navigation Links */}
        <nav className={`nav-links ${isOpen ? 'active' : ''}`}>
          <div className="dropdown">
            <button 
              className="dropbtn" 
              onClick={(e) => {
                e.preventDefault(); 
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              Categories
            </button>
            <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
              <Link to="/category/electronics" onClick={() => setIsOpen(false)}>Electronics</Link>
              <Link to="/category/mens-fashion" onClick={() => setIsOpen(false)}>Men's Fashion</Link>
              <Link to="/category/womens-fashion" onClick={() => setIsOpen(false)}>Women's Fashion</Link>
            </div>
          </div>
          <Link to='/deals' className="menu">Deals</Link>
          <Link to='/new' className="menu">New</Link>
          <Link to='/delivery' className="menu">Delivery</Link>
          
          <Link className='menu' to="/favorites" style={{ position: 'relative' }}>
            Favorites
            {favorites.length > 0 && (
              <span className="notification-badge">{favorites.length}</span>
            )}
          </Link>
          <Link className="menu mobile-only" to="/" onClick={() => setIsOpen(false)}>Home</Link>
          
          {/* Mobile Sidebar Actions */}
          <div className="side-actions">
            <button className="mobile-search-trigger" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              {/* Premium Search Icon */}
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>  */}
              Search
            </button>
            <Link to={'/cart'} className="cart-icon">
              {/* Premium Cart Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span>{cartCount}</span>
            </Link>
            <Link to="/account" className="account-btn">
              {/* Premium User Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {user ? `Hi, ${user.name.split(' ')[0]}` : 'Account'}
            </Link>
          </div>
        </nav>

        {/* RIGHT: Search, Cart, Account (Desktop) */}
       <div className="nav-actions">
  <div className="search-bar desktop-only">
            <form className='form' onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search products..." 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className='search-btn' type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </form>
          </div>
          
         <Link to={'/cart'} className="cart-icon" style={{ position: 'relative' }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
    {cartCount > 0 && (
      <span className="notification-badge">{cartCount}</span>
    )}
  </Link>
          
          <Link to="/account" className="account-btn desktop-only">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            {user ? `${user.name.split(' ')[0]}` : 'Account'}
          </Link>

          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={`mobile-search-overlay ${isSearchOpen ? 'active' : ''}`}>
  <form className='form' onSubmit={handleSearch}>
    <input 
      type="text" 
      placeholder="Search for products..." 
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button className='search-btn' type="submit">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    </button>
  </form>
</div>
      
      <div className={`search-backdrop ${isSearchOpen ? 'active' : ''}`} onClick={() => setIsSearchOpen(false)}></div>
      <div 
    className={`sidebar-backdrop ${isOpen ? 'active' : ''}`} 
    onClick={() => setIsOpen(false)}
  ></div>
    </header>
  );
};

export default Header;