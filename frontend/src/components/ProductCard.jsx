import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import Rating from './Rating';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const isLiked = isInWishlist(product.id);
  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)
    : 0;

  return (
    <div className="product-card h-100 d-flex flex-column">
      {/* Product Image & Badges */}
      <div className="product-img-wrapper">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
        </Link>

        {hasDiscount && <span className="badge-discount">{discountPercent}% OFF</span>}

        <button
          className={`btn-wishlist ${isLiked ? 'active' : ''}`}
          onClick={() => toggleWishlist(product)}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        <span className="text-uppercase text-muted fw-bold tracking-wider mb-1" style={{ fontSize: '0.7rem' }}>
          {product.category_name || 'LUXURY'}
        </span>

        <h6 className="fw-bold mb-2 text-truncate" title={product.name}>
          <Link to={`/product/${product.id}`} className="text-dark text-decoration-none hover-warning">
            {product.name}
          </Link>
        </h6>

        <div className="mb-2">
          <Rating value={Number(product.rating)} numReviews={product.num_reviews} />
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-2 d-flex align-items-center justify-content-between border-top border-light">
          <div>
            {hasDiscount ? (
              <div className="d-flex align-items-baseline gap-2">
                <span className="fw-bold fs-5 text-dark">${Number(product.discount_price).toFixed(2)}</span>
                <span className="text-muted text-decoration-line-through small">${Number(product.price).toFixed(2)}</span>
              </div>
            ) : (
              <span className="fw-bold fs-5 text-dark">${Number(product.price).toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="btn btn-warning rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
            title="Add to Cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
