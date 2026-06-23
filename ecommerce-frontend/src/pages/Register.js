import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <form onSubmit={submitHandler} className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>Create Account</h2>
        
        <div className="mb-4">
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="neo-input" 
            required 
          />
        </div>

        <div className="mb-4">
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="neo-input" 
            required 
          />
        </div>

        <div className="mb-4">
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="neo-input" 
            required 
          />
        </div>

        <button type="submit" className="neo-button" style={{ width: '100%', marginTop: '1rem' }}>
          Register
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)' }}>Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;