import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Users, Copy, Check, Info, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GroupCart = () => {
  const { groupCart, joinGroupCart, fetchGroupCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [shareIdInput, setShareIdInput] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchGroupCart();
  }, [user]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!shareIdInput.trim()) { toast.error('Enter a Share ID'); return; }
    joinGroupCart(shareIdInput.trim().toUpperCase());
  };

  const copyShareId = () => {
    if (!user?.shareId) return;
    navigator.clipboard.writeText(user.shareId);
    setCopied(true);
    toast.success('Your Share ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = () => {
    toast.info('Proceeding to group checkout…');
    navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Login to access Group Carts</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Outfit' }}>
          <Users size={28} color="var(--accent-purple)" /> Group Cart
        </h2>
        <button onClick={fetchGroupCart} className="neo-button-subtle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* ── YOUR SHARE ID BANNER ───────────── */}
      {user.shareId && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 14, padding: '1.25rem 1.5rem',
          marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', toUpperCase: true, letterSpacing: '0.08em', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
              Your Share ID — share this to invite friends
            </div>
            <code style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa', letterSpacing: '0.2em' }}>
              {user.shareId}
            </code>
          </div>
          <button
            onClick={copyShareId}
            style={{
              background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.2)',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : 'rgba(139,92,246,0.4)'}`,
              color: copied ? '#34d399' : '#a78bfa',
              borderRadius: 10, padding: '0.6rem 1rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontWeight: 600, transition: 'all 0.2s',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy ID'}
          </button>
        </div>
      )}

      {/* ── JOIN / CREATE ──────────────────── */}
      {!groupCart ? (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Users size={28} color="var(--accent-purple)" />
            </div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.3rem' }}>Join or Create a Group Cart</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Enter a friend's <strong style={{ color: '#a78bfa' }}>Share ID</strong> (e.g. <code style={{ color: '#a78bfa' }}>USR-A3F9KX</code>) to join their group cart,
              or enter any unique name to create a new one. Max 4 users per group.
            </p>
            <form onSubmit={handleJoin}>
              <input
                type="text"
                value={shareIdInput}
                onChange={e => setShareIdInput(e.target.value.toUpperCase())}
                placeholder="Enter Share ID or Group Name (e.g. USR-A3F9KX)"
                className="neo-input mb-4"
                style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '1rem', marginBottom: '1rem' }}
                required
              />
              <button type="submit" className="neo-button" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
                <Users size={18} /> Join / Create Group Cart
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ── ACTIVE GROUP CART ──────────────── */
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Cart Items */}
          <div style={{ flex: '1 1 55%' }}>
            {/* Group Info */}
            <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <Info size={18} color="var(--accent-blue)" />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{groupCart.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
                  Members: {groupCart.users?.map(u => u.name).join(', ')} ({groupCart.users?.length || 0}/4)
                </div>
              </div>
            </div>

            {groupCart.items?.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Users size={40} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                <p>Group cart is empty. Add items from the product pages!</p>
              </div>
            ) : (
              groupCart.items.map(item => (
                <div key={item._id} className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={item.product?.image?.startsWith('/uploads') ? `http://localhost:5000${item.product.image}` : item.product?.image}
                    alt={item.product?.name}
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/72'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{item.product?.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Added by: <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{item.addedBy?.name}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ color: 'var(--accent-pink)', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                    ₹{item.product?.price}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Panel */}
          <div className="glass-card" style={{ flex: '1 1 260px', padding: '1.75rem', position: 'sticky', top: '6rem' }}>
            <h3 style={{ fontFamily: 'Outfit', marginBottom: '1rem' }}>Group Summary</h3>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '1rem' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Items</span>
              <span style={{ fontWeight: 700 }}>{groupCart.items?.reduce((a, i) => a + i.quantity, 0) || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Members</span>
              <span style={{ fontWeight: 700 }}>{groupCart.users?.length || 0}/4</span>
            </div>

            <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total Cost</span>
              <span style={{ color: 'var(--accent-pink)', fontWeight: 800, fontSize: '1.3rem' }}>
                ₹{groupCart.items?.reduce((a, i) => a + i.quantity * (i.product?.price || 0), 0).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={!groupCart.items?.length}
              className="neo-button"
              style={{ width: '100%' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCart;