import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCatalog from '../components/shop/ProductCatalog';

export default function CatalogPage() {
  const { setActiveCategory } = useShop();

  useEffect(() => {
    setActiveCategory((current) => current || 'All Garments');
  }, [setActiveCategory]);

  return (
    <>
      <div style={{ background: '#f7f7f7', borderBottom: '1px solid #ececec' }}>
        <div className="container-zegna" style={{ padding: '4rem 1.5rem 2rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#777', marginBottom: '0.8rem', fontWeight: '600' }}>
            Curated Exclusives
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 4rem)', fontWeight: '400', color: '#000', lineHeight: 1.1, marginBottom: '0.8rem' }}>
            Ready to Wear Collection
          </h1>
          <p style={{ maxWidth: '720px', color: '#555', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Discover our signature leather pieces, cashmere outerwear, and tailored essentials crafted for a refined everyday wardrobe.
          </p>
        </div>
      </div>
      <ProductCatalog />
    </>
  );
}
