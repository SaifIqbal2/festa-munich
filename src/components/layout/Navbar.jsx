import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { BRAND_INFO } from '../../data/initialProducts';
import { Search, ShoppingBag, Heart, Menu, X, Mail, User } from 'lucide-react';

export default function Navbar({ onNavigateSection }) {
  const navigate = useNavigate();
const {
    cartItemCount,
    wishlist,
    setIsCartOpen,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setIsOrderTrackingOpen,
    currentUser,
    setIsAdminOpen,
    categories
  } = useShop();

  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategorySelect = (cat, destination = '/shop') => {
    setActiveCategory(cat);
    setActiveMegaMenu(null);
    setIsMobileMenuOpen(false);
    navigate(destination);
    if (onNavigateSection) {
      onNavigateSection('catalog');
    }
  };

  const handleNavigateStory = () => {
    setActiveMegaMenu(null);
    navigate('/our-world');
    if (onNavigateSection) onNavigateSection('craftsmanship');
  };

  return (
    <header 
      className="zegna-nav-header"
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <div className="zegna-nav-container">
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <div 
            onClick={() => { setActiveCategory('All Garments'); navigate('/'); }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <span className="zegna-logo">
              FESTA MUNICH
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button
              onClick={() => handleCategorySelect('All Garments', '/shop')}
              className="zegna-nav-link"
              style={{ fontWeight: activeCategory === 'All Garments' ? '600' : '400' }}
            >
              New In
            </button>

            <button
              onMouseEnter={() => setActiveMegaMenu('ready-to-wear')}
              onClick={() => handleCategorySelect('All Garments', '/shop')}
              className="zegna-nav-link"
            >
              Ready to Wear
            </button>

            {categories.slice(0, 4).map((category) => (
              <button
                key={category.id || category.name}
                onClick={() => handleCategorySelect(category.name, '/shop')}
                className="zegna-nav-link"
                style={{ fontWeight: activeCategory === category.name ? '600' : '400' }}
              >
                {category.name}
              </button>
            ))}

            <button
              onMouseEnter={() => setActiveMegaMenu('our-world')}
              onClick={handleNavigateStory}
              className="zegna-nav-link"
            >
              Our World
            </button>
          </nav>
        </div>

        {/* Right Side: Icons (Search, Mail, Account, Bag) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
          
          {/* Search */}
          <div style={{ position: 'relative' }}>
            {isSearchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #000', paddingBottom: '0.2rem' }}>
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    navigate('/shop');
                    if (onNavigateSection) onNavigateSection('catalog');
                  }}
                  autoFocus
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.88rem',
                    width: '160px',
                    fontFamily: 'var(--font-sans)'
                  }}
                />
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', display: 'flex' }}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Contact / WhatsApp Concierge Icon */}
          <a
            href={BRAND_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#000', textDecoration: 'none', display: 'flex' }}
            title="Atelier Concierge WhatsApp"
          >
            <Mail size={20} />
          </a>

          {/* User / Order Tracking Icon */}
          <button
            onClick={() => {
              if (currentUser && currentUser.isAdmin) {
                setIsAdminOpen(true);
                return;
              }
              navigate(currentUser ? '/account' : '/login');
            }}
            style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', display: 'flex' }}
            title={currentUser ? (currentUser.isAdmin ? 'Admin Panel' : 'My Account') : 'Login / Register'}
          >
            <User size={20} />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigate('/wishlist')}
            style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', position: 'relative', display: 'flex' }}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  background: '#000000',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Icon with Count */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', position: 'relative', display: 'flex' }}
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  background: '#000000',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn-mobile-only"
            style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', display: 'none' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </div>

      {/* ZEGNA-STYLE MEGA MENU 1: READY TO WEAR */}
      {activeMegaMenu === 'ready-to-wear' && (
        <div className="zegna-mega-menu">
          <div className="zegna-mega-container">
            
            {/* Column 1 */}
            <div>
              <div className="mega-column-title">CATEGORIES</div>
              <ul className="mega-column-links">
                {categories.map((category) => (
                  <li key={category.id || category.name}>
                    <button onClick={() => handleCategorySelect(category.name)}>{category.name}</button>
                  </li>
                ))}
                <li><button onClick={() => handleCategorySelect('All Garments')}>View All Garments</button></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <div className="mega-column-title">FEATURED HIGHLIGHTS</div>
              <ul className="mega-column-links">
                <li><button onClick={() => handleCategorySelect('Leather Jackets')}>Full-Grain Biker Jacket</button></li>
                <li><button onClick={() => handleCategorySelect('Textile Outerwear')}>Oasi Cashmere Overcoat</button></li>
                <li><button onClick={() => handleCategorySelect('Leather Jackets')}>Tuscan Suede Aviator</button></li>
                <li><button onClick={() => handleCategorySelect('Tailoring & Blazers')}>Neapolitan Silk-Wool Blazer</button></li>
              </ul>
            </div>

            {/* Column 3: Featured Visual Story Card */}
            <div 
              style={{
                position: 'relative',
                height: '240px',
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%), url('https://images.unsplash.com/photo-1539533018447-63fcce667883?q=80&w=900&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem'
              }}
            >
              <div style={{ color: '#ffffff', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                AUTUMN / WINTER CAPSULE
              </div>
              <h3 style={{ color: '#ffffff', fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: '400', marginBottom: '1rem' }}>
                THE CASHMERE & LEATHER CLOSET
              </h3>
              <div>
                <button
                  onClick={() => handleCategorySelect('All Garments')}
                  className="btn-zegna-white"
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.74rem' }}
                >
                  Discover More
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ZEGNA-STYLE MEGA MENU 2: OUR WORLD */}
      {activeMegaMenu === 'our-world' && (
        <div className="zegna-mega-menu">
          <div className="zegna-mega-container">
            
            {/* Column 1 */}
            <div>
              <div className="mega-column-title">HERITAGE & VALUES</div>
              <ul className="mega-column-links">
                <li><button onClick={() => { setActiveMegaMenu(null); navigate('/our-world'); if (onNavigateSection) onNavigateSection('craftsmanship'); }}>Discover Our Atelier</button></li>
                <li><button onClick={() => { setActiveMegaMenu(null); navigate('/our-world'); if (onNavigateSection) onNavigateSection('craftsmanship'); }}>Our Sialkot Master Craftsmen</button></li>
                <li><button onClick={() => { setActiveMegaMenu(null); navigate('/our-world'); if (onNavigateSection) onNavigateSection('craftsmanship'); }}>Material Traceability</button></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <div className="mega-column-title">BESPOKE SERVICES</div>
              <ul className="mega-column-links">
                <li>
                  <a href={BRAND_INFO.whatsappLink} target="_blank" rel="noopener noreferrer">
                    Made-to-Measure Consultation
                  </a>
                </li>
                <li>
                  <a href={BRAND_INFO.whatsappLink} target="_blank" rel="noopener noreferrer">
                    Custom Leather Patina Fitting
                  </a>
                </li>
                <li>
                  <a href={BRAND_INFO.whatsappLink} target="_blank" rel="noopener noreferrer">
                    Atelier Virtual Measurement
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Featured Visual Story Card */}
            <div 
              style={{
                position: 'relative',
                height: '240px',
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%), url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem'
              }}
            >
              <div style={{ color: '#ffffff', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                CENTURY OF LEATHER ARTISTRY
              </div>
              <h3 style={{ color: '#ffffff', fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: '400', marginBottom: '1rem' }}>
                OUR ATELIER HERITAGE
              </h3>
              <div>
                <button
                  onClick={() => { setActiveMegaMenu(null); navigate('/our-world'); if (onNavigateSection) onNavigateSection('craftsmanship'); }}
                  className="btn-zegna-white"
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.74rem' }}
                >
                  Discover More
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <span className="zegna-logo" style={{ fontSize: '1.6rem' }}>FESTA MUNICH</span>
            <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={26} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button
              onClick={() => handleCategorySelect('All Garments')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                fontFamily: 'var(--font-sans)',
                textAlign: 'left',
                cursor: 'pointer',
                fontWeight: activeCategory === 'All Garments' ? '700' : '400',
                color: '#000'
              }}
            >
              All Garments
            </button>
            {categories.map((category) => (
              <button
                key={category.id || category.name}
                onClick={() => handleCategorySelect(category.name)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-sans)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeCategory === category.name ? '700' : '400',
                  color: '#000'
                }}
              >
                {category.name}
              </button>
            ))}

            <div style={{ height: '1px', background: '#e5e5e5', margin: '1rem 0' }} />

            <button
              onClick={() => { setIsMobileMenuOpen(false); setIsOrderTrackingOpen(true); }}
              style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem', cursor: 'pointer' }}
            >
              Track Atelier Order
            </button>

            <a
              href={BRAND_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#000', fontSize: '1rem' }}
            >
              WhatsApp Concierge ({BRAND_INFO.phone})
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .btn-mobile-only {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
