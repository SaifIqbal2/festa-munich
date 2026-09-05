import React from 'react';
import { useShop } from '../../context/ShopContext';

export default function EditorialQuoteSection({ onExploreCatalog }) {
  const { setActiveCategory } = useShop();

  return (
    <section 
      style={{
        backgroundColor: '#ffffff',
        padding: '5.5rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p 
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
            fontWeight: '400',
            lineHeight: 1.5,
            color: '#000000',
            marginBottom: '1.8rem'
          }}
        >
          Dressing for fall starts at home, where every piece carries intention.
        </p>

        <button
          onClick={() => {
            setActiveCategory('All Garments');
            if (onExploreCatalog) onExploreCatalog();
          }}
          className="zegna-underlined-link"
          style={{ background: 'none', border: 'none' }}
        >
          Discover the Collection
        </button>
      </div>
    </section>
  );
}
