import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import API from '../utils/api';
import { Heart, Star, ShoppingBag, Zap, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

const StockBadge = ({ stock }) => {
  if (stock === 0) return <span style={badgeStyle('#ef4444', 'rgba(239,68,68,0.15)')}>Out of Stock</span>;
  if (stock <= 5) return <span style={badgeStyle('#f59e0b', 'rgba(245,158,11,0.15)')}>Low Stock</span>;
  return <span style={badgeStyle('#10b981', 'rgba(16,185,129,0.15)')}>In Stock</span>;
};

const badgeStyle = (color, bg) => ({
  fontSize: '0.7rem',
  fontWeight: 700,
  color,
  background: bg,
  padding: '0.2rem 0.6rem',
  borderRadius: '20px',
  letterSpacing: '0.03em',
});

const StarRating = ({ rating }) => {
  const full = Math.round(rating || 0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} fill={i <= full ? '#f59e0b' : 'none'} color={i <= full ? '#f59e0b' : '#475569'} />
      ))}
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, activeCategory, sort]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products/categories');
      setCategories(['All', ...data]);
    } catch { /* silently fail */ }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (sort) params.set('sort', sort);
      const { data } = await axios.get(`http://localhost:5000/api/products?${params}`);
      setProducts(data);
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/auth/wishlist');
      setWishlist(data.map(p => p._id));
    } catch { /* ignore */ }
  };

  const handleAddToCart = (product) => {
    if (!user) { navigate('/login'); return; }
    if (product.stock === 0) { toast.error('This product is out of stock'); return; }
    addToCart(product, 1);
  };

  const handleWishlist = async (productId) => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await API.post(`/auth/wishlist/${productId}`);
      if (data.added) {
        setWishlist(prev => [...prev, productId]);
        toast.success('Added to wishlist!');
      } else {
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.info('Removed from wishlist');
      }
    } catch { toast.error('Failed to update wishlist'); }
  };

  const getDiscountedPrice = (p) => {
    if (p.discount && p.discount > 0) return (p.price * (1 - p.discount / 100)).toFixed(0);
    return null;
  };

  return (
    <div className="animate-fade-in">
      {/* ── HERO ─────────────────────────────── */}
      <div style={{
        textAlign: 'center', padding: '5rem 1rem 4rem',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%)',
        marginBottom: '1rem',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '20px', padding: '0.3rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#a78bfa',
        }}>
          <Zap size={14} /> New arrivals every week
        </div>
        <h1 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1.2rem', lineHeight: 1.1, fontFamily: 'Outfit' }}>
          Future of Commerce<br />Starts Here
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '560px', margin: '0 auto 2rem' }}>
          Experience premium neon-dark shopping with lightning-fast delivery and real-time order tracking.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="neo-button" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })} style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            <ShoppingBag size={18} /> Shop Now
          </button>
          {!user && (
            <Link to="/register" className="neo-button-subtle" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Create Account
            </Link>
          )}
        </div>
      </div>

      {/* ── CATEGORY CHIPS ─────────────────── */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.45rem 1.1rem', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
              background: activeCategory === cat ? 'var(--gradient-neon)' : 'rgba(255,255,255,0.06)',
              color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeCategory === cat ? '0 4px 12px rgba(139,92,246,0.3)' : 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── SEARCH + SORT BAR ──────────────── */}
      <div id="products" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="neo-input"
          style={{ flex: '1 1 260px', maxWidth: 420 }}
          placeholder="🔍  Search products, brands, tags…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ position: 'relative' }}>
          <select
            className="neo-input"
            style={{ paddingRight: '2rem', cursor: 'pointer', width: 'auto' }}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginLeft: 'auto' }}>
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* ── PRODUCTS GRID ─────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
          Loading products…
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
          <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No products found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => {
            const discounted = getDiscountedPrice(product);
            const inWishlist = wishlist.includes(product._id);
            return (
              <div key={product._id} className="glass-card product-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Featured badge */}
                {product.isFeatured && (
                  <div style={{
                    position: 'absolute', top: 12, left: 12, zIndex: 2,
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                    padding: '0.2rem 0.6rem', borderRadius: '20px',
                  }}>★ FEATURED</div>
                )}
                {/* Discount badge */}
                {product.discount > 0 && (
                  <div style={{
                    position: 'absolute', top: 12, right: 44, zIndex: 2,
                    background: 'rgba(16,185,129,0.9)', color: '#fff',
                    fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px',
                  }}>-{product.discount}%</div>
                )}
                {/* Wishlist btn */}
                <button
                  onClick={() => handleWishlist(product._id)}
                  style={{
                    position: 'absolute', top: 10, right: 10, zIndex: 2,
                    background: inWishlist ? 'rgba(236,72,153,0.2)' : 'rgba(0,0,0,0.3)',
                    border: 'none', borderRadius: '50%', width: 32, height: 32,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={15} fill={inWishlist ? '#ec4899' : 'none'} color={inWishlist ? '#ec4899' : '#fff'} />
                </button>

                {/* Image */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={product.image?.startsWith('/uploads') ? `http://localhost:5000${product.image}` : product.image}
                    alt={product.name}
                    className="product-image"
                    onError={e => { e.target.src = 'https://via.placeholder.com/400x250?text=Product'; }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.5rem' }}>
                  {product.brand && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{product.brand}</div>}

                  <Link to={`/product/${product._id}`} style={{ color: 'inherit' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>{product.name}</h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StarRating rating={product.rating} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({product.numReviews || 0})</span>
                  </div>

                  <StockBadge stock={product.stock} />

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-pink)' }}>
                      ₹{discounted || product.price}
                    </span>
                    {discounted && (
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem' }}>
                    <button
                      className="neo-button"
                      style={{ flex: 1, padding: '0.55rem', fontSize: '0.85rem', opacity: product.stock === 0 ? 0.5 : 1 }}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                    </button>
                    <Link
                      to={`/product/${product._id}`}
                      className="neo-button-subtle"
                      style={{ flex: 1, padding: '0.55rem', fontSize: '0.85rem', textAlign: 'center' }}
                    >
                      Details
                    </Link>
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

// Inline package icon fallback
const Package = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

export default Home;