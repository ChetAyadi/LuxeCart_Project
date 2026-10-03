import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Sparkles, UserCheck, Shield, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const expired = searchParams.get('expired') === 'true';

  const { login, loading, error, userInfo } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If user is already logged in, redirect away
  useEffect(() => {
    if (userInfo) {
      navigate(redirect ? (redirect.startsWith('/') ? redirect : `/${redirect}`) : '/');
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    if (res.success) {
      navigate(redirect ? (redirect.startsWith('/') ? redirect : `/${redirect}`) : '/');
    }
  };

  const handleFillDemoUser = () => {
    setUsername('johndoe');
    setPassword('user123');
  };

  const handleFillDemoAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
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
            <h4 className="fw-bold">Welcome Back</h4>
            <p className="text-muted small">Sign in to your LuxeCart account to continue</p>
          </div>

          {expired && (
            <div className="alert alert-warning py-2 small d-flex align-items-center gap-2 mb-3">
              <Lock size={16} /> Your session has expired. Please log in again.
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2.5 px-3 small d-flex align-items-center gap-2 rounded-3 mb-4">
              <AlertTriangle size={18} className="flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="p-3 bg-light rounded-3 mb-4">
            <label className="form-label small fw-bold text-muted text-uppercase mb-2 d-block text-center">
              One-Click Demo Quick Login
            </label>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-dark btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                onClick={handleFillDemoUser}
              >
                <UserCheck size={14} /> Demo Customer
              </button>
              <button
                type="button"
                className="btn btn-outline-warning text-dark btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                onClick={handleFillDemoAdmin}
              >
                <Shield size={14} /> Demo Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-warning rounded-pill w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3"
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status"></div> Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center text-muted small">
            Don't have an account?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-warning fw-semibold">
              Create One Here
            </Link>
          </div>
          <div className="mt-4">

            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1" />

              <span className="px-3 text-muted small fw-semibold">
                OR CONTINUE WITH
              </span>

              <hr className="flex-grow-1" />
            </div>

            <div className="d-flex flex-column gap-2">

              <button
                type="button"
                className="btn btn-outline-primary w-100 py-2"
              >
                <i className="bi bi-google me-2"></i>
                Continue with Google
              </button>

              <button
                type="button"
                className="btn btn-outline-primary w-100 py-2"
              >
                <i className="bi bi-facebook me-2"></i>
                Continue with Facebook
              </button>

              <button
                type="button"
                className="btn btn-outline-primary w-100 py-2"
              >
                <i className="bi bi-linkedin me-2"></i>
                Continue with LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
