import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isDrawerOpen,
    setIsDrawerOpen,
    removeFromCart,
    updateQuantity,
    rawSubtotal,
    discountAmount,
    totalPrice,
  } = useContext(CartContext);

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`cart-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="d-flex align-items-center gap-2">
            <ShoppingBag className="text-warning" size={22} />
            <h5 className="fw-bold mb-0">Your Cart</h5>
            <span className="badge bg-warning text-dark rounded-pill ms-2">
              {cartItems.reduce((acc, item) => acc + item.qty, 0)} items
            </span>
          </div>
          <button
            className="btn btn-sm btn-light rounded-circle p-2"
            onClick={() => setIsDrawerOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Items */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <div className="p-4 bg-light rounded-circle d-inline-block mb-3">
                <ShoppingBag size={48} className="text-muted" />
              </div>
              <h6 className="fw-bold">Your cart is currently empty</h6>
              <p className="text-muted small">Explore our luxury collection and add your favorite items.</p>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="btn btn-dark rounded-pill px-4 mt-2"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <div key={item.product_id} className="d-flex gap-3 pb-3 border-bottom border-light">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded-3 object-fit-cover"
                    style={{ width: '70px', height: '70px' }}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '180px' }}>
                        {item.name}
                      </h6>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="btn btn-link text-danger p-0 ms-2"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-muted small mb-2">${Number(item.price).toFixed(2)} each</p>

                    <div className="d-flex align-items-center justify-content-between">
                      {/* Quantity Controller */}
                      <div className="input-group input-group-sm" style={{ width: '90px' }}>
                        <button
                          className="btn btn-outline-secondary p-1"
                          onClick={() => updateQuantity(item.product_id, item.qty - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="form-control text-center px-1 bg-light fw-bold">
                          {item.qty}
                        </span>
                        <button
                          className="btn btn-outline-secondary p-1"
                          onClick={() => updateQuantity(item.product_id, item.qty + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="fw-bold text-dark">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="fw-semibold">${rawSubtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-3 fs-5 fw-bold text-dark">
              <span>Estimated Total</span>
              <span className="text-warning">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="d-grid gap-2">
              <Link
                to="/checkout"
                onClick={() => setIsDrawerOpen(false)}
                className="btn btn-warning rounded-pill py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsDrawerOpen(false)}
                className="btn btn-outline-dark rounded-pill py-2"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
