import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { MapPin, CreditCard, Package, Check, Truck, Home, Clock } from 'lucide-react';

const STATUS_STEPS = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const getStepIndex = (status) => {
  const map = {
    Scheduled: -1, Pending: 0, Placed: 0, Processing: 1,
    Shipped: 2, 'Out for Delivery': 3, Delivered: 4, Cancelled: -2,
  };
  return map[status] ?? 0;
};

const OrderTimeline = ({ status }) => {
  const currentStep = getStepIndex(status);
  if (status === 'Cancelled') {
    return (
      <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.88rem', fontWeight: 600 }}>
        ✕ Order Cancelled
      </div>
    );
  }
  if (status === 'Scheduled') {
    return (
      <div style={{ padding: '1rem', background: 'rgba(139,92,246,0.1)', borderRadius: 10, border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', fontSize: '0.88rem', fontWeight: 600 }}>
        🕑 Scheduled — Will be placed on your selected date
      </div>
    );
  }

  const icons = [<Package size={14} />, <Clock size={14} />, <Truck size={14} />, <Truck size={14} />, <Check size={14} />];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: '0.75rem', position: 'relative' }}>
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentStep;
        const active = i === currentStep;
        return (
          <React.Fragment key={step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', zIndex: 1, flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: done ? 'var(--gradient-neon)' : 'rgba(255,255,255,0.07)',
                border: `2px solid ${done ? 'transparent' : 'rgba(255,255,255,0.15)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done ? '#fff' : '#475569',
                boxShadow: active ? '0 0 12px rgba(139,92,246,0.6)' : 'none',
                transition: 'all 0.3s',
              }}>
                {icons[i]}
              </div>
              <span style={{ fontSize: '0.62rem', color: done ? 'var(--accent-purple)' : 'var(--text-secondary)', textAlign: 'center', maxWidth: 60, lineHeight: 1.2, fontWeight: done ? 600 : 400 }}>
                {step}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginBottom: 18,
                background: i < currentStep ? 'var(--gradient-neon)' : 'rgba(255,255,255,0.08)',
                transition: 'background 0.5s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [newState, setNewState] = useState('');
  const [newPayment, setNewPayment] = useState('Credit Card');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data);
    } catch {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = (order) => {
    const diffDays = (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24);
    return diffDays <= 3 && !['Shipped', 'Delivered', 'Cancelled'].includes(order.status);
  };

  const updateAddress = async () => {
    try {
      await API.put(`/orders/${selectedOrder._id}/address`, { address: newAddress, state: newState });
      toast.success('Address updated');
      setShowAddressModal(false);
      fetchOrders();
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
  };

  const updatePayment = async () => {
    try {
      await API.put(`/orders/${selectedOrder._id}/payment`, { paymentMethod: newPayment });
      toast.success('Payment updated');
      setShowPaymentModal(false);
      fetchOrders();
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
  };

  const statusColors = {
    Delivered: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
    Shipped: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
    Placed: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    Pending: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    Scheduled: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
    Cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>Loading orders…</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>My Orders</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      {orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Package size={52} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map(order => {
            const sc = statusColors[order.status] || statusColors['Placed'];
            const isExpanded = expandedOrder === order._id;
            return (
              <div key={order._id} className="glass-card" style={{ overflow: 'hidden', transition: 'all 0.3s' }}>
                {/* Order Header */}
                <div
                  style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', cursor: 'pointer' }}
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontFamily: 'monospace' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-pink)' }}>
                      ₹{Number(order.totalPrice).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Placed {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, background: sc.bg, color: sc.color }}>
                      {order.status}
                    </span>
                    {order.deliveryDate && (
                      <div style={{ textAlign: 'right', fontSize: '0.82rem' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Delivery by</div>
                        <div style={{ color: '#10b981', fontWeight: 600 }}>{new Date(order.deliveryDate).toLocaleDateString()}</div>
                      </div>
                    )}
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Order Timeline */}
                <div style={{ padding: '0 1.5rem 1rem', borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: '1rem' }}>
                  <OrderTimeline status={order.status} />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem' }}>
                    {/* Items */}
                    <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Items Ordered</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      {order.orderItems?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.qty}</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      {/* Address */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          <MapPin size={16} color="var(--accent-blue)" /> Shipping Address
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                          {order.shippingAddress?.address}, {order.shippingAddress?.city}<br/>
                          {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                        </p>
                        {canEdit(order) && (
                          <button
                            className="neo-button-subtle"
                            style={{ marginTop: '0.75rem', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                            onClick={() => { setSelectedOrder(order); setNewAddress(order.shippingAddress.address); setNewState(order.shippingAddress.state); setShowAddressModal(true); }}
                          >
                            Change Address
                          </button>
                        )}
                      </div>

                      {/* Payment */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          <CreditCard size={16} color="var(--accent-purple)" /> Payment
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                          {order.paymentMethod}
                          <span style={{ marginLeft: '0.5rem', padding: '0.15rem 0.5rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600, background: order.isPaid ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: order.isPaid ? '#34d399' : '#fbbf24' }}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </p>
                        {canEdit(order) && (
                          <button
                            className="neo-button-subtle"
                            style={{ marginTop: '0.75rem', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                            onClick={() => { setSelectedOrder(order); setNewPayment(order.paymentMethod); setShowPaymentModal(true); }}
                          >
                            Change Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: 420 }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Change Shipping Address</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Address changes are allowed within 3 days of ordering and before shipment.
            </p>
            <div className="mb-4">
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Street Address</label>
              <input value={newAddress} onChange={e => setNewAddress(e.target.value)} className="neo-input" />
            </div>
            <div className="mb-4">
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>State</label>
              <input value={newState} onChange={e => setNewState(e.target.value)} className="neo-input" />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="neo-button" onClick={updateAddress} style={{ flex: 1 }}>Save Changes</button>
              <button className="neo-button-subtle" onClick={() => setShowAddressModal(false)} style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: 400 }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Change Payment Method</h3>
            <select value={newPayment} onChange={e => setNewPayment(e.target.value)} className="neo-input mb-4">
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>PayPal</option>
              <option>UPI</option>
              <option>Net Banking</option>
              <option>Cash on Delivery</option>
            </select>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="neo-button" onClick={updatePayment} style={{ flex: 1 }}>Save</button>
              <button className="neo-button-subtle" onClick={() => setShowPaymentModal(false)} style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;