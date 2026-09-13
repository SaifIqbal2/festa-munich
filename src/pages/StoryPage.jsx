import React from 'react';
import CraftsmanshipStory from '../components/home/CraftsmanshipStory';
import BespokeConcierge from '../components/home/BespokeConcierge';
import SEOHead from '../components/common/SEOHead';

export default function StoryPage() {
  return (
    <>
      <SEOHead
        title="Our World — Atelier Heritage & Craftsmanship"
        description="Discover the story behind Festa Munich — a legacy of master craftsmen in Sialkot creating European luxury garments with natural materials and disciplined precision."
        canonical="https://festamunich.com/our-world"
      />
      <div style={{ background: '#f7f7f7', borderBottom: '1px solid #ececec' }}>
        <div className="container-zegna" style={{ padding: '4rem 1.5rem 2rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#777', marginBottom: '0.8rem', fontWeight: '600' }}>
            Our World
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 4rem)', fontWeight: '400', color: '#000', lineHeight: 1.1, marginBottom: '0.8rem' }}>
            Heritage, Craft, and Modern Mastery
          </h1>
          <p style={{ maxWidth: '760px', color: '#555', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Every Festa Munich garment is shaped by disciplined craftsmanship, natural materials, and a deep commitment to long-term wear.
          </p>
        </div>
      </div>
      <CraftsmanshipStory />
      <BespokeConcierge />
    </>
  );
}

