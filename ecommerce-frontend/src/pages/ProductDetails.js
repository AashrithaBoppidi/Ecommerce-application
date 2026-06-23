import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { ShoppingCart, Users, Star, Heart, Package, Send, Trash2, Tag } from 'lucide-react';
import { toast } from 'react-toastify';

const StarInput = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <button
        key={i}
        type="button"
        onClick={() => onChange(i)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
      >
        <Star
          size={24}
          fill={i <= value ? '#f59e0b' : 'none'}
          color={i <= value ? '#f59e0b' : '#475569'}
        />
      </button>
    ))}
  </div>
);

const StarDisplay = ({ rating, count }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={16} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} color={i <= Math.round(rating) ? '#f59e0b' : '#475569'} />
      ))}
    </div>
    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
      {Number(rating).toFixed(1)} ({count} review{count !== 1 ? 's' : ''})
    </span>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const { addToCart, addToGroupCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (user) fetchWishlistStatus();
  }, [user, id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
    } catch { toast.error('Product not found'); }
    finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(data);
    } catch { /* silent */ }
  };

  const fetchWishlistStatus = async () => {
    try {
      const { data } = await API.get('/auth/wishlist');
      setInWishlist(data.some(p => p._id === id));
    } catch { /* silent */ }
  };

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return; }
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    addToCart(product, Number(qty));
    toast.success('Added to cart!');
  };

  const handleGroupCart = async () => {
    if (!user) { navigate('/login'); return; }
    await addToGroupCart(product._id, Number(qty));
    navigate('/group-cart');
  };

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await API.post(`/auth/wishlist/${id}`);
      setInWishlist(data.added);
      toast.success(data.added ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (reviewForm.rating === 0) { toast.error('Please select a star rating'); return; }
    setSubmittingReview(true);
    try {
      await API.post(`/reviews/${id}`, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 0, comment: '' });
      fetchReviews();
      fetchProduct(); // refresh rating
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>Loading…</div>;
  if (!product) return <div style={{ textAlign: 'center', marginTop: '4rem', color: '#f87171' }}>Product not found</div>;

  const imageUrl = product.image?.startsWith('/uploads')
    ? `http://localhost:5000${product.image}`
    : product.image;

  const discountedPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(0)
    : null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      {/* ── TOP: Product Info ───────────────────── */}
      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {/* Image */}
        <div style={{ flex: '1 1 420px', position: 'relative' }}>
          <img
            src={imageUrl}
            alt={product.name}
            style={{ width: '100%', borderRadius: 16, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', objectFit: 'cover', maxHeight: 480 }}
            onError={e => { e.target.src = 'https://via.placeholder.com/480x400?text=Product'; }}
          />
          {product.discount > 0 && (
            <div style={{
              position: 'absolute', top: 16, left: 16,
              background: 'linear-gradient(135deg,#10b981,#3b82f6)',
              color: '#fff', fontWeight: 800, fontSize: '0.9rem',
              padding: '0.4rem 0.9rem', borderRadius: 20,
            }}>
              <Tag size={14} style={{ marginRight: 4 }} />
              {product.discount}% OFF
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="glass-card" style={{ flex: '1 1 320px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {product.brand && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{product.brand}</div>
          )}

          <h2 style={{ fontSize: '2rem', lineHeight: 1.2, fontFamily: 'Outfit' }}>{product.name}</h2>

          <StarDisplay rating={product.rating || 0} count={product.numReviews || 0} />

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-pink)' }}>
              ₹{discountedPrice || product.price}
            </span>
            {discountedPrice && (
              <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                ₹{product.price}
              </span>
            )}
            {discountedPrice && (
              <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>
                Save ₹{(product.price - discountedPrice).toFixed(0)}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.description}</p>

          <hr style={{ borderColor: 'var(--border)' }} />

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Availability:</span>
            {product.stock === 0
              ? <span style={{ color: '#f87171', fontWeight: 700 }}>● Out of Stock</span>
              : product.stock <= 5
                ? <span style={{ color: '#f59e0b', fontWeight: 700 }}>● Low Stock ({product.stock} left)</span>
                : <span style={{ color: '#10b981', fontWeight: 700 }}>● In Stock ({product.stock} units)</span>
            }
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.tags.map(t => (
                <span key={t} style={{ padding: '0.2rem 0.7rem', borderRadius: 20, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontSize: '0.75rem' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Qty selector */}
          {user && product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Quantity:</span>
              <select
                value={qty}
                onChange={e => setQty(e.target.value)}
                className="neo-input"
                style={{ width: 80, padding: '0.5rem' }}
              >
                {[...Array(Math.min(product.stock, 10)).keys()].map(x => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {user ? (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="neo-button"
                  style={{ width: '100%', gap: '0.5rem' }}
                >
                  <ShoppingCart size={18} />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleGroupCart}
                    disabled={product.stock === 0}
                    className="neo-button-subtle"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Users size={16} /> Group Cart
                  </button>
                  <button
                    onClick={handleWishlist}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      background: inWishlist ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${inWishlist ? 'rgba(236,72,153,0.4)' : 'var(--border)'}`,
                      color: inWishlist ? '#f472b6' : 'var(--text-primary)',
                      borderRadius: 8, padding: '0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Heart size={16} fill={inWishlist ? '#f472b6' : 'none'} />
                    {inWishlist ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="neo-button" style={{ width: '100%' }}>
                Login to Buy
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── REVIEWS SECTION ─────────────────────── */}
      <div>
        <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>
          Customer Reviews
          <span style={{ marginLeft: '0.75rem', fontSize: '1rem', color: 'var(--text-secondary)', fontFamily: 'Inter' }}>
            ({reviews.length})
          </span>
        </h3>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Review Form */}
          {user && (
            <div className="glass-card" style={{ flex: '1 1 320px', padding: '1.75rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Write a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your Rating</label>
                  <StarInput value={reviewForm.rating} onChange={v => setReviewForm(p => ({ ...p, rating: v }))} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your Review</label>
                  <textarea
                    className="neo-input"
                    placeholder="Share your experience with this product…"
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                    required
                    style={{ minHeight: 100, resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="neo-button" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={submittingReview}>
                  <Send size={16} /> {submittingReview ? 'Posting…' : 'Post Review'}
                </button>
              </form>
            </div>
          )}

          {/* Review List */}
          <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.length === 0 ? (
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Star size={40} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                <p>No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{review.name}</div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={14} fill={i <= review.rating ? '#f59e0b' : 'none'} color={i <= review.rating ? '#f59e0b' : '#475569'} />
                        ))}
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;