// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css';
// import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <CartProvider>
//           <App />
//           <ToastContainer position="bottom-right" theme="dark" toastClassName="glass-card" />
//         </CartProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>

    {/* ✅ MUST be OUTSIDE providers */}
    <ToastContainer
      position="bottom-right"
      theme="dark"
      toastClassName="glass-card"
    />
  </React.StrictMode>
);