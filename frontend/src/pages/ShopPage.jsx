import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid, List, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Rating from '../components/Rating';
import { WishlistContext } from '../context/WishlistContext';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || 3000);
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || 'newest');
  const [showWishlistOnly, setShowWishlistOnly] = useState(searchParams.get('wishlist') === 'true');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    // Sync query params when URL changes
    setCategory(searchParams.get('category') || '');
    setSearch(searchParams.get('search') || '');
    setShowWishlistOnly(searchParams.get('wishlist') === 'true');
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories/');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (maxPrice && maxPrice < 3000) params.append('max_price', maxPrice);
        if (rating) params.append('rating', rating);
        if (ordering) params.append('ordering', ordering);

        const { data } = await api.get(`/products/?${params.toString()}`);

        if (showWishlistOnly) {
          const wishlistIds = wishlist.map((w) => w.id);
          setProducts(data.filter((p) => wishlistIds.includes(p.id)));
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search, maxPrice, rating, ordering, showWishlistOnly, wishlist]);

  const handleResetFilters = () => {
    setCategory('');
    setSearch('');
    setMaxPrice(3000);
    setRating('');
    setOrdering('newest');
    setShowWishlistOnly(false);
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">
            {showWishlistOnly ? 'My Saved Wishlist' : 'Explore Luxe Catalog'}
          </h2>
          <p className="text-muted mb-0">
            {loading
              ? 'Loading products...'
              : `Showing ${products.length} products ${category ? `in "${category}"` : ''}`}
          </p>
        </div>

        {/* Sort & Grid View controls */}
        <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small fw-semibold">Sort By:</span>
            <select
              className="form-select form-select-sm bg-white border-light rounded-3"
              style={{ width: '170px' }}
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="btn-group btn-group-sm">
            <button
              className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Filter Sidebar */}
        <div className="col-lg-3">
          <div className="filter-card">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <SlidersHorizontal size={18} className="text-warning" /> Filters
              </h6>
              <button
                onClick={handleResetFilters}
                className="btn btn-sm btn-link text-muted p-0 text-decoration-none d-flex align-items-center gap-1"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase text-muted">Search Keyword</label>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="e.g. Headphones, Leather"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase text-muted">Categories</label>
              <div className="d-flex flex-column gap-2">
                <button
                  className={`btn btn-sm text-start ${category === '' ? 'btn-warning fw-semibold' : 'btn-light'}`}
                  onClick={() => setCategory('')}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`btn btn-sm text-start d-flex justify-content-between align-items-center ${
                      category === cat.slug ? 'btn-warning fw-semibold' : 'btn-light'
                    }`}
                    onClick={() => setCategory(cat.slug)}
                  >
                    <span>{cat.name}</span>
                    <span className="badge bg-secondary bg-opacity-25 text-dark rounded-pill">
                      {cat.products_count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-bold text-uppercase text-muted mb-0">Max Price</label>
                <span className="fw-bold text-warning">${maxPrice}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="50"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <div className="d-flex justify-content-between text-muted small">
                <span>$50</span>
                <span>$3,000</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-uppercase text-muted">Minimum Rating</label>
              <div className="d-flex flex-column gap-1">
                {[4, 3, 2].map((r) => (
                  <button
                    key={r}
                    className={`btn btn-sm text-start py-1 px-2 ${
                      rating === String(r) ? 'btn-warning fw-semibold' : 'btn-light'
                    }`}
                    onClick={() => setRating(rating === String(r) ? '' : String(r))}
                  >
                    <Rating value={r} showCount={false} size={14} />
                    <span className="ms-2 small">& Up</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border p-5">
              <Search size={48} className="text-muted mb-3" />
              <h5 className="fw-bold">No products match your criteria</h5>
              <p className="text-muted small mb-4">Try clearing filters or searching with a different keyword.</p>
              <button onClick={handleResetFilters} className="btn btn-warning rounded-pill px-4">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'row g-4' : 'd-flex flex-column gap-3'}>
              {products.map((product) => (
                <div
                  key={product.id}
                  className={viewMode === 'grid' ? 'col-md-4 col-sm-6' : 'col-12'}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
