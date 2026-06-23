// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, Github, MessageCircle, InstagramIcon, Mail } from 'lucide-react';

// const Footer = () => {
//   return (
//     <footer style={{
//       borderTop: '1px solid var(--border)',
//       marginTop: '4rem',
//       padding: '3rem 0 2rem',
//       background: 'rgba(2,6,23,0.6)',
//       backdropFilter: 'blur(10px)',
//     }}>
//       <div className="container">
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
//           {/* Brand */}
//           <div>
//             <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '0.75rem' }}>
//               NEON CART
//             </div>
//             <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
//               The future of shopping is here. Premium products, lightning-fast delivery, seamless experience.
//             </p>
//             <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
//               {[
//                 { icon: <MessageCircle size={16} />, href: '#' },
//                 { icon: <InstagramIcon size={16} />, href: '#' },
//                 { icon: <Github size={16} />, href: '#' },
//                 { icon: <Mail size={16} />, href: '#' },
//               ].map((s, i) => (
//                 <a
//                   key={i}
//                   href={s.href}
//                   style={{
//                     width: 34, height: 34, borderRadius: '50%',
//                     background: 'rgba(255,255,255,0.07)',
//                     border: '1px solid var(--border)',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     color: 'var(--text-secondary)', transition: 'all 0.2s',
//                   }}
//                   onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.color = '#a78bfa'; }}
//                   onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
//                 >
//                   {s.icon}
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Shop */}
//           <div>
//             <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Shop</h4>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
//               {[
//                 { label: 'All Products', to: '/' },
//                 { label: 'Wishlist', to: '/wishlist' },
//                 { label: 'My Cart', to: '/cart' },
//                 { label: 'Group Cart', to: '/group-cart' },
//               ].map(l => (
//                 <Link key={l.label} to={l.to} style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', transition: 'color 0.2s' }}
//                   onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
//                   onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
//                 >
//                   {l.label}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Account */}
//           <div>
//             <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Account</h4>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
//               {[
//                 { label: 'My Profile', to: '/profile' },
//                 { label: 'My Orders', to: '/orders' },
//                 { label: 'Login', to: '/login' },
//                 { label: 'Register', to: '/register' },
//               ].map(l => (
//                 <Link key={l.label} to={l.to} style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', transition: 'color 0.2s' }}
//                   onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
//                   onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
//                 >
//                   {l.label}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Support */}
//           <div>
//             <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Support</h4>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
//               {['Help Center', 'Track Order', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service'].map(l => (
//                 <a key={l} href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', transition: 'color 0.2s' }}
//                   onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
//                   onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
//                 >
//                   {l}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
//           <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
//             © {new Date().getFullYear()} NEON CART. All rights reserved.
//           </p>
//           <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
//             Made with <Heart size={13} fill="#ec4899" color="#ec4899" /> using MERN Stack
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Mail } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      marginTop: '4rem',
      padding: '3rem 0 2rem',
      background: 'rgba(2,6,23,0.6)',
      backdropFilter: 'blur(10px)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>

          {/* Brand */}
          <div>
            <div className="gradient-text" style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'Outfit',
              marginBottom: '0.75rem'
            }}>
              NEON CART
            </div>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              lineHeight: 1.7
            }}>
              The future of shopping is here. Premium products, lightning-fast delivery, seamless experience.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {[
                { icon: <MessageCircle size={16} />, href: '#' },
                { icon: <FaInstagram size={16} />, href: '#' },
                { icon: <Mail size={16} />, href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(139,92,246,0.2)';
                    e.currentTarget.style.color = '#a78bfa';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={titleStyle}>Shop</h4>
            <div style={linkContainer}>
              {[
                { label: 'All Products', to: '/' },
                { label: 'Wishlist', to: '/wishlist' },
                { label: 'My Cart', to: '/cart' },
                { label: 'Group Cart', to: '/group-cart' },
              ].map(l => (
                <Link key={l.label} to={l.to} style={linkStyle}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 style={titleStyle}>Account</h4>
            <div style={linkContainer}>
              {[
                { label: 'My Profile', to: '/profile' },
                { label: 'My Orders', to: '/orders' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map(l => (
                <Link key={l.label} to={l.to} style={linkStyle}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={titleStyle}>Support</h4>
            <div style={linkContainer}>
              {['Help Center', 'Track Order', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service'].map(l => (
                <a key={l} href="#" style={linkStyle}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} NEON CART. All rights reserved.
          </p>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            Made with <Heart size={13} fill="#ec4899" color="#ec4899" /> using MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

// styles
const titleStyle = {
  fontSize: '0.85rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-secondary)',
  marginBottom: '1rem'
};

const linkContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem'
};

const linkStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.88rem',
  textDecoration: 'none',
};

export default Footer;