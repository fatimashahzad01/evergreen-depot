import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaSearch,
  FaBars,
  FaTimes,
  FaLeaf,
  FaSignOutAlt,
  FaHome,
  FaChevronDown,
} from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchTerm('');
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar - Pakistani Theme */}
      <div className="bg-gradient-to-r from-green-800 via-white to-green-800 h-1"></div>
      
      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaLeaf className="text-3xl text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-green-800">Evergreen Depot</h1>
              <p className="text-xs text-gray-600 urdu">سبز پاکستان</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search plants, seeds, tools..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Search
            </button>
          </form>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/wishlist"
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-600"
                  >
                    <FaHeart />
                    <span>Wishlist</span>
                  </Link>
                  
                  <Link
                    to="/cart"
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-600 relative"
                  >
                    <FaShoppingCart />
                    <span>Cart</span>
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>

                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-1 text-gray-700 hover:text-green-600 focus:outline-none"
                    >
                      <FaUser />
                      <span>{user?.name?.split(' ')[0]}</span>
                      <FaChevronDown className={`text-xs transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaHome className="inline mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-t"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-t"
                        >
                          <FaSignOutAlt className="inline mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-green-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:block border-t">
          <div className="flex space-x-6 py-3">
            <Link to="/products" className="text-gray-600 hover:text-green-600">
              All Plants
            </Link>
            <Link to="/products?category=indoor-plants" className="text-gray-600 hover:text-green-600">
              Indoor Plants
            </Link>
            <Link to="/products?category=outdoor-plants" className="text-gray-600 hover:text-green-600">
              Outdoor Plants
            </Link>
            <Link to="/products?category=flowering-plants" className="text-gray-600 hover:text-green-600">
              Flowering
            </Link>
            <Link to="/products?category=seeds" className="text-gray-600 hover:text-green-600">
              Seeds
            </Link>
            <Link to="/products?category=planters" className="text-gray-600 hover:text-green-600">
              Planters
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-green-600">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </form>

            {/* Mobile Links */}
            <div className="space-y-3">
              <Link
                to="/products"
                className="block text-gray-700 hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/cart"
                    className="block text-gray-700 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart ({itemCount})
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block text-gray-700 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-700 hover:text-green-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-gray-700 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
