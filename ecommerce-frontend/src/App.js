import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import GroupCart from './pages/GroupCart';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import ChangePayment from './pages/ChangePayment';

function App() {
  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: '80vh', paddingBottom: '3rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Protected: User */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/group-cart" element={<ProtectedRoute><GroupCart /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

          {/* Protected: Admin */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />

          {/* Payment change via email link */}
          <Route path="/change-payment" element={<ChangePayment />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;