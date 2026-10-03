import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, Clock, RefreshCw, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5 border-top border-secondary">
      <div className="container">
        {/* Features Trust Banner */}
        <div className="row g-4 pb-5 border-bottom border-secondary mb-5">
          <div className="col-md-3 col-6">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-secondary bg-opacity-25 rounded-circle text-warning">
                <Truck size={28} />
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-white">Free Express Shipping</h6>
                <p className="text-white-50 small mb-0">On all orders over $150</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-secondary bg-opacity-25 rounded-circle text-warning">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-white">100% Secure Payment</h6>
                <p className="text-white-50 small mb-0">256-Bit SSL Encryption</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-secondary bg-opacity-25 rounded-circle text-warning">
                <RefreshCw size={28} />
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-white">30 Days Return</h6>
                <p className="text-white-50 small mb-0">Hassle-free guarantee</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-secondary bg-opacity-25 rounded-circle text-warning">
                <Clock size={28} />
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-white">24/7 VIP Support</h6>
                <p className="text-white-50 small mb-0">Dedicated concierge team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <Sparkles className="text-warning me-2" size={24} />
              <span className="brand-title fs-4 text-white">LuxeCart</span>
            </div>
            <p className="text-white-50 mb-4" style={{ maxWidth: '320px' }}>
              Your premier destination for luxury electronics, designer apparel, modern living, and handcrafted accessories.
            </p>
            <div className="d-flex gap-3 text-warning">
              <span className="badge bg-secondary text-white py-2 px-3">Visa</span>
              <span className="badge bg-secondary text-white py-2 px-3">Mastercard</span>
              <span className="badge bg-secondary text-white py-2 px-3">Stripe</span>
              <span className="badge bg-secondary text-white py-2 px-3">PayPal</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-uppercase text-warning mb-3">Shop Categories</h6>
            <ul className="list-unstyled text-white-50 d-flex flex-column gap-2">
              <li><Link to="/shop?category=electronics" className="text-white-50 text-decoration-none hover-white">Electronics</Link></li>
              <li><Link to="/shop?category=fashion" className="text-white-50 text-decoration-none hover-white">Fashion & Apparel</Link></li>
              <li><Link to="/shop?category=home-living" className="text-white-50 text-decoration-none hover-white">Home & Living</Link></li>
              <li><Link to="/shop?category=accessories" className="text-white-50 text-decoration-none hover-white">Accessories & Watches</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-uppercase text-warning mb-3">Quick Links</h6>
            <ul className="list-unstyled text-white-50 d-flex flex-column gap-2">
              <li><Link to="/shop" className="text-white-50 text-decoration-none hover-white">Catalog</Link></li>
              <li><Link to="/cart" className="text-white-50 text-decoration-none hover-white">Shopping Cart</Link></li>
              <li><Link to="/profile" className="text-white-50 text-decoration-none hover-white">My Account</Link></li>
              <li><Link to="/login" className="text-white-50 text-decoration-none hover-white">Login / Register</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-uppercase text-warning mb-3">Newsletter</h6>
            <p className="text-white-50 small mb-3">
              Subscribe to get special discount offers, new drops, and luxury product announcements.
            </p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control bg-secondary text-white border-0 px-3 py-2"
                placeholder="Enter your email address"
              />
              <button className="btn btn-warning fw-semibold px-3" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-top border-secondary text-center text-white-50 small">
          <p className="mb-0">
            © {new Date().getFullYear()} LuxeCart Inc. By Chet All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
