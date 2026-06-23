import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut, Users, ShieldAlert, User, Heart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav
      className="glass-card"
      style={{
        margin: '1.5rem',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '1.5rem',
        zIndex: 100,
      }}
    >
      <Link to="/" className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>
        NEON CART
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            {/* ── USER-ONLY LINKS (hidden for admin) ── */}
            {!isAdmin && (
              <>
                <Link
                  to="/cart"
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}
                  title="Cart"
                >
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'var(--accent-pink)',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '2px 6px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        lineHeight: 1,
                      }}
                    >
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </Link>

                <Link to="/wishlist" title="Wishlist" style={{ color: 'var(--text-primary)' }}>
                  <Heart size={22} />
                </Link>

                <Link to="/group-cart" title="Group Cart" style={{ color: 'var(--text-primary)' }}>
                  <Users size={22} />
                </Link>

                <Link to="/orders" className="neo-button-subtle" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  Orders
                </Link>
              </>
            )}

            {/* ── PROFILE (both but shows different things) ── */}
            <Link to="/profile" title="Profile" style={{ color: 'var(--text-primary)' }}>
              <User size={22} />
            </Link>

            {/* ── ADMIN LINK ── */}
            {isAdmin && (
              <Link to="/admin" title="Admin Dashboard" className="neo-button" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '0.4rem' }}>
                <ShieldAlert size={16} />
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="neo-button-subtle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="neo-button-subtle">Login</Link>
            <Link to="/register" className="neo-button">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;