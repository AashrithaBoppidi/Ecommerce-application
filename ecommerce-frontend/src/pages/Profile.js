import React, { useState, useContext, useEffect } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Copy, Check, User, Mail, Phone, MapPin, ShieldCheck, Edit3 } from 'lucide-react';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', password: '' });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/auth/profile');
      setProfile(data);
      setForm({ name: data.name, phone: data.phone || '', address: data.address || '', password: '' });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/auth/profile', form);
      setProfile(prev => ({ ...prev, ...data }));
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const copyShareId = () => {
    if (!profile?.shareId) return;
    navigator.clipboard.writeText(profile.shareId);
    setCopied(true);
    toast.success('Share ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>Loading profile…</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Outfit' }}>My Profile</h2>

      {/* ── Profile Card ─────────────────────────── */}
      {!editing ? (
        <div className="glass-card" style={{ padding: '2rem' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--gradient-neon)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit',
              flexShrink: 0,
            }}>
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{profile?.name}</h3>
              <span style={{
                fontSize: '0.78rem', padding: '0.2rem 0.7rem', borderRadius: 20, fontWeight: 700,
                background: profile?.role === 'ADMIN' ? 'rgba(236,72,153,0.2)' : 'rgba(59,130,246,0.2)',
                color: profile?.role === 'ADMIN' ? '#f472b6' : '#60a5fa',
              }}>
                {profile?.role}
              </span>
            </div>
          </div>

          {/* Share ID — highlight */}
          {profile?.shareId && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  🔗 Your Group Cart Share ID
                </div>
                <code style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a78bfa', letterSpacing: '0.15em' }}>
                  {profile.shareId}
                </code>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Share this ID to invite friends to your Group Cart
                </div>
              </div>
              <button
                onClick={copyShareId}
                style={{
                  background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.2)',
                  border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : 'rgba(139,92,246,0.4)'}`,
                  color: copied ? '#34d399' : '#a78bfa',
                  borderRadius: 10, padding: '0.6rem 0.9rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem',
                  transition: 'all 0.2s', flexShrink: 0,
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}

          {/* Info rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              { icon: <Mail size={16} />, label: 'Email', value: profile?.email },
              { icon: <Phone size={16} />, label: 'Phone', value: profile?.phone || 'Not set' },
              { icon: <MapPin size={16} />, label: 'Address', value: profile?.address || 'Not set' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>{row.icon}</span>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</div>
                  <div style={{ fontSize: '0.92rem' }}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="neo-button"
            style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={() => setEditing(true)}
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>
      ) : (
        /* ── Edit Form ───────────────────────────── */
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Edit Profile</h3>
          <form onSubmit={handleSave}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
              { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
              { label: 'Address', key: 'address', type: 'text', placeholder: 'Your address' },
              { label: 'New Password (leave blank to keep)', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key} className="mb-4">
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="neo-input"
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="neo-button" style={{ flex: 1 }}>Save Changes</button>
              <button type="button" className="neo-button-subtle" onClick={() => setEditing(false)} style={{ flex: 1 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;