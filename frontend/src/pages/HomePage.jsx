import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Award, Zap, Tag } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products/featured/'),
          api.get('/categories/'),
        ]);
        setFeaturedProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page pb-5">
      <div className="container mt-4">
        {/* Hero Banner */}
        <div className="hero-banner mb-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-1">
                <Sparkles size={16} /> NEW AUTUMN COLLECTION 2026
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3 lh-1">
                Elevate Your Lifestyle With Luxury & Precision.
              </h1>
              <p className="lead text-white-50 mb-4" style={{ maxWidth: '520px' }}>
                Discover our handpicked collection of flagship electronics, Italian leather apparel, modern home aesthetics, and timepieces.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/shop" className="btn btn-accent d-flex align-items-center gap-2">
                  Shop Collection <ArrowRight size={18} />
                </Link>
                <Link to="/shop?category=electronics" className="btn btn-outline-light rounded-pill px-4 py-2.5">
                  Browse Tech
                </Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block text-center position-relative">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                alt="Flagship Headphone"
                className="img-fluid rounded-4 shadow-lg border border-secondary"
                style={{ maxHeight: '380px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="fw-bold mb-1">Browse By Category</h3>
              <p className="text-muted mb-0">Explore products carefully curated for every lifestyle</p>
            </div>
            <Link to="/shop" className="text-warning fw-semibold text-decoration-none d-flex align-items-center gap-1">
              View All Categories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {categories.map((cat) => (
              <div key={cat.id} className="col-lg-3 col-md-6">
                <Link to={`/shop?category=${cat.slug}`} className="text-decoration-none">
                  <div className="category-card">
                    <img src={cat.image} alt={cat.name} />
                    <div className="category-overlay">
                      <h5 className="fw-bold mb-1">{cat.name}</h5>
                      <span className="small text-white-50">{cat.products_count} Products</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="fw-bold mb-1">Trending & Featured Products</h3>
              <p className="text-muted mb-0">Our top rated flagship items loved by customers worldwide</p>
            </div>
            <Link to="/shop" className="btn btn-outline-dark rounded-pill px-4">
              Explore Store
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Special Coupon Promo Section */}
        <section className="mb-5">
          <div className="bg-dark text-white rounded-4 p-5 position-relative overflow-hidden border border-secondary shadow-lg">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <span className="badge bg-danger px-3 py-2 rounded-pill fw-bold mb-2">LIMITED TIME DISCOUNT</span>
                <h2 className="fw-bold text-white mb-2">Save Up to 20% OFF Your Order</h2>
                <p className="text-white-50 mb-4">
                  Use coupon code <span className="badge bg-warning text-dark font-monospace fs-6 px-2 py-1">SUMMER20</span> at checkout for 20% off or <span className="badge bg-warning text-dark font-monospace fs-6 px-2 py-1">LUXE10</span> for 10% off.
                </p>
                <Link to="/shop" className="btn btn-warning rounded-pill px-4 py-2.5 fw-semibold">
                  Claim Discount Now
                </Link>
              </div>
              <div className="col-lg-4 text-center d-none d-lg-block">
                <Tag size={120} className="text-warning opacity-25" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
