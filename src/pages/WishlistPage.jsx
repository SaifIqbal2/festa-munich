import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/shop/ProductCard';

export default function WishlistPage() {
  const { products, wishlist } = useShop();
  const savedProducts = products.filter((product) => wishlist.includes(product.id));

  return (
    <section className="container-zegna" style={{ padding: '4rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#777', marginBottom: '0.7rem', fontWeight: '600' }}>
          Saved pieces
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 4rem)', fontWeight: '400', margin: 0 }}>
          Wishlist
        </h1>
      </div>

      {savedProducts.length === 0 ? (
        <div style={{ borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8', padding: '4rem 1rem', textAlign: 'center' }}>
          <Heart size={28} strokeWidth={1.4} style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '400', margin: '0 0 0.7rem' }}>
            Your wishlist is empty
          </h2>
          <p style={{ color: '#666', margin: '0 auto 1.5rem', maxWidth: '420px', lineHeight: 1.6 }}>
            Save pieces you love and return to them whenever you are ready.
          </p>
          <Link to="/shop" className="btn-zegna-primary" style={{ textDecoration: 'none' }}>
            Explore the collection
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
