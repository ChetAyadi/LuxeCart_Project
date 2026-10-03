import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Sparkles, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate Password Length (Minimum 6 characters)
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    // 2. Validate Password Match
    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please check and re-enter.');
      return;
    }

    setFormError(null);
    const res = await register(name, username, email, password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-450 mx-auto">
        <div className="bg-white border rounded-4 p-4 p-md-5 shadow-lg">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center gap-1 mb-2">
              <Sparkles className="text-warning" size={28} />
              <span className="brand-title fs-3 text-dark">LuxeCart</span>
            </div>
            <h4 className="fw-bold">Create an Account</h4>
            <p className="text-muted small">Join LuxeCart for exclusive luxury rewards & deals</p>
          </div>

          {(formError || error) && (
            <div className="alert alert-danger py-2.5 px-3 small d-flex align-items-center gap-2 rounded-3 mb-4">
              <AlertTriangle size={18} className="flex-shrink-0" />
              <div>{formError || error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Password (min 6 characters)</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${password && password.length < 6 ? 'is-invalid' : ''}`}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && password.length < 6 && (
                <div className="invalid-feedback d-block">
                  Password must be at least 6 characters (currently {password.length})
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${confirmPassword && password !== confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <div className="invalid-feedback d-block">
                  Passwords do not match
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-warning rounded-pill w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3"
            >
              {loading ? 'Creating Account...' : <><UserPlus size={18} /> Register Account</>}
            </button>
          </form>

          <div className="text-center text-muted small">
            Already registered?{' '}
            <Link to="/login" className="text-warning fw-semibold">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
