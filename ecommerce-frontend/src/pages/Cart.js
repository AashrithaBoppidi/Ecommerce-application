import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/login?redirect=checkout'); // Logic to force login is usually done, simple redirect to checkout
    navigate('/checkout');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Your cart is empty</h3>
          <Link to="/" className="neo-button">Go Back to Store</Link>
        </div>
      ) : (
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 60%' }}>
            {cartItems.map(item => (
              <div key={item.product} className="glass-card flex items-center justify-between" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                  <Link to={`/product/${item.product}`} style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.name}</Link>
                </div>
                <div className="flex items-center gap-4">
                  <div style={{ color: 'var(--accent-pink)', fontWeight: 'bold', fontSize: '1.2rem' }}>${item.price}</div>
                  <div style={{ background: 'var(--surface)', padding: '0.2rem 0.8rem', borderRadius: '4px' }}>Qty: {item.quantity}</div>
                  <button onClick={() => removeFromCart(item.product)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ flex: '1 1 300px', padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Order Summary</h3>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '1rem' }} />
            <div className="flex justify-between items-center mb-4">
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                ${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}
              </span>
            </div>
            <button onClick={checkoutHandler} className="neo-button" style={{ width: '100%' }}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;