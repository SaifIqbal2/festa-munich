import React from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/helpers';

export default function IconicCollection({ onExploreCatalog }) {
  const { products, currency, setSelectedProduct, addToCart, setActiveCategory } = useShop();

  const primaryFeature = products[0] || {};
  const secondaryFeature = products[1] || {};

  return (
    <section style={{ backgroundColor: '#ffffff', padding: '0 0 5rem 0' }}>
      <div className="container-zegna">
        
        {/* Full Width Hero Feature Card (Like Zegna Triple Stitch Shoes Banner) */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            marginBottom: '6rem',
            paddingTop: '3rem'
          }}
        >
          {/* Image */}
          <div 
            style={{
              height: '580px',
              backgroundColor: '#f6f6f6',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedProduct(primaryFeature)}
          >
            <img 
              src={primaryFeature.images?.[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop'} 
              alt={primaryFeature.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            />
          </div>

          {/* Text Content */}
          <div style={{ maxWidth: '520px', padding: '0 1rem' }}>
            <div style={{ fontSize: '0.74rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', marginBottom: '0.8rem', fontWeight: '600' }}>
              SIGNATURE LEATHER ATELIER
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#000000', fontWeight: '400', lineHeight: 1.15, marginBottom: '1.2rem' }}>
              {primaryFeature.title}
            </h2>

            <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.6, marginBottom: '1.8rem' }}>
              {primaryFeature.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: '600', color: '#000' }}>
                {formatPrice(primaryFeature.price, currency)}
              </span>
              {primaryFeature.compare_at_price && (
                <span style={{ fontSize: '0.95rem', color: '#888', textDecoration: 'line-through' }}>
                  {formatPrice(primaryFeature.compare_at_price, currency)}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedProduct(primaryFeature)}
                className="btn-zegna-primary"
              >
                Inspect Atelier Details
              </button>
              <button
                onClick={() => addToCart(primaryFeature, primaryFeature.available_sizes?.[0], primaryFeature.colors?.[0])}
                className="btn-zegna-outline"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Split Feature (Textile & Tailoring) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
          
          {/* Card 1 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div 
              style={{
                height: '480px',
                backgroundColor: '#f6f6f6',
                overflow: 'hidden',
                cursor: 'pointer',
                marginBottom: '1.5rem'
              }}
              onClick={() => setSelectedProduct(secondaryFeature)}
            >
              <img 
                src={secondaryFeature.images?.[0] || 'https://images.unsplash.com/photo-1539533018447-63fcce667883?q=80&w=900&auto=format&fit=crop'} 
                alt={secondaryFeature.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              />
            </div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777', marginBottom: '0.4rem', fontWeight: '600' }}>
              PURE CASHMERE & VIRGIN WOOL
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: '400', color: '#000', marginBottom: '0.6rem' }}>
              {secondaryFeature.title}
            </h3>
            <div style={{ marginBottom: '1rem', fontWeight: '600', fontSize: '1.05rem', color: '#000' }}>
              {formatPrice(secondaryFeature.price, currency)}
            </div>
            <button
              onClick={() => setSelectedProduct(secondaryFeature)}
              className="zegna-underlined-link"
              style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0 }}
            >
              Discover the Overcoat
            </button>
          </div>

          {/* Card 2 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div 
              style={{
                height: '480px',
                backgroundColor: '#f6f6f6',
                overflow: 'hidden',
                cursor: 'pointer',
                marginBottom: '1.5rem'
              }}
              onClick={() => {
                setActiveCategory('Leather Jackets');
                if (onExploreCatalog) onExploreCatalog();
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=900&auto=format&fit=crop"
                alt="Tuscan Suede Aviator"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              />
            </div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777', marginBottom: '0.4rem', fontWeight: '600' }}>
              WINTER SHEARLING
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: '400', color: '#000', marginBottom: '0.6rem' }}>
              Tuscan Suede & Shearling Aviator Coat
            </h3>
            <div style={{ marginBottom: '1rem', fontWeight: '600', fontSize: '1.05rem', color: '#000' }}>
              {formatPrice(1450, currency)}
            </div>
            <button
              onClick={() => {
                setActiveCategory('Leather Jackets');
                if (onExploreCatalog) onExploreCatalog();
              }}
              className="zegna-underlined-link"
              style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0 }}
            >
              Explore Shearling Outerwear
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
