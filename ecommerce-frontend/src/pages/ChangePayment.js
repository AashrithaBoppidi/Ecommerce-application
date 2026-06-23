import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PAYMENT_OPTIONS = ['Credit Card', 'PayPal', 'UPI', 'Cash on Delivery', 'Crypto (NeonPay)'];

const ChangePayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Validate token presence on mount
  useEffect(() => {
    if (!token) {
      setError('No token found in URL. Please use the link from your order confirmation email.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/orders/change-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, paymentMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update payment method');
      }

      setSubmitted(true);
      toast.success('Payment method updated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Success state ─────────────────────────────────
  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>✅</div>
          <h2 style={styles.title}>Payment Updated!</h2>
          <p style={styles.sub}>
            Your payment method has been changed to{' '}
            <strong style={{ color: '#a78bfa' }}>{paymentMethod}</strong>.
          </p>
          <button style={styles.btn} onClick={() => navigate('/orders')}>
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  // ─── Error: no token ──────────────────────────────
  if (error && !token) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, borderColor: '#ef4444' }}>
          <div style={styles.icon}>❌</div>
          <h2 style={{ ...styles.title, color: '#ef4444' }}>Invalid Link</h2>
          <p style={styles.sub}>{error}</p>
          <button style={styles.btn} onClick={() => navigate('/')}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // ─── Main form ────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>💳</div>
        <h2 style={styles.title}>Change Payment Method</h2>
        <p style={styles.sub}>
          Select your preferred payment method below. This link is valid for{' '}
          <strong style={{ color: '#f59e0b' }}>15 minutes</strong> from when you received the email.
        </p>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <label style={styles.label}>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={styles.select}
            required
          >
            {PAYMENT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <button
            type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >
            {loading ? 'Updating…' : 'Confirm Payment Method'}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#475569', marginTop: '1rem', textAlign: 'center' }}>
          You can only change the payment method if your order has not been shipped yet.
        </p>
      </div>
    </div>
  );
};

// ─── Inline styles ───────────────────────────────────
const styles = {
  page: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    background: 'rgba(19, 19, 43, 0.95)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '20px',
    padding: '3rem 2.5rem',
    width: '100%',
    maxWidth: '460px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    boxShadow: '0 0 60px rgba(124,58,237,0.15)',
  },
  icon: {
    fontSize: '3rem',
    lineHeight: 1,
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#e2e8f0',
    textAlign: 'center',
  },
  sub: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: '#a78bfa',
    fontWeight: '600',
  },
  select: {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(124,58,237,0.4)',
    background: 'rgba(255,255,255,0.05)',
    color: '#e2e8f0',
    fontSize: '1rem',
    marginBottom: '1.2rem',
    outline: 'none',
    cursor: 'pointer',
  },
  btn: {
    width: '100%',
    padding: '0.9rem',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  errorBox: {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    color: '#fca5a5',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
};

export default ChangePayment;
