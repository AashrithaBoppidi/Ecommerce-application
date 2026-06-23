// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { toast } from 'react-toastify';

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) {
//     return <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>Loading...</div>;
//   }

//   if (!user) {
//     toast.error('Please login to continue');
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;



import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    toast.error('Please login to continue');
    return <Navigate to="/login" replace />;
  }

  // ✅ ADMIN CHECK
  if (adminOnly && user.role !== 'ADMIN') {
    toast.error('Admin access only');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;