import React from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/helpers';
import { Heart, ArrowRight, ShoppingBag, Eye, Sparkles } from 'lucide-react';

export default function IconicCollection({ onExploreCatalog }) {
  const { 
    products, 
    currency, 
    setSelectedProduct, 
    addToCart, 
    setActiveCategory,
    wishlist = [],
    toggleWishlist,
    isLoading 
  } = useShop();

  // 1. Filter out inactive / soft-deleted products
  const activeProducts = (products || []).filter(p => p.is_active !== false);

  // 2. Prioritize products marked as is_featured === true, or with 'featured'/'iconic' in badge
  const explicitlyFeatured = activeProducts.filter(p => 
    p.is_featured === true || 
    p.badge?.toLowerCase().includes('featured') ||
    p.badge?.toLowerCase().includes('iconic')
  );

  // 3. Fill up with remaining active products so showcase always has rich content
  const nonFeatured = activeProducts.filter(p => !explicitlyFeatured.some(fp => fp.id === p.id));
  const showcaseList = [...explicitlyFeatured, ...nonFeatured];

  // If store is still loading products
  if (isLoading && showcaseList.length === 0) {
    return (
      <section style={{ backgroundColor: '#ffffff', padding: '4rem 0 5rem 0' }}>
        <div className="container-zegna">
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>
            <p style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>Loading Atelier Creations...</p>
          </div>
        </div>
      </section>
    );
  }

  // If no products exist yet in the store
  if (showcaseList.length === 0) {
    return null;
  }

  const primaryFeature = showcaseList[0];
  const secondaryFeatures = showcaseList.slice(1, 7); // Show up to 6 secondary featured items dynamically

  return (
    <section style={{ backgroundColor: '#ffffff', padding: '2rem 0 6rem 0', borderBottom: '1px solid #f2f2f2' }}>
      <div className="container-zegna">
        
        {/* Section Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '3rem',
            paddingTop: '2rem',
            borderBottom: '1px solid #eeeeee',
            paddingBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ 
              fontSize: '0.72rem', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              color: '#888888', 
              marginBottom: '0.4rem', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Sparkles size={13} color="#999" />
              ATELIER HIGHLIGHTS
            </div>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
              color: '#000000', 
              fontWeight: '400', 
              margin: 0,
              lineHeight: 1.15
            }}>
              Featured Creations
            </h2>
          </div>

          <button
            onClick={() => {
              if (onExploreCatalog) onExploreCatalog();
            }}
            className="zegna-underlined-link"
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '0.82rem', 
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              color: '#000',
              padding: '0.3rem 0'
            }}
          >
            <span>View All Garments ({activeProducts.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Spotlight Hero Feature Card (Top Featured Product) */}
        {primaryFeature && (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
              marginBottom: secondaryFeatures.length > 0 ? '5rem' : '2rem',
              background: '#fcfcfc',
              border: '1px solid #f0f0f0',
              padding: '2rem'
            }}
          >
            {/* Image */}
            <div 
              style={{
                height: '520px',
                backgroundColor: '#f5f5f5',
                overflow: 'hidden',
                position: 'relative',
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
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              />

              {/* Wishlist Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(primaryFeature.id);
                }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.12)'
                }}
                title={wishlist.includes(primaryFeature.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart 
                  size={16} 
                  color="#000" 
                  fill={wishlist.includes(primaryFeature.id) ? '#000' : 'none'} 
                />
              </button>

              {/* Badge */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  background: '#000000',
                  color: '#ffffff',
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.68rem',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                {primaryFeature.badge || primaryFeature.category || 'Featured'}
              </div>
            </div>

            {/* Text Content */}
            <div style={{ maxWidth: '520px', padding: '0 0.5rem' }}>
              <div style={{ 
                fontSize: '0.72rem', 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                color: '#777777', 
                marginBottom: '0.6rem', 
                fontWeight: '600' 
              }}>
                {primaryFeature.category || 'Atelier Signature'}
              </div>

              <h3 
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', 
                  color: '#000000', 
                  fontWeight: '400', 
                  lineHeight: 1.15, 
                  marginBottom: '1rem',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedProduct(primaryFeature)}
              >
                {primaryFeature.title}
              </h3>

              {primaryFeature.material && (
                <div style={{ fontSize: '0.82rem', color: '#666', fontStyle: 'italic', marginBottom: '0.9rem' }}>
                  {primaryFeature.material}
                </div>
              )}

              <p style={{ 
                fontSize: '0.92rem', 
                color: '#444444', 
                lineHeight: 1.65, 
                marginBottom: '1.6rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {primaryFeature.description || primaryFeature.subtitle || 'Exquisitely crafted in our Sialkot atelier with the finest materials and anatomical precision.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: '600', color: '#000000' }}>
                  {formatPrice(primaryFeature.price, currency)}
                </span>
                {primaryFeature.compare_at_price && (
                  <span style={{ fontSize: '0.95rem', color: '#888888', textDecoration: 'line-through' }}>
                    {formatPrice(primaryFeature.compare_at_price, currency)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedProduct(primaryFeature)}
                  className="btn-zegna-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.6rem' }}
                >
                  <Eye size={15} />
                  <span>Inspect Atelier Details</span>
                </button>
                <button
                  onClick={() => addToCart(primaryFeature, primaryFeature.available_sizes?.[0], primaryFeature.colors?.[0])}
                  className="btn-zegna-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.4rem' }}
                >
                  <ShoppingBag size={15} />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Featured Products Grid (Fully Dynamic — Only Real Products) */}
        {secondaryFeatures.length > 0 && (
          <div>
            <div style={{ 
              fontSize: '0.74rem', 
              letterSpacing: '0.14em', 
              textTransform: 'uppercase', 
              color: '#777777', 
              marginBottom: '1.8rem', 
              fontWeight: '600' 
            }}>
              More From The Collection
            </div>

            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                gap: '2.5rem 2rem' 
              }}
            >
              {secondaryFeatures.map((product) => {
                const isItemWishlisted = wishlist.includes(product.id);

                return (
                  <div 
                    key={product.id}
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      backgroundColor: '#ffffff',
                      position: 'relative'
                    }}
                  >
                    {/* Image Area */}
                    <div 
                      style={{
                        height: '380px',
                        backgroundColor: '#f6f6f6',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                        position: 'relative'
                      }}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'} 
                        alt={product.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover', 
                          transition: 'transform 0.5s ease' 
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
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
                          top: '0.75rem',
                          right: '0.75rem',
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
                        title={isItemWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart 
                          size={15} 
                          color="#000" 
                          fill={isItemWishlisted ? '#000' : 'none'} 
                        />
                      </button>

                      {/* Badge if available */}
                      {product.badge && (
                        <div 
                          style={{
                            position: 'absolute',
                            bottom: '0.75rem',
                            left: '0.75rem',
                            background: '#ffffff',
                            color: '#000000',
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.62rem',
                            fontWeight: '700',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase'
                          }}
                        >
                          {product.badge}
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777777', marginBottom: '0.35rem', fontWeight: '600' }}>
                      {product.category || 'Garment'}
                    </div>

                    <h4 
                      style={{ 
                        fontFamily: 'var(--font-serif)', 
                        fontSize: '1.25rem', 
                        fontWeight: '400', 
                        color: '#000000', 
                        marginBottom: '0.4rem',
                        lineHeight: 1.25,
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.title}
                    </h4>

                    {product.material && (
                      <div style={{ fontSize: '0.75rem', color: '#777', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                        {product.material}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.9rem' }}>
                      <span style={{ fontWeight: '600', fontSize: '1rem', color: '#000000' }}>
                        {formatPrice(product.price, currency)}
                      </span>
                      {product.compare_at_price && (
                        <span style={{ fontSize: '0.8rem', color: '#888888', textDecoration: 'line-through' }}>
                          {formatPrice(product.compare_at_price, currency)}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: 'auto' }}>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="btn-zegna-outline"
                        style={{ padding: '0.55rem 0.4rem', fontSize: '0.68rem', textAlign: 'center' }}
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => addToCart(product, product.available_sizes?.[0], product.colors?.[0])}
                        className="btn-zegna-primary"
                        style={{ padding: '0.55rem 0.4rem', fontSize: '0.68rem', textAlign: 'center' }}
                      >
                        Add to Bag
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
