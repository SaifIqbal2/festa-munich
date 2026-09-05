import React from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/helpers';
import { Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { 
    currency, 
    setSelectedProduct, 
    addToCart, 
    wishlist, 
    toggleWishlist 
  } = useShop();

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Product Image Area */}
      <div 
        style={{
          position: 'relative',
          height: '360px',
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
          cursor: 'pointer',
          marginBottom: '0.85rem'
        }}
        onClick={() => setSelectedProduct(product)}
      >
        <img 
          src={product.images?.[0]} 
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          style={{
            position: 'absolute',
            top: '0.8rem',
            right: '0.8rem',
            background: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} color="#000" fill={isWishlisted ? '#000' : 'none'} />
        </button>

        {/* Badge */}
        {product.badge && (
          <div 
            style={{
              position: 'absolute',
              bottom: '0.8rem',
              left: '0.8rem',
              background: '#ffffff',
              color: '#000000',
              padding: '0.2rem 0.6rem',
              fontSize: '0.65rem',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            {product.badge}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.09em', color: '#777777', marginBottom: '0.25rem' }}>
          {product.category}
        </div>

        <h3 
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#000000',
            lineHeight: 1.3,
            marginBottom: '0.3rem',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedProduct(product)}
        >
          {product.title}
        </h3>

        <div style={{ fontSize: '0.75rem', color: '#666666', fontStyle: 'italic', marginBottom: '0.5rem' }}>
          {product.material}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.7rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#000000' }}>
            {formatPrice(product.price, currency)}
          </span>
          {product.compare_at_price && (
            <span style={{ fontSize: '0.75rem', color: '#888888', textDecoration: 'line-through' }}>
              {formatPrice(product.compare_at_price, currency)}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginTop: 'auto' }}>
          <button
            onClick={() => setSelectedProduct(product)}
            className="btn-zegna-outline"
            style={{ padding: '0.5rem 0.45rem', fontSize: '0.68rem' }}
          >
            View Details
          </button>
          <button
            onClick={() => addToCart(product, product.available_sizes?.[0], product.colors?.[0])}
            className="btn-zegna-primary"
            style={{ padding: '0.5rem 0.45rem', fontSize: '0.68rem' }}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
