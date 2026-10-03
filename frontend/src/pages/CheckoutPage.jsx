import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, CheckCircle, ArrowLeft, ArrowRight, Truck } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, rawSubtotal, discountAmount, shippingPrice, taxPrice, totalPrice, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Processing

  // Shipping Form State
  const [shippingData, setShippingData] = useState({
    address: '123 Luxury Way, Penthouse Suite',
    city: 'New York',
    postal_code: '10001',
    country: 'United States',
  });

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12 / 28',
    cvv: '987',
    nameOnCard: userInfo?.name || 'John Doe',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn btn-warning rounded-pill px-4 mt-3">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingData.address || !shippingData.city || !shippingData.postal_code || !shippingData.country) {
      setError('Please fill in all shipping fields');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      setError('Please login to complete your order.');
      navigate('/login?redirect=checkout');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Prepare Order Payload
      const orderPayload = {
        order_items: cartItems.map((item) => ({
          product_id: item.product_id,
          qty: item.qty,
          price: item.price,
        })),
        shipping_address: shippingData,
        payment_method: paymentMethod,
        items_price: rawSubtotal - discountAmount,
        tax_price: taxPrice,
        shipping_price: shippingPrice,
        total_price: totalPrice,
      };

      // 2. Create Order in Backend API
      const { data: order } = await api.post('/orders/', orderPayload);

      // 3. Process Payment (Simulate Stripe / Card Gateway call)
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Smooth loading simulation
      await api.put(`/orders/${order.id}/pay/`);

      // 4. Clear Cart & Redirect to Order Confirmation
      clearCart();
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.detail || 'Order processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Checkout Progress Stepper */}
      <div className="max-w-700 mx-auto mb-5">
        <div className="d-flex align-items-center justify-content-between position-relative">
          <div className="text-center z-1">
            <div className={`rounded-circle p-3 d-inline-flex align-items-center justify-content-center fw-bold ${step >= 1 ? 'bg-warning text-dark' : 'bg-secondary text-white'}`} style={{ width: '48px', height: '48px' }}>
              1
            </div>
            <div className="small fw-semibold mt-2">Shipping</div>
          </div>

          <div className="text-center z-1">
            <div className={`rounded-circle p-3 d-inline-flex align-items-center justify-content-center fw-bold ${step >= 2 ? 'bg-warning text-dark' : 'bg-secondary text-white'}`} style={{ width: '48px', height: '48px' }}>
              2
            </div>
            <div className="small fw-semibold mt-2">Payment</div>
          </div>

          <div className="text-center z-1">
            <div className={`rounded-circle p-3 d-inline-flex align-items-center justify-content-center fw-bold ${step === 3 ? 'bg-warning text-dark' : 'bg-secondary text-white'}`} style={{ width: '48px', height: '48px' }}>
              3
            </div>
            <div className="small fw-semibold mt-2">Confirmation</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Form Area */}
        <div className="col-lg-7">
          {error && <div className="alert alert-danger mb-4">{error}</div>}

          {/* STEP 1: Shipping Address Form */}
          {step === 1 && (
            <div className="bg-white border rounded-4 p-4 shadow-sm">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Truck className="text-warning" size={22} /> Shipping Address
              </h5>

              <form onSubmit={handleShippingSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Street Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingData.postal_code}
                      onChange={(e) => setShippingData({ ...shippingData, postal_code: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    value={shippingData.country}
                    onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-warning rounded-pill px-4 py-2.5 fw-semibold d-flex align-items-center gap-2">
                  Continue to Payment <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <div className="bg-white border rounded-4 p-4 shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <CreditCard className="text-warning" size={22} /> Select Payment Method
                </h5>
                <button onClick={() => setStep(1)} className="btn btn-sm btn-link text-muted text-decoration-none d-flex align-items-center gap-1">
                  <ArrowLeft size={16} /> Edit Address
                </button>
              </div>

              {/* Payment Methods Selection */}
              <div className="d-flex gap-3 mb-4">
                <div
                  className={`border rounded-3 p-3 flex-grow-1 cursor-pointer ${paymentMethod === 'Card' ? 'border-warning bg-warning bg-opacity-10 fw-bold' : ''}`}
                  onClick={() => setPaymentMethod('Card')}
                >
                  <CreditCard size={24} className="mb-2 text-warning" />
                  <div>Credit / Debit Card</div>
                  <span className="small text-muted">Stripe Secure</span>
                </div>
                <div
                  className={`border rounded-3 p-3 flex-grow-1 cursor-pointer ${paymentMethod === 'PayPal' ? 'border-warning bg-warning bg-opacity-10 fw-bold' : ''}`}
                  onClick={() => setPaymentMethod('PayPal')}
                >
                  <Lock size={24} className="mb-2 text-primary" />
                  <div>PayPal Express</div>
                  <span className="small text-muted">Fast Checkout</span>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                {paymentMethod === 'Card' && (
                  <div className="p-3 bg-light rounded-3 mb-4">
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Card Number</label>
                      <input
                        type="text"
                        className="form-control font-monospace"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-bold">Expiration Date</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cardData.expDate}
                          onChange={(e) => setCardData({ ...cardData, expDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold">Security CVV</label>
                        <input
                          type="password"
                          className="form-control"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label small fw-bold">Name on Card</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardData.nameOnCard}
                        onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-warning rounded-pill w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 fs-5"
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      Processing Encrypted Payment...
                    </>
                  ) : (
                    <>
                      <Lock size={20} /> Pay ${totalPrice.toFixed(2)} & Complete Order
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Order Items Summary */}
        <div className="col-lg-5">
          <div className="bg-white border rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold mb-3">Order Items ({cartItems.length})</h5>

            <div className="d-flex flex-column gap-3 mb-4 max-h-300 overflow-auto">
              {cartItems.map((item) => (
                <div key={item.product_id} className="d-flex align-items-center justify-content-between pb-2 border-bottom border-light">
                  <div className="d-flex align-items-center gap-2">
                    <img src={item.image} alt={item.name} className="rounded-2" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                    <div>
                      <h6 className="fw-bold mb-0 text-truncate small" style={{ maxWidth: '180px' }}>{item.name}</h6>
                      <span className="text-muted small">Qty: {item.qty}</span>
                    </div>
                  </div>
                  <span className="fw-bold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>${rawSubtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Shipping</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
              <span className="text-muted">Tax (8%)</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between fs-4 fw-bold">
              <span>Total</span>
              <span className="text-warning">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
