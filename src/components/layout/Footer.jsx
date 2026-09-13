import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { BRAND_INFO } from '../../data/initialProducts';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function Footer({ onNavigateSection }) {
  const navigate = useNavigate();
  const { categories, setActiveCategory, showToast, openQuoteModal } = useShop();
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigate('/shop');
    if (onNavigateSection) onNavigateSection('catalog');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Please enter a valid email address.', 'info');
      return;
    }
    setIsSubscribed(true);
    showToast('Thank you for subscribing to Festa Munich updates.');
    setEmailInput('');
  };

  return (
    <footer style={{ backgroundColor: '#000000', color: '#ffffff', borderTop: '1px solid #222222', paddingTop: '5rem' }}>
      <div className="container-zegna">
        
        {/* Main Footer Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3.5rem', paddingBottom: '4.5rem' }}>
          
          {/* Column 1: Brand */}
          <div>
            <span className="zegna-logo" style={{ color: '#ffffff', fontSize: '1.8rem', display: 'block', marginBottom: '1.2rem' }}>
              FESTA MUNICH
            </span>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#aaaaaa', marginBottom: '1.5rem' }}>
              Supreme mastery in bespoke leather outerwear, wholesale manufacturing, and luxury private label tailoring.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: '#cccccc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="#ffffff" />
                <span>{BRAND_INFO.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="#ffffff" />
                <span>{BRAND_INFO.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="#ffffff" />
                <span>{BRAND_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', fontWeight: '700', marginBottom: '1.2rem' }}>
              COLLECTIONS
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.86rem' }}>
              {categories.map((cat) => (
                <li key={cat.id || cat.name}>
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#aaaaaa',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Client Services */}
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', fontWeight: '700', marginBottom: '1.2rem' }}>
              CLIENT SERVICES
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.86rem' }}>
              <li>
                <button
                  onClick={() => openQuoteModal ? openQuoteModal() : window.open(BRAND_INFO.whatsappLink, '_blank')}
                  style={{ background: 'none', border: 'none', color: '#aaaaaa', cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}
                >
                  Request Wholesale Quotation (RFQ)
                </button>
              </li>
              <li>
                <a 
                  href={BRAND_INFO.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#aaaaaa', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}
                >
                  Made-to-Measure Booking
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('/account')}
                  style={{ background: 'none', border: 'none', color: '#aaaaaa', cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}
                >
                  My Account
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', fontWeight: '700', marginBottom: '1.2rem' }}>
              NEWSLETTER
            </div>
            <p style={{ fontSize: '0.84rem', color: '#aaaaaa', marginBottom: '1rem', lineHeight: 1.5 }}>
              Sign up for private updates on new bespoke garment releases.
            </p>

            {isSubscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#81c784', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} />
                <span>Thank you for subscribing.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{
                    backgroundColor: '#181818',
                    border: '1px solid #333333',
                    color: '#ffffff',
                    padding: '0.8rem 1rem',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                  required
                />
                <button type="submit" className="btn-zegna-white" style={{ padding: '0.8rem', fontSize: '0.76rem' }}>
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Social Media Row */}
        <div style={{ borderTop: '1px solid #222', paddingTop: '2rem', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Follow Our Atelier
          </div>
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            {/* Instagram */}
            <a href="https://www.instagram.com/festamunich" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/festamunich" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/923277551063" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#25D366'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><path d="M16.002 3.2C9.008 3.2 3.2 8.992 3.2 16c0 2.256.592 4.384 1.632 6.224L3.2 28.8l6.736-1.6A12.72 12.72 0 0 0 16.002 28.8C23.008 28.8 28.8 23.008 28.8 16c0-7.008-5.792-12.8-12.798-12.8Zm6.032 15.008c-.336-.16-1.936-.944-2.24-1.056-.304-.112-.512-.16-.72.16-.208.32-.816 1.056-.992 1.264-.192.208-.368.224-.688.064-.32-.16-1.36-.496-2.592-1.584-.96-.848-1.6-1.888-1.792-2.208-.192-.32-.016-.496.144-.656.144-.144.32-.368.48-.56.16-.192.208-.32.32-.544.112-.208.048-.4-.016-.56-.064-.16-.72-1.728-.976-2.368-.256-.624-.512-.528-.72-.544-.192-.016-.4-.016-.608-.016-.208 0-.544.08-.832.384-.288.32-1.088 1.056-1.088 2.576s1.12 2.992 1.28 3.2c.16.208 2.192 3.36 5.312 4.72.752.32 1.344.512 1.792.656.752.24 1.44.208 1.984.128.608-.096 1.92-.784 2.192-1.536.272-.752.272-1.392.192-1.536-.08-.16-.288-.24-.608-.4Z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/festamunich" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0A66C2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div style={{ borderTop: '1px solid #222222', padding: '1.5rem 0', fontSize: '0.75rem', color: '#777777', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            © {new Date().getFullYear()} FESTA MUNICH — Sialkot, Pakistan. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ color: '#555' }}>Privacy Policy</span>
            <span style={{ color: '#555' }}>Terms &amp; Conditions</span>
            <span style={{ color: '#555' }}>Wholesale Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
