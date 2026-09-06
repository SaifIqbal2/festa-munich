import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';

export default function HeroBanner({ onExploreCatalog }) {
  const { setActiveCategory, heroSlides } = useShop();
  const [activeSlide, setActiveSlide] = useState(0);
  const visibleSlides = (heroSlides || []).filter((item) => item.is_active !== false);

  useEffect(() => {
    setActiveSlide(0);
  }, [heroSlides]);

  useEffect(() => {
    if (visibleSlides.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % visibleSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [visibleSlides.length]);

  const slide = visibleSlides[activeSlide] || visibleSlides[0] || {
    heading: 'THE FALL CLOSET',
    subtitle: 'Dressing for fall starts at home, where every piece carries intention.',
    buttonText: 'Discover the Collection',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop'
  };

  return (
    <section 
      className="hero-banner-section"
      style={{
        position: 'relative',
        height: '74vh',
        minHeight: '520px',
        width: '100%',
        backgroundColor: '#111111',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="hero-banner-backdrop"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.45) 100%), url('${slide.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          transition: 'background-image 0.5s ease-in-out'
        }}
      />

      <div 
        className="hero-banner-content"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '980px',
          width: '100%'
        }}
      >
        <div className="hero-banner-kicker hero-reveal hero-reveal-1" style={{ marginBottom: '0.7rem', fontSize: '0.75rem', letterSpacing: '0.22em', color: '#f5f5f5', textTransform: 'uppercase', opacity: 0.9 }}>
          Atelier Collection
        </div>

        <h1 
          className="hero-banner-title"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2rem, 4.2vw, 4.1rem)',
            fontWeight: '700',
            letterSpacing: '0.09em',
            color: '#ffffff',
            textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.35)',
            marginBottom: '0.8rem',
            lineHeight: 1.08
          }}
        >
          {slide.heading}
        </h1>

        {slide.subtitle && (
          <p className="hero-banner-subtitle hero-reveal hero-reveal-3" style={{ color: '#f5f5f5', fontSize: '0.9rem', letterSpacing: '0.03em', margin: '0 auto 1.2rem', maxWidth: '640px', opacity: 0.9, lineHeight: 1.6 }}>
            {slide.subtitle}
          </p>
        )}

        <div className="hero-banner-actions hero-reveal hero-reveal-4" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="hero-banner-button btn-zegna-white"
            onClick={() => {
              setActiveCategory('All Garments');
              if (onExploreCatalog) onExploreCatalog();
            }}
            style={{
              fontWeight: '600',
              letterSpacing: '0.1em',
              fontSize: '0.74rem',
              padding: '0.9rem 1.9rem'
            }}
          >
            {slide.buttonText || 'Discover the Collection'}
          </button>
        </div>
      </div>

      {visibleSlides.length > 1 && (
        <div className="hero-banner-dots" style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 12, display: 'flex', gap: '0.55rem' }}>
          {visibleSlides.map((item, index) => (
            <button
              key={item.id}
              className="hero-banner-dot"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                background: index === activeSlide ? '#fff' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                padding: 0
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
