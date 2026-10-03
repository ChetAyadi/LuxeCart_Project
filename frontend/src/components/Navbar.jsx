import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, LogOut, Package, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useContext(AuthContext);
  const { totalItemsCount, setIsDrawerOpen } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-luxe sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center me-4" to="/">
          <Sparkles className="text-warning me-2" size={24} />
          <span className="brand-title fs-4 text-white">LuxeCart</span>
          <span className="brand-badge">PLUS</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarLuxeContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarLuxeContent">
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-medium">
            <li className="nav-item">
              <Link className="nav-link text-white-50 hover-white" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white-50 hover-white" to="/shop">
                Shop All
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-white-50"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Categories
              </a>
              <ul className="dropdown-menu dropdown-menu-dark rounded-3 shadow border-0 mt-2">
                <li>
                  <Link className="dropdown-menu-item dropdown-item" to="/shop?category=electronics">
                    Electronics & Tech
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/shop?category=fashion">
                    Fashion & Apparel
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/shop?category=home-living">
                    Home & Living
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/shop?category=accessories">
                    Accessories & Watches
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Search Input */}
          <form className="d-flex me-4 my-2 my-lg-0 flex-grow-1 max-w-400" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary rounded-start-pill px-3 py-2"
                placeholder="Search premium products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-warning rounded-end-pill px-3" type="submit">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right Icon Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Wishlist Icon */}
            <Link
              to="/shop?wishlist=true"
              className="btn btn-link text-white text-decoration-none position-relative p-2"
              title="Wishlist"
            >
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="btn btn-warning position-relative rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-semibold"
            >
              <ShoppingBag size={20} />
              <span className="d-none d-sm-inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="badge bg-dark text-white rounded-pill px-2">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {userInfo ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light rounded-pill px-3 py-2 dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <User size={18} />
                  <span>{userInfo.name || userInfo.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow border-0 mt-2">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile">
                      <User size={16} /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile#orders">
                      <Package size={16} /> My Orders
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider border-secondary" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger d-flex align-items-center gap-2"
                      onClick={logout}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light rounded-pill px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-warning rounded-pill px-3 py-2 fw-semibold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
