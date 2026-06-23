import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const AdminMenu = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', padding: '1rem', alignItems: 'center', gap: '1rem' }}>
      <button 
        onClick={handleHomeClick} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Go to Home"
      >
        <Home size={28} color="var(--text-primary, #333)" />
      </button>
      <span style={{ fontWeight: 'bold' }}>Admin Menu</span>
    </div>
  );
};

export default AdminMenu;
