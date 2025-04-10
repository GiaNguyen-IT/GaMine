import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { fetchCategories } from '../services/api';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Add scroll event listener to detect when user scrolls down
  useEffect(() => {
    // Fetch cart count from localStorage or API
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartCount(storedCartItems.length);

    // Check if user is logged in
    const userToken = localStorage.getItem('userToken');
    setIsLoggedIn(!!userToken);

    // Scroll handler
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Update cart count when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartCount(storedCartItems.length);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Fetch danh mục sản phẩm từ API
    const getCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  // Thêm useEffect mới để lấy thông tin người dùng từ localStorage
  useEffect(() => {
    if (isLoggedIn) {
      try {
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
          const parsedUserData = JSON.parse(userDataStr);
          setUserData(parsedUserData);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [isLoggedIn]);

  // Thêm useEffect để đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  // Toggle search form
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Toggle user dropdown
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsUserDropdownOpen(false);
    navigate('/');
    
    // Add a small delay before refreshing to ensure navigation completes
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Animated header elements */}
        <div className="header-neon-line"></div>
        <div className="header-neon-line"></div>
        <div className="cyber-circuit"></div>
        
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <h1>GaMine<span className="logo-dot">.</span></h1>
          </Link>
        </div>
        
        {/* Main Navigation */}
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li className="dropdown">
              <Link to="/products">Products</Link>
              <div className="dropdown-content">
                <div className="dropdown-grid">
                  {loading ? (
                    <div>Loading categories...</div>
                  ) : (
                    categories.map((category) => (
                      <Link 
                        to={`/products/category/${category.category_id}`} 
                        className="dropdown-item" 
                        key={category.category_id}
                      >
                        <div className="item-image">
                          <img src={category.img_url} alt={category.name} style={{ width: '40px', height: '40px' }} />
                        </div>
                        <p>{category.name}</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </li>
            <li><Link to="/promotions">Promotions</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        {/* Header Right Section */}
        <div className="header-right">
          {/* Search Form */}
          <form className={`search-form ${isSearchOpen ? 'open' : ''}`} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search for products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search btn-icon"></i>
              <span className="btn-text">Search</span>
            </button>
          </form>
          
          {/* Header Actions */}
          <div className="header-actions">
            {isLoggedIn ? (
              <div className="user-dropdown-container" ref={userDropdownRef}>
                <button onClick={toggleUserDropdown} className="action-btn account-btn">
                  <i className="fas fa-user btn-icon"></i>
                </button>
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <i className="fas fa-user-circle user-icon"></i>
                      <div className="user-details">
                        <span className="user-name">{userData?.username || 'User'}</span>
                        <span className="user-email">{userData?.email || ''}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                      <i className="fas fa-id-card"></i>
                      <span>Thông tin tài khoản</span>
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                      <i className="fas fa-shopping-bag"></i>
                      <span>Đơn hàng của tôi</span>
                    </Link>
                    <Link to="/wishlist" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                      <i className="fas fa-heart"></i>
                      <span>Danh sách yêu thích</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login-register" className="action-btn account-btn">
                <i className="fas fa-user btn-icon"></i>
              </Link>
            )}
            <Link to="/cart" className="action-btn cart-btn">
              <i className="fas fa-shopping-cart btn-icon"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
          
          {/* Mobile Buttons */}
          <div className="mobile-buttons">
            <button 
              className={`search-toggle-btn ${isSearchOpen ? 'active' : ''}`} 
              onClick={toggleSearch}
            >
              <i className="fas fa-search search-icon"></i>
            </button>
            <button 
              className={`menu-toggle-btn ${isMenuOpen ? 'active' : ''}`} 
              onClick={toggleMenu}
            >
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 