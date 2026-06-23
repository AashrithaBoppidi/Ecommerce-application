import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from '../utils/api';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [groupCart, setGroupCart] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product === product._id);
      if (existingItem) {
        return prev.map(item =>
          item.product === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { 
        product: product._id, 
        name: product.name, 
        price: product.price, 
        image: product.image, 
        quantity 
      }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.product !== id));
  };

  const clearCart = () => setCartItems([]);

  const fetchGroupCart = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/group');
      setGroupCart(data);
    } catch (error) {
      console.log('No group cart or error', error.response?.data?.message);
    }
  };

  const joinGroupCart = async (cartName) => {
    if (!user) return;
    try {
      await axios.post('/group/join', { cartName });
      toast.success('Joined group cart!');
      fetchGroupCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join group cart');
    }
  };

  const addToGroupCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    try {
      await axios.post('/group/add', { productId, quantity });
      toast.success('Added to group cart!');
      fetchGroupCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to group cart');
    }
  };

  useEffect(() => {
    if (user) {
      fetchGroupCart();
    } else {
      setGroupCart(null);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, clearCart,
      groupCart, joinGroupCart, addToGroupCart, fetchGroupCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};