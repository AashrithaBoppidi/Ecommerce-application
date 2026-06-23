import React, { useEffect, useState, useContext, useRef } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  BarChart3, Users, Package, ShoppingCart, Plus, Trash2, Edit3,
  X, Check, Tag, TrendingUp, Star, AlertTriangle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
const TABS = ['Dashboard', 'Products', 'Orders', 'Users', 'Coupons', 'Analytics'];

const emptyProduct = {
  name: '', description: '', price: '', category: '',
  brand: '', stock: '', discount: '', tags: '', isFeatured: false,
};

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Product form state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef();

  // Coupon form state
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '', expiryDate: '', maxUses: 100 });

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchAll();
    else setLoading(false);
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsR, ordersR, usersR, productsR, couponsR, analyticsR] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/orders/all'),
        API.get('/admin/users'),
        API.get('/products'),
        API.get('/admin/coupons'),
        API.get('/admin/analytics'),
      ]);
      setStats(statsR.data);
      setOrders(ordersR.data);
      setUsers(usersR.data);
      setProducts(productsR.data);
      setCoupons(couponsR.data);
      setAnalytics(analyticsR.data);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // ── ORDER STATUS ────────────────────────────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update status');
    }
  };

  // ── PRODUCT CRUD ────────────────────────────────────────
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setImageFile(null);
    setImagePreview('');
    setShowProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name, description: p.description, price: p.price,
      category: p.category, brand: p.brand || '', stock: p.stock,
      discount: p.discount || '', tags: (p.tags || []).join(', '), isFeatured: p.isFeatured || false,
    });
    setImagePreview(p.image?.startsWith('/uploads') ? `http://localhost:5000${p.image}` : p.image || '');
    setImageFile(null);
    setShowProductModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(productForm).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      // If editing and no new file, send existing image URL
      if (!imageFile && editingProduct) fd.append('image', editingProduct.image);

      if (editingProduct) {
        await API.put(`/admin/products/${editingProduct._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated!');
      } else {
        await API.post('/admin/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product added!');
      }
      setShowProductModal(false);
      fetchAll();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete');
    }
  };

  // ── COUPONS ─────────────────────────────────────────────
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/admin/coupons', couponForm);
      setCoupons(prev => [data, ...prev]);
      setCouponForm({ code: '', discountPercent: '', expiryDate: '', maxUses: 100 });
      toast.success('Coupon created!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await API.delete(`/admin/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c._id !== id));
      toast.success('Coupon deleted');
    } catch (e) {
      toast.error('Failed to delete coupon');
    }
  };

  // ── GUARDS ──────────────────────────────────────────────
  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>🚫 Not Authorized as Admin</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }} />
        Loading Admin Dashboard…
      </div>
    );
  }

  const statusBadge = (s) => {
    const colors = {
      Delivered: { bg: 'rgba(16,185,129,0.2)', color: '#34d399' },
      Shipped: { bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
      Placed: { bg: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
      Pending: { bg: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
      Scheduled: { bg: 'rgba(99,102,241,0.2)', color: '#818cf8' },
      Cancelled: { bg: 'rgba(239,68,68,0.2)', color: '#f87171' },
    };
    const c = colors[s] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
    return (
      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', background: c.bg, color: c.color, fontWeight: 600 }}>
        {s}
      </span>
    );
  };

  const stockBadge = (stock) => {
    if (stock === 0) return <span style={{ color: '#f87171', fontSize: '0.75rem', fontWeight: 600 }}>● Out of Stock</span>;
    if (stock <= 5) return <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600 }}>● Low Stock ({stock})</span>;
    return <span style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>● In Stock ({stock})</span>;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(139,92,246,0.2)' }}>
          <ShieldAdmin size={28} color="var(--accent-purple)" />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit' }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Welcome back, {user.name} · Manage your store
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '24px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              background: activeTab === tab ? 'var(--gradient-neon)' : 'rgba(255,255,255,0.06)',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeTab === tab ? '0 4px 15px rgba(139,92,246,0.4)' : 'none',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ══════════════ DASHBOARD TAB ══════════════ */}
      {activeTab === 'Dashboard' && (
        <>
          <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
            {[
              { label: 'Total Users', value: stats?.usersCount, icon: <Users size={28} />, color: 'var(--accent-blue)' },
              { label: 'Total Products', value: stats?.productsCount, icon: <Package size={28} />, color: 'var(--accent-purple)' },
              { label: 'Total Orders', value: stats?.ordersCount, icon: <ShoppingCart size={28} />, color: 'var(--accent-pink)' },
              { label: 'Revenue', value: `₹${Number(stats?.totalRevenue || 0).toFixed(0)}`, icon: <TrendingUp size={28} />, color: '#10b981' },
            ].map(s => (
              <div
                key={s.label}
                className="glass-card"
                style={{ flex: '1 1 200px', padding: '1.5rem', borderLeft: `4px solid ${s.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{s.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value ?? '—'}</div>
                </div>
                <div style={{ opacity: 0.6, color: s.color }}>{s.icon}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="neo-button" onClick={() => { setActiveTab('Products'); openAddProduct(); }} style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <Plus size={16} /> Add Product
              </button>
              <button className="neo-button-subtle" onClick={() => setActiveTab('Orders')} style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <ShoppingCart size={16} /> Manage Orders
              </button>
              <button className="neo-button-subtle" onClick={() => setActiveTab('Coupons')} style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <Tag size={16} /> Create Coupon
              </button>
              <button className="neo-button-subtle" onClick={() => setActiveTab('Analytics')} style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <BarChart3 size={16} /> View Analytics
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Orders</h3>
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                  {['User', 'Date', 'Total', 'Status'].map(h => (
                    <th key={h} style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.8rem 1rem' }}>{order.user?.name || 'Unknown'}</td>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--accent-pink)', fontWeight: 700 }}>₹{Number(order.totalPrice).toFixed(2)}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>{statusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ══════════════ PRODUCTS TAB ══════════════ */}
      {activeTab === 'Products' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem' }}>Products ({products.length})</h3>
            <button className="neo-button" onClick={openAddProduct} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Product
            </button>
          </div>

          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                  {['Image', 'Name', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <img
                        src={p.image?.startsWith('/uploads') ? `http://localhost:5000${p.image}` : p.image}
                        alt={p.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                        onError={e => { e.target.src = 'https://via.placeholder.com/50'; }}
                      />
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 600, maxWidth: 180 }}>
                      {p.name}
                      {p.isFeatured && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#f59e0b' }}>★ Featured</span>}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}>{p.category}</td>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--accent-pink)', fontWeight: 700 }}>₹{p.price}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>{stockBadge(p.stock)}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#fbbf24' }}>
                      {'★'.repeat(Math.round(p.rating || 0))} <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({p.numReviews || 0})</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditProduct(p)}
                          style={{ background: 'rgba(59,130,246,0.2)', border: 'none', color: '#60a5fa', borderRadius: 8, padding: '0.4rem 0.7rem', cursor: 'pointer' }}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#f87171', borderRadius: 8, padding: '0.4rem 0.7rem', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No products yet. Click "Add Product" to get started.
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════════ ORDERS TAB ══════════════ */}
      {activeTab === 'Orders' && (
        <>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Orders Management ({orders.length})</h3>
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                  {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Update'].map(h => (
                    <th key={h} style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>{order.user?.name || 'Unknown'}</div>
                      <small style={{ color: 'var(--text-secondary)' }}>{order.user?.email}</small>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--accent-pink)', fontWeight: 700 }}>
                      ₹{Number(order.totalPrice).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>{statusBadge(order.status)}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <select
                        className="neo-input"
                        style={{ padding: '0.4rem 0.5rem', width: 'auto', fontSize: '0.82rem' }}
                        value={order.status}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                      >
                        {['Scheduled', 'Pending', 'Placed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ══════════════ USERS TAB ══════════════ */}
      {activeTab === 'Users' && (
        <>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Registered Users ({users.length})</h3>
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Email', 'Share ID', 'Role', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <code style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.8rem' }}>
                        {u.shareId || '—'}
                      </code>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.7rem', borderRadius: '12px', fontSize: '0.78rem',
                        background: u.role === 'ADMIN' ? 'rgba(236,72,153,0.2)' : 'rgba(59,130,246,0.2)',
                        color: u.role === 'ADMIN' ? '#f472b6' : '#60a5fa',
                        fontWeight: 600,
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ══════════════ COUPONS TAB ══════════════ */}
      {activeTab === 'Coupons' && (
        <>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Coupon Management</h3>

          {/* Create Coupon Form */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Create New Coupon</h4>
            <form onSubmit={handleAddCoupon} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Coupon Code</label>
                <input className="neo-input" placeholder="SAVE20" value={couponForm.code}
                  onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Discount %</label>
                <input className="neo-input" type="number" min="1" max="100" placeholder="20" value={couponForm.discountPercent}
                  onChange={e => setCouponForm(p => ({ ...p, discountPercent: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Expiry Date</label>
                <input className="neo-input" type="date" value={couponForm.expiryDate}
                  onChange={e => setCouponForm(p => ({ ...p, expiryDate: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Max Uses</label>
                <input className="neo-input" type="number" min="1" value={couponForm.maxUses}
                  onChange={e => setCouponForm(p => ({ ...p, maxUses: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="neo-button" style={{ width: '100%', gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={16} /> Create
                </button>
              </div>
            </form>
          </div>

          {/* Coupons Table */}
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                  {['Code', 'Discount', 'Expiry', 'Uses', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => {
                  const expired = new Date() > new Date(c.expiryDate);
                  const exhausted = c.usedCount >= c.maxUses;
                  return (
                    <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <code style={{ color: 'var(--accent-purple)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em' }}>{c.code}</code>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#34d399', fontWeight: 700 }}>{c.discountPercent}% OFF</td>
                      <td style={{ padding: '0.8rem 1rem', color: expired ? '#f87171' : 'var(--text-secondary)' }}>
                        {new Date(c.expiryDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}>{c.usedCount}/{c.maxUses}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        {expired ? <span style={{ color: '#f87171', fontWeight: 600 }}>Expired</span>
                          : exhausted ? <span style={{ color: '#fbbf24', fontWeight: 600 }}>Exhausted</span>
                            : <span style={{ color: '#34d399', fontWeight: 600 }}>Active</span>}
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <button onClick={() => handleDeleteCoupon(c._id)} style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', borderRadius: 8, padding: '0.4rem 0.7rem', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {coupons.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No coupons yet.</div>
            )}
          </div>
        </>
      )}

      {/* ══════════════ ANALYTICS TAB ══════════════ */}
      {activeTab === 'Analytics' && analytics && (
        <>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Analytics Overview</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '1.5rem' }}>
            {/* Revenue Chart */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Revenue by Month</h4>
              {analytics.revenueByMonth.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Bar dataKey="revenue" fill="url(#revenueGrad)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}>Not enough data yet</div>}
            </div>

            {/* Orders by Status Pie */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Orders by Status</h4>
              {analytics.ordersByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={analytics.ordersByStatus.map(d => ({ name: d._id, value: d.count }))}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {analytics.ordersByStatus.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}>Not enough data yet</div>}
            </div>

            {/* New Users Line Chart */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>New Users per Month</h4>
              {analytics.usersByMonth.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={analytics.usersByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}>Not enough data yet</div>}
            </div>

            {/* Top Products */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Top Selling Products</h4>
              {analytics.topProducts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analytics.topProducts.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.2rem' }}>{p._id}</div>
                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(p.totalSold / (analytics.topProducts[0]?.totalSold || 1)) * 100}%`, background: COLORS[i], borderRadius: 3 }} />
                        </div>
                      </div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', flexShrink: 0 }}>{p.totalSold} sold</span>
                    </div>
                  ))}
                </div>
              ) : <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}>Not enough data yet</div>}
            </div>
          </div>
        </>
      )}

      {/* ══════════════ PRODUCT MODAL ══════════════ */}
      {showProductModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          backdropFilter: 'blur(4px)',
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
            <button
              onClick={() => setShowProductModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
              {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
            </h3>

            <form onSubmit={handleProductSubmit}>
              {/* Image upload section */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    width: 140, height: 140, borderRadius: 12, border: '2px dashed var(--border)',
                    overflow: 'hidden', cursor: 'pointer', flexShrink: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  {imagePreview
                    ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <Package size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                      <div style={{ fontSize: '0.78rem' }}>Click to upload</div>
                    </div>
                  }
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />

                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Or paste image URL</label>
                  <input
                    className="neo-input"
                    placeholder="https://example.com/image.jpg"
                    value={imagePreview.startsWith('blob:') ? '' : imagePreview}
                    onChange={e => { setImagePreview(e.target.value); setImageFile(null); }}
                  />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                    Upload a file (max 5MB) or paste an external URL
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Product Name', key: 'name', placeholder: 'e.g. Nike Air Max', required: true },
                  { label: 'Category', key: 'category', placeholder: 'e.g. Shoes', required: true },
                  { label: 'Brand', key: 'brand', placeholder: 'e.g. Nike' },
                  { label: 'Price (₹)', key: 'price', placeholder: '999', type: 'number', required: true },
                  { label: 'Stock Quantity', key: 'stock', placeholder: '100', type: 'number', required: true },
                  { label: 'Discount %', key: 'discount', placeholder: '0', type: 'number' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{field.label}</label>
                    <input
                      className="neo-input"
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      value={productForm[field.key]}
                      onChange={e => setProductForm(p => ({ ...p, [field.key]: e.target.value }))}
                      required={field.required}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Description</label>
                <textarea
                  className="neo-input"
                  placeholder="Detailed product description…"
                  value={productForm.description}
                  onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                  required
                  style={{ minHeight: 90, resize: 'vertical' }}
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Tags (comma-separated)</label>
                <input
                  className="neo-input"
                  placeholder="e.g. running, sport, casual"
                  value={productForm.tags}
                  onChange={e => setProductForm(p => ({ ...p, tags: e.target.value }))}
                />
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={productForm.isFeatured}
                  onChange={e => setProductForm(p => ({ ...p, isFeatured: e.target.checked }))}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <label htmlFor="isFeatured" style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  ⭐ Mark as Featured Product (appears highlighted on home page)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="neo-button" style={{ flex: 1, gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={16} /> {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
                <button type="button" className="neo-button-subtle" onClick={() => setShowProductModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// inline SVG shield-check icon fallback
const ShieldAdmin = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

export default Admin;