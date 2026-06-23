import React, { useEffect, useState, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchWishlist();
    else setLoading(false);
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/auth/wishlist');
      setItems(data);
    } catch {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await API.post(`/auth/wishlist/${productId}`);
      setItems(prev => prev.filter(p => p._id !== productId));
      toast.info('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    toast.success('Moved to cart!');
  };

  if (!user) {
    return (
      <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
        <Heart size={52} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>Your Wishlist</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Please login to view your wishlist.</p>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>Loading wishlist…</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Heart size={28} color="#ec4899" fill="rgba(236,72,153,0.3)" />
        My Wishlist
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        {items.length} saved item{items.length !== 1 ? 's' : ''}
      </p>

      {items.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Heart size={52} style={{ opacity: 0.25, marginBottom: '1rem' }} />
          <p style={{ marginBottom: '1.5rem' }}>Your wishlist is empty.</p>
          <Link to="/" className="neo-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={16} /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map(product => {
            const imageUrl = product.image?.startsWith('/uploads')
              ? `http://localhost:5000${product.image}`
              : product.image;
            const discounted = product.discount > 0
              ? (product.price * (1 - product.discount / 100)).toFixed(0)
              : null;

            return (
              <div key={product._id} className="glass-card product-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Remove from wishlist */}
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  style={{
                    position: 'absolute', top: 10, right: 10, zIndex: 2,
                    background: 'rgba(236,72,153,0.2)', border: 'none',
                    color: '#f472b6', borderRadius: '50%',
                    width: 32, height: 32, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  title="Remove from wishlist"
                >
                  <Heart size={15} fill="#f472b6" />
                </button>

                <img
                  src={imageUrl}
                  alt={product.name}
                  className="product-image"
                  onError={e => { e.target.src = 'https://via.placeholder.com/400x250?text=Product'; }}
                />

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.5rem' }}>
                  {product.brand && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{product.brand}</div>
                  )}

                  <Link to={`/product/${product._id}`} style={{ color: 'inherit' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{product.name}</h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-pink)' }}>
                      ₹{discounted || product.price}
                    </span>
                    {discounted && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem' }}>
                    <button
                      className="neo-button"
                      style={{ flex: 2, padding: '0.55rem', fontSize: '0.85rem', gap: '0.4rem' }}
                      onClick={() => moveToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart size={14} />
                      {product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      style={{
                        flex: 1, padding: '0.55rem', background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)', color: '#f87171',
                        borderRadius: 8, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;