import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  CheckCircle,
  Plus,
  Minus,
  MessageSquare,
} from 'lucide-react';
import api from '../services/api';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, showToast } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { userInfo } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}/`);
        setProduct(data);
        setSelectedImage(data.image);

        // Fetch related products in category
        if (data.category_slug) {
          const relRes = await api.get(`/products/?category=${data.category_slug}`);
          setRelatedProducts(relRes.data.filter((p) => p.id !== data.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const isLiked = product ? isInWishlist(product.id) : false;
  const hasDiscount = product && product.discount_price && Number(product.discount_price) < Number(product.price);
  const activePrice = hasDiscount ? Number(product.discount_price) : Number(product?.price || 0);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    setReviewError(null);
    try {
      await api.post(`/products/${id}/reviews/`, {
        rating: userRating,
        comment: userComment,
      });
      showToast('Review submitted successfully!');
      setUserComment('');
      // Refresh product data
      const { data } = await api.get(`/products/${id}/`);
      setProduct(data);
    } catch (err) {
      setReviewError(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, qty);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-warning rounded-pill px-4 mt-3">
          Back to Shop
        </Link>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images ? product.images.map((img) => img.image_url) : [])];

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/shop" className="text-decoration-none text-muted">Shop</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/shop?category=${product.category_slug}`} className="text-decoration-none text-muted">
              {product.category_name}
            </Link>
          </li>
          <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Detail Grid */}
      <div className="row g-5 mb-5">
        {/* Left Column: Image Gallery */}
        <div className="col-lg-6">
          <div className="bg-white border rounded-4 p-3 mb-3 text-center position-relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="img-fluid rounded-3"
              style={{ maxHeight: '450px', objectFit: 'contain' }}
            />

            <button
              className={`btn-wishlist ${isLiked ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
              title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} />
            </button>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="d-flex gap-3">
              {allImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className={`rounded-3 border cursor-pointer ${
                    selectedImage === img ? 'border-warning border-2' : 'border-light'
                  }`}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div className="col-lg-6">
          <span className="badge bg-warning text-dark text-uppercase px-3 py-1.5 rounded-pill fw-bold mb-2">
            {product.category_name}
          </span>

          <h2 className="fw-bold mb-2">{product.name}</h2>

          <div className="d-flex align-items-center gap-3 mb-3">
            <Rating value={Number(product.rating)} numReviews={product.num_reviews} />
            <span className="text-muted">|</span>
            <span className="text-success small fw-semibold d-flex align-items-center gap-1">
              <CheckCircle size={16} /> In Stock ({product.stock} units left)
            </span>
          </div>

          {/* Price Box */}
          <div className="p-3 bg-light rounded-3 mb-4 d-inline-block w-100">
            {hasDiscount ? (
              <div className="d-flex align-items-baseline gap-3">
                <span className="display-6 fw-bold text-dark">${activePrice.toFixed(2)}</span>
                <span className="text-muted text-decoration-line-through fs-5">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="badge bg-danger ms-auto px-3 py-2 fs-6">
                  SAVE ${(Number(product.price) - activePrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="display-6 fw-bold text-dark">${activePrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-muted mb-4 lead" style={{ fontSize: '1.05rem' }}>
            {product.description}
          </p>

          {/* Quantity & CTA Buttons */}
          <div className="d-flex flex-wrap gap-3 align-items-center mb-4 pb-3 border-bottom">
            <div className="input-group" style={{ width: '130px' }}>
              <button
                className="btn btn-outline-secondary px-3"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="form-control text-center bg-white fw-bold fs-5 py-2">
                {qty}
              </span>
              <button
                className="btn btn-outline-secondary px-3"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => addToCart(product, qty)}
              className="btn btn-accent px-4 py-3 rounded-pill d-flex align-items-center gap-2 flex-grow-1 justify-content-center"
            >
              <ShoppingBag size={20} /> Add To Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="btn btn-dark px-4 py-3 rounded-pill fw-semibold"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="row g-3">
            <div className="col-4">
              <div className="d-flex align-items-center gap-2 text-muted small">
                <Truck size={20} className="text-warning flex-shrink-0" /> Free Global Shipping
              </div>
            </div>
            <div className="col-4">
              <div className="d-flex align-items-center gap-2 text-muted small">
                <ShieldCheck size={20} className="text-warning flex-shrink-0" /> 2-Year Warranty
              </div>
            </div>
            <div className="col-4">
              <div className="d-flex align-items-center gap-2 text-muted small">
                <RefreshCw size={20} className="text-warning flex-shrink-0" /> 30-Day Returns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table & Reviews Tabs */}
      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="bg-white border rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3">Technical Specifications</h5>
            <table className="table table-striped table-hover mb-0">
              <tbody>
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="fw-semibold text-muted" style={{ width: '40%' }}>
                        {key}
                      </td>
                      <td className="fw-medium text-dark">{val}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-muted">Standard flagship specifications apply.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="col-lg-6">
          <div className="bg-white border rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
              <span>Customer Reviews ({product.num_reviews})</span>
              <Rating value={Number(product.rating)} numReviews={product.num_reviews} />
            </h5>

            {/* Submit Review Form */}
            <div className="p-3 bg-light rounded-3 mb-4">
              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
                <MessageSquare size={16} className="text-warning" /> Write a Review
              </h6>

              {reviewError && <div className="alert alert-danger py-2 small">{reviewError}</div>}

              {userInfo ? (
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-2">
                    <label className="form-label small fw-bold mb-1">Your Rating</label>
                    <select
                      className="form-select form-select-sm"
                      value={userRating}
                      onChange={(e) => setUserRating(Number(e.target.value))}
                    >
                      <option value={5}>5 Stars - Outstanding</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Needs Improvement</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      placeholder="Share your experience with this product..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-warning btn-sm rounded-pill px-3 fw-semibold"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-muted small mb-0">
                  Please{' '}
                  <Link to="/login" className="text-warning fw-semibold">
                    login
                  </Link>{' '}
                  to submit your review.
                </p>
              )}
            </div>

            {/* List Reviews */}
            <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '300px' }}>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="pb-2 border-bottom border-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small">{rev.name || rev.user_name}</span>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Rating value={rev.rating} showCount={false} size={12} />
                    <p className="text-muted small mt-1 mb-0">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted small">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h4 className="fw-bold mb-4">You Might Also Like</h4>
          <div className="row g-4">
            {relatedProducts.map((rel) => (
              <div key={rel.id} className="col-lg-3 col-md-6">
                <ProductCard product={rel} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
