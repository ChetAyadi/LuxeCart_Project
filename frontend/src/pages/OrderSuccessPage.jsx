import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Clock, ArrowRight, Printer } from 'lucide-react';
import api from '../services/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}/`);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading order receipt...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="max-w-700 mx-auto text-center mb-5">
        <div className="p-4 bg-success bg-opacity-10 text-success rounded-circle d-inline-block mb-3">
          <CheckCircle2 size={64} />
        </div>
        <h1 className="fw-bold mb-2">Thank You For Your Order!</h1>
        <p className="text-muted lead">
          Your payment was processed successfully. We've emailed your order confirmation and receipt.
        </p>
        <span className="badge bg-dark font-monospace fs-6 px-3 py-2">
          Order ID: {order ? order.order_number : id}
        </span>
      </div>

      {/* Shipping Timeline Card */}
      <div className="max-w-700 mx-auto bg-white border rounded-4 p-4 mb-5 shadow-sm">
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
          <Truck className="text-warning" size={22} /> Order Status & Delivery Timeline
        </h5>

        <div className="d-flex justify-content-between align-items-center position-relative mb-4">
          <div className="text-center z-1">
            <div className="rounded-circle p-2 bg-success text-white d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              ✓
            </div>
            <div className="small fw-bold mt-1">Order Placed</div>
          </div>
          <div className="text-center z-1">
            <div className="rounded-circle p-2 bg-success text-white d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              ✓
            </div>
            <div className="small fw-bold mt-1">Payment Verified</div>
          </div>
          <div className="text-center z-1">
            <div className="rounded-circle p-2 bg-warning text-dark d-inline-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
              ●
            </div>
            <div className="small fw-bold mt-1">Processing</div>
          </div>
          <div className="text-center z-1 opacity-50">
            <div className="rounded-circle p-2 bg-secondary text-white d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              4
            </div>
            <div className="small fw-bold mt-1">Shipped</div>
          </div>
        </div>

        {/* Order Details Receipt Table */}
        {order && (
          <div className="border-top pt-4">
            <h6 className="fw-bold mb-3">Purchased Items</h6>
            <div className="d-flex flex-column gap-3 mb-4">
              {order.order_items &&
                order.order_items.map((item) => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between pb-2 border-bottom border-light">
                    <div className="d-flex align-items-center gap-3">
                      <img src={item.image} alt={item.name} className="rounded-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                      <div>
                        <h6 className="fw-bold mb-0 small">{item.name}</h6>
                        <span className="text-muted small">Qty: {item.qty} × ${Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="fw-bold">${(Number(item.price) * item.qty).toFixed(2)}</span>
                  </div>
                ))}
            </div>

            <div className="d-flex justify-content-between fs-5 fw-bold text-dark pt-2">
              <span>Total Paid</span>
              <span className="text-warning">${Number(order.total_price).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center d-flex justify-content-center gap-3">
        <Link to="/profile" className="btn btn-warning rounded-pill px-4 py-2.5 fw-semibold d-flex align-items-center gap-2">
          <Package size={18} /> View My Orders
        </Link>
        <Link to="/shop" className="btn btn-outline-dark rounded-pill px-4 py-2.5">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
