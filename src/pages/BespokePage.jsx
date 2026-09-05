import React from 'react';
import BespokeConcierge from '../components/home/BespokeConcierge';

export default function BespokePage() {
  return (
    <>
      <div style={{ background: '#f7f7f7', borderBottom: '1px solid #ececec' }}>
        <div className="container-zegna" style={{ padding: '4rem 1.5rem 2rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#777', marginBottom: '0.8rem', fontWeight: '600' }}>
            Bespoke Atelier
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 4rem)', fontWeight: '400', color: '#000', lineHeight: 1.1, marginBottom: '0.8rem' }}>
            Tailored to Your Exacting Standards
          </h1>
          <p style={{ maxWidth: '760px', color: '#555', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Develop a custom leather or textile piece with our atelier team for a personal fit, material selection, and refined finishing.
          </p>
        </div>
      </div>
      <BespokeConcierge />
    </>
  );
}
