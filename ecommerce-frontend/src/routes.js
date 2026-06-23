import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ScheduledOrders from './pages/ScheduledOrders';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import GroupCart from './pages/GroupCart';
import Success from './pages/Success';
import NotFound from './pages/NotFound';



const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/orders" element={<Orders />} />
<Route path="/admin" element={<Admin />} />
<Route path="/group-cart" element={<GroupCart />} />
<Route path="/success" element={<Success />} />
<Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/scheduled-orders" element={<ScheduledOrders />} />
    </Routes>
  );
};

export default RoutesConfig;