import React from 'react';
import { ShieldCheck, Scissors, Sparkles, Gem } from 'lucide-react';

export default function CraftsmanshipStory() {
  return (
    <section id="craftsmanship" style={{ padding: '7rem 0', backgroundColor: '#f7f7f7', borderTop: '1px solid #e5e5e5' }}>
      <div className="container-zegna">
        
        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', marginBottom: '0.6rem', fontWeight: '600' }}>
              OUR WORLD & HERITAGE
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#000000', fontWeight: '400', lineHeight: 1.15, marginBottom: '1.4rem' }}>
              Sartorial Values & Atelier Provenance
            </h2>
            <p style={{ color: '#444', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>
              At <strong>FESTA MUNICH</strong>, we view leather and textiles not as manufactured commodities, but as living mediums that hold character, depth, and permanence.
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>
              From our dedicated Sialkot atelier, master pattern cutters with generations of leather heritage work alongside modern silhouette architects. Every seam is double-locked, every edge hand-burnished, and every lining draped by hand.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div 
              style={{
                height: '460px',
                backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
              }}
            />
          </div>
        </div>

        {/* 4 Pillars of Craftsmanship */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          
          <div style={{ background: '#ffffff', padding: '2.5rem 2rem', border: '1px solid #e5e5e5' }}>
            <div style={{ color: '#000000', marginBottom: '1rem' }}><Gem size={26} /></div>
            <h4 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.5rem' }}>Top 1% Hides</h4>
            <p style={{ color: '#666', fontSize: '0.84rem', lineHeight: 1.6 }}>
              We exclusively select vegetable-tanned A-grade full-grain calfskins and supple French lambskins with zero synthetic plastic coatings.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '2.5rem 2rem', border: '1px solid #e5e5e5' }}>
            <div style={{ color: '#000000', marginBottom: '1rem' }}><Scissors size={26} /></div>
            <h4 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.5rem' }}>Anatomical Drafting</h4>
            <p style={{ color: '#666', fontSize: '0.84rem', lineHeight: 1.6 }}>
              Cut following natural body contours for dynamic flexibility, unhindered shoulder movement, and clean drape.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '2.5rem 2rem', border: '1px solid #e5e5e5' }}>
            <div style={{ color: '#000000', marginBottom: '1rem' }}><Sparkles size={26} /></div>
            <h4 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.5rem' }}>Hand-Polished Patina</h4>
            <p style={{ color: '#666', fontSize: '0.84rem', lineHeight: 1.6 }}>
              Each leather piece is hand-waxed and rubbed with natural carnauba oils, creating depth that matures uniquely with wear.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '2.5rem 2rem', border: '1px solid #e5e5e5' }}>
            <div style={{ color: '#000000', marginBottom: '1rem' }}><ShieldCheck size={26} /></div>
            <h4 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.5rem' }}>Swiss Hardware</h4>
            <p style={{ color: '#666', fontSize: '0.84rem', lineHeight: 1.6 }}>
              Equipped with solid brass and matte gunmetal zippers engineered for thousands of cycles of effortless gliding.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
