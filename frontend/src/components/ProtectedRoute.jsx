import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  const location = useLocation();

  if (!userInfo) {
    // Redirect to login and save intended destination URL in query parameter
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
