// import React, { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';
// const { login, user } = useContext(AuthContext);

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     const success = await login(email, password);
//     // if (success) {
//     //   navigate('/');
//     // }
//   if (success) {
//   if (user.role === 'ADMIN') {
//     navigate('/admin');
//   } else {
//     navigate('/');
//   }
// }
//   };

//   return (
//     <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
//       <form onSubmit={submitHandler} className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
//         <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>Welcome Back</h2>
        
//         <div className="mb-4">
//           <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
//           <input 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             className="neo-input" 
//             required 
//           />
//         </div>

//         <div className="mb-4">
//           <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
//           <input 
//             type="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             className="neo-input" 
//             required 
//           />
//         </div>

//         <button type="submit" className="neo-button" style={{ width: '100%', marginTop: '1rem' }}>
//           Sign In
//         </button>

//         <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
//           New Customer? <Link to="/register" style={{ color: 'var(--accent-blue)' }}>Register Here</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;



import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(AuthContext); // ✅ only login here
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const success = await login(email, password);

    if (success) {
      // ✅ get updated user directly from localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (userInfo?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <form onSubmit={submitHandler} className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>
          Welcome Back
        </h2>
        
        <div className="mb-4">
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Email Address
          </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="neo-input" 
            required 
          />
        </div>

        <div className="mb-4">
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Password
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="neo-input" 
            required 
          />
        </div>

        <button type="submit" className="neo-button" style={{ width: '100%', marginTop: '1rem' }}>
          Sign In
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          New Customer? <Link to="/register" style={{ color: 'var(--accent-blue)' }}>Register Here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;