import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Package, Calendar, Lock, Save, KeyRound, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const ProfilePage = () => {
  const { userInfo, updateProfile, changePassword } = useContext(AuthContext);

  // Profile Form State
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [profileMsg, setProfileMsg] = useState(null);

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders/');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ name, email });
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile details updated successfully!' });
    } else {
      setProfileMsg({ type: 'danger', text: res.message });
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'danger', text: 'New passwords do not match' });
      return;
    }

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setPasswordMsg({ type: 'danger', text: res.message });
    }
  };

  const getStatusBadge = (status, isPaid) => {
    if (!isPaid) return <span className="badge bg-danger">Unpaid</span>;
    if (status === 'Delivered') return <span className="badge bg-success">Delivered</span>;
    if (status === 'Shipped') return <span className="badge bg-primary">Shipped</span>;
    return <span className="badge bg-warning text-dark">Processing</span>;
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">User Account Dashboard</h2>

      <div className="row g-4">
        {/* Left Column: User Profile & Security Settings */}
        <div className="col-lg-4 d-flex flex-column gap-4">
          {/* Profile Card */}
          <div className="bg-white border rounded-4 p-4 shadow-sm">
            <div className="text-center mb-4 pb-3 border-bottom">
              <div className="p-3 bg-warning bg-opacity-25 text-warning rounded-circle d-inline-block mb-2">
                <User size={40} />
              </div>
              <h5 className="fw-bold mb-0">{userInfo?.name || userInfo?.username}</h5>
              <span className="text-muted small">{userInfo?.email}</span>
            </div>

            <h6 className="fw-bold mb-3">Edit Personal Info</h6>

            {profileMsg && (
              <div className={`alert alert-${profileMsg.type} py-2 small mb-3`}>
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-warning rounded-pill w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2">
                <Save size={18} /> Update Profile
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white border rounded-4 p-4 shadow-sm">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <KeyRound size={18} className="text-warning" /> Security & Password
            </h6>

            {passwordMsg && (
              <div className={`alert alert-${passwordMsg.type} py-2 small mb-3`}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-dark rounded-pill w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2">
                <Lock size={16} /> Change Password
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="col-lg-8">
          <div className="bg-white border rounded-4 p-4 shadow-sm">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Package className="text-warning" size={22} /> Order History ({orders.length})
            </h5>

            {loadingOrders ? (
              <div className="text-center py-4">
                <div className="spinner-border text-warning" role="status"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5">
                <Package size={48} className="text-muted mb-2" />
                <h6>No orders found</h6>
                <p className="text-muted small">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-3 p-3">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 pb-2 border-bottom">
                      <div>
                        <span className="fw-bold font-monospace me-2">
                          #{order.order_number.slice(0, 13)}...
                        </span>
                        {getStatusBadge(order.status, order.is_paid)}
                      </div>
                      <span className="text-muted small">
                        <Calendar size={14} className="me-1" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="d-flex flex-column gap-2 mb-3">
                      {order.order_items &&
                        order.order_items.map((item) => (
                          <div key={item.id} className="d-flex align-items-center justify-content-between small">
                            <div className="d-flex align-items-center gap-2">
                              <img src={item.image} alt={item.name} className="rounded-1" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                              <span className="fw-medium text-dark text-truncate" style={{ maxWidth: '240px' }}>
                                {item.name}
                              </span>
                            </div>
                            <span className="text-muted">
                              {item.qty} × ${Number(item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="small text-muted">Payment: {order.payment_method}</span>
                      <span className="fw-bold text-dark fs-5">
                        Total: <span className="text-warning">${Number(order.total_price).toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
