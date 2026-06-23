import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { Tag, Check, X } from 'lucide-react';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledFor, setScheduledFor] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedCoupon ? (subTotal * appliedCoupon.discountPercent) / 100 : 0;
  const finalTotal = subTotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error('Enter a coupon code'); return; }
    setCouponLoading(true);
    try {
      const { data } = await API.post('/coupons/apply', { code: couponCode });
      setAppliedCoupon(data);
      toast.success(`Coupon applied! ${data.discountPercent}% off 🎉`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) { toast.error('Cart is empty'); return; }

    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, state, country },
        paymentMethod,
        totalPrice: finalTotal,
        couponCode: appliedCoupon?.code || null,
        isScheduled,
        scheduledFor,
      };

      await API.post('/orders', orderData);
      toast.success(isScheduled ? 'Order scheduled successfully! 🕑' : 'Order placed successfully! 🎉');
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* ── LEFT: FORM ────────────────────────────── */}
      <form onSubmit={placeOrderHandler} className="glass-card" style={{ flex: '1 1 55%', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Shipping & Payment</h2>

        {/* Address */}
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delivery Address</h3>
        <div className="mb-4">
          <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Street Address</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="neo-input" required placeholder="123 Main St" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="mb-4">
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>City</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} className="neo-input" required placeholder="Mumbai" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>State</label>
            <input type="text" value={state} onChange={e => setState(e.target.value)} className="neo-input" required placeholder="Maharashtra" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="mb-4">
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Postal Code</label>
            <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="neo-input" required placeholder="400001" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Country</label>
            <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="neo-input" required />
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

        {/* Payment */}
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payment Method</h3>
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="neo-input mb-4">
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>UPI</option>
          <option>Net Banking</option>
          <option>PayPal</option>
          <option>Cash on Delivery</option>
        </select>

        <hr style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

        {/* Scheduled */}
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Scheduled Ordering</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <input type="checkbox" id="scheduled" checked={isScheduled} onChange={e => setIsScheduled(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
          <label htmlFor="scheduled" style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}>Schedule for a future date</label>
        </div>
        {isScheduled && (
          <div className="mb-4">
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Preferred Delivery Date & Time</label>
            <input type="datetime-local" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)} className="neo-input" required={isScheduled} />
          </div>
        )}

        <button type="submit" className="neo-button" style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem', fontSize: '1rem' }}>
          {isScheduled ? '🕑 Schedule Order' : '🛍️ Place Order Now'}
        </button>
      </form>

      {/* ── RIGHT: ORDER SUMMARY ─────────────────── */}
      <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Order Summary</h3>
          <hr style={{ borderColor: 'var(--border)', marginBottom: '1rem' }} />

          {cartItems.map(item => (
            <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)', maxWidth: '65%' }}>{item.name} × {item.quantity}</span>
              <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <span>₹{subTotal.toFixed(2)}</span>
          </div>

          {appliedCoupon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34d399' }}>Coupon ({appliedCoupon.code})</span>
              <span style={{ color: '#34d399' }}>-₹{discount.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.5rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--accent-pink)' }}>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Coupon Box */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <Tag size={16} color="var(--accent-purple)" /> Promo Code
          </h4>
          {appliedCoupon ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10 }}>
              <Check size={16} color="#34d399" />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>{appliedCoupon.code} applied!</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{appliedCoupon.discountPercent}% discount</div>
              </div>
              <button onClick={removeCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 4 }}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="neo-input"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              />
              <button
                type="button"
                className="neo-button"
                onClick={handleApplyCoupon}
                disabled={couponLoading}
                style={{ padding: '0.7rem 1rem', whiteSpace: 'nowrap' }}
              >
                {couponLoading ? '…' : 'Apply'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;