import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, CheckCircle, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    rawSubtotal,
    discountAmount,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useContext(CartContext);

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
    if (res.success) {
      setCouponCode('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="p-5 bg-white border rounded-4 max-w-600 mx-auto shadow-sm">
          <div className="p-4 bg-light rounded-circle d-inline-block mb-3">
            <ShoppingBag size={56} className="text-warning" />
          </div>
          <h2 className="fw-bold mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-muted mb-4">
            Looks like you haven't added any items to your cart yet. Explore our luxury collection and find something special!
          </p>
          <Link to="/shop" className="btn btn-warning rounded-pill px-4 py-2.5 fw-semibold">
            Explore Luxe Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">Shopping Cart</h2>
          <p className="text-muted mb-0">
            {cartItems.reduce((acc, i) => acc + i.qty, 0)} items in your cart
          </p>
        </div>
        <button onClick={clearCart} className="btn btn-outline-danger btn-sm rounded-pill px-3">
          Clear Entire Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Cart Items List */}
        <div className="col-lg-8">
          <div className="bg-white border rounded-4 overflow-hidden mb-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4">Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product_id}>
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded-3 object-fit-cover"
                            style={{ width: '70px', height: '70px' }}
                          />
                          <div>
                            <span className="text-uppercase text-muted" style={{ fontSize: '0.65rem' }}>
                              {item.category_name}
                            </span>
                            <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                              <Link to={`/product/${item.product_id}`} className="text-dark text-decoration-none">
                                {item.name}
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="fw-semibold">${Number(item.price).toFixed(2)}</td>
                      <td>
                        <div className="input-group input-group-sm" style={{ width: '100px' }}>
                          <button
                            className="btn btn-outline-secondary p-1"
                            onClick={() => updateQuantity(item.product_id, item.qty - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="form-control text-center fw-bold bg-light">
                            {item.qty}
                          </span>
                          <button
                            className="btn btn-outline-secondary p-1"
                            onClick={() => updateQuantity(item.product_id, item.qty + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold text-dark">
                        ${(item.price * item.qty).toFixed(2)}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="btn btn-link text-danger p-0"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white border rounded-4 p-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Tag size={18} className="text-warning" /> Have a Promo Coupon?
            </h6>

            {coupon ? (
              <div className="alert alert-success d-flex align-items-center justify-content-between mb-0">
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle size={18} />
                  <span>
                    Coupon <strong>{coupon.code}</strong> applied ({coupon.discountPercent}% OFF)
                  </span>
                </div>
                <button onClick={removeCoupon} className="btn btn-sm btn-outline-danger">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="row g-2 align-items-center">
                <div className="col-auto flex-grow-1">
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    placeholder="Enter code (e.g. LUXE10 or SUMMER20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-dark fw-semibold px-4">
                    Apply Coupon
                  </button>
                </div>
                {couponFeedback && !couponFeedback.success && (
                  <div className="text-danger small mt-1">{couponFeedback.message}</div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="col-lg-4">
          <div className="bg-white border rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="fw-semibold">${rawSubtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Discount ({coupon.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Estimated Shipping</span>
              <span className="fw-semibold">
                {shippingPrice === 0 ? <span className="text-success fw-bold">FREE</span> : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
              <span className="text-muted">Estimated Tax (8%)</span>
              <span className="fw-semibold">${taxPrice.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <span className="fs-5 fw-bold text-dark">Total Amount</span>
              <span className="fs-4 fw-bold text-warning">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-warning rounded-pill w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
              <ShieldCheck size={18} className="text-success" /> Guaranteed Safe & Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
