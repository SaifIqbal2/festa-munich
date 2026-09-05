import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowRight } from 'lucide-react';

const CATEGORY_ITEMS = [
  {
    title: "Handcrafted Leather Jackets",
    category: "Leather Jackets",
    subtitle: "Full-Grain Calfskin & Tuscan Lambskin",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Textile & Cashmere Coats",
    category: "Textile Outerwear",
    subtitle: "Mongolian Cashmere & Virgin Wool",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce667883?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Sartorial Tailoring & Blazers",
    category: "Tailoring & Blazers",
    subtitle: "Silk-Wool Weave & Neapolitan Shoulders",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Leather Goods & Driving Accessories",
    category: "Accessories & Bags",
    subtitle: "Saddle Leather Weekenders & Deerskin Gloves",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop"
  }
];

export default function CategoryGrid({ onExploreCatalog }) {
  const { setActiveCategory } = useShop();

  const handleSelect = (categoryName) => {
    setActiveCategory(categoryName);
    if (onExploreCatalog) onExploreCatalog();
  };

  return (
    <section style={{ padding: '6rem 0', backgroundColor: '#070707' }}>
      <div className="container-luxe">
        
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
          <div className="luxury-eyebrow" style={{ marginBottom: '0.5rem' }}>
            ATELIER DISCIPLINES
          </div>
          <h2 className="luxury-heading-lg" style={{ color: '#fff' }}>
            The Pillars of Festa Munich
          </h2>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.8rem' }}>
            Each garment is an exercise in material purity, master anatomical cutting, and uncompromising finish.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {CATEGORY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item.category)}
              style={{
                position: 'relative',
                height: '460px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.08)';
                const overlay = e.currentTarget.querySelector('.card-overlay');
                if (overlay) overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.3) 100%)';
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.0)';
                const overlay = e.currentTarget.querySelector('.card-overlay');
                if (overlay) overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.2) 100%)';
              }}
            >
              {/* Background Image */}
              <img 
                src={item.image} 
                alt={item.title} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />

              {/* Overlay */}
              <div 
                className="card-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.2) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  transition: 'background 0.3s ease'
                }}
              >
                <div className="luxury-eyebrow" style={{ fontSize: '0.65rem', marginBottom: '0.3rem' }}>
                  {item.subtitle}
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
                  {item.title}
                </h3>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#c89d66', fontSize: '0.78rem', fontWeight: '600', letterSpacing: '0.1em' }}>
                  <span>DISCOVER CAPSULE</span>
                  <ArrowRight size={14} />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
