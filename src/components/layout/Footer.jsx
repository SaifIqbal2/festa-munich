import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { BRAND_INFO, CATEGORIES } from '../../data/initialProducts';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function Footer({ onNavigateSection }) {
  const navigate = useNavigate();
  const { setActiveCategory, showToast, setIsOrderTrackingOpen } = useShop();
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
              Supreme mastery in bespoke leather outerwear and luxury textile tailoring.
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
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
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
                    {cat}
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
                  onClick={() => setIsOrderTrackingOpen(true)}
                  style={{ background: 'none', border: 'none', color: '#aaaaaa', cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}
                >
                  Track Atelier Order
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

        {/* Bottom Sub-bar */}
        <div style={{ borderTop: '1px solid #222222', padding: '1.8rem 0', fontSize: '0.75rem', color: '#777777', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            © {new Date().getFullYear()} FESTA MUNICH (festamunich.com). All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Privacy Policy</button>
            <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Terms & Conditions</button>
            <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Shipping Policy</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
