import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/helpers';
import { BRAND_INFO } from '../../data/initialProducts';
import { X, Heart, MessageSquare, Check, Ruler } from 'lucide-react';

export default function ProductDetailModal() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    currency, 
    addToCart, 
    wishlist, 
    toggleWishlist 
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(selectedProduct?.available_sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors?.[0] || 'Black');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const images = selectedProduct.images && selectedProduct.images.length > 0 
    ? selectedProduct.images 
    : ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop'];

  const whatsappInquiryUrl = `https://wa.me/923277551063?text=Hello%20Festa%20Munich,%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(selectedProduct.title)}%20(Ref:%20${selectedProduct.id})%20in%20Size:%20${selectedSize}.`;

  return (
    <div 
      className="modal-overlay"
      onClick={() => setSelectedProduct(null)}
      style={{ padding: '1rem' }}
    >
      <div 
        className="animate-slide-up"
        style={{
          backgroundColor: '#ffffff',
          maxWidth: '1020px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            zIndex: 20,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            color: '#000',
            cursor: 'pointer',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Gallery */}
        <div style={{ backgroundColor: '#f8f8f8', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div 
            style={{
              height: '480px',
              backgroundColor: '#f0f0f0',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <img 
              src={images[selectedImageIndex] || images[0]} 
              alt={selectedProduct.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '64px',
                    height: '64px',
                    padding: 0,
                    border: `2px solid ${selectedImageIndex === idx ? '#000000' : '#dddddd'}`,
                    cursor: 'pointer',
                    background: '#fff'
                  }}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777', fontWeight: '600' }}>
                {selectedProduct.category}
              </div>
              
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isWishlisted ? '#000' : '#888',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.8rem'
                }}
              >
                <Heart size={16} fill={isWishlisted ? '#000' : 'none'} color="#000" />
                <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#000', lineHeight: 1.2, marginBottom: '0.4rem', fontWeight: '400' }}>
              {selectedProduct.title}
            </h2>

            <div style={{ fontSize: '0.9rem', color: '#555', fontStyle: 'italic', marginBottom: '1.2rem' }}>
              {selectedProduct.material}
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.6rem', paddingBottom: '1.2rem', borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '700', color: '#000' }}>
                {formatPrice(selectedProduct.price, currency)}
              </span>
              {selectedProduct.compare_at_price && (
                <span style={{ fontSize: '1rem', color: '#888', textDecoration: 'line-through' }}>
                  {formatPrice(selectedProduct.compare_at_price, currency)}
                </span>
              )}
            </div>

            <p style={{ color: '#444', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.8rem' }}>
              {selectedProduct.description}
            </p>

            {/* Size Selector */}
            {selectedProduct.available_sizes?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Select Size: <strong>{selectedSize}</strong>
                  </label>
                  <button 
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    style={{ background: 'none', border: 'none', color: '#000', fontSize: '0.74rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Size Guide
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedProduct.available_sizes.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        style={{
                          minWidth: '48px',
                          height: '42px',
                          padding: '0 0.8rem',
                          background: isSelected ? '#000000' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#000000',
                          border: `1px solid ${isSelected ? '#000000' : '#cccccc'}`,
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? '700' : '400',
                          cursor: 'pointer'
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Craftsmanship details */}
            {selectedProduct.craftsmanship_details?.length > 0 && (
              <div style={{ marginBottom: '2rem', background: '#fafafa', padding: '1.2rem', border: '1px solid #eee' }}>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.6rem', color: '#333' }}>
                  ATELIER CRAFTSMANSHIP
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: '#555' }}>
                  {selectedProduct.craftsmanship_details.map((detail, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={14} color="#000" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '1.5rem' }}>
            <button
              onClick={() => {
                addToCart(selectedProduct, selectedSize, selectedColor, quantity);
                setSelectedProduct(null);
              }}
              className="btn-zegna-primary"
              style={{ width: '100%', padding: '1.1rem' }}
            >
              Add to Shopping Bag
            </button>

            <a 
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-zegna-outline"
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.78rem' }}
            >
              <MessageSquare size={15} />
              Inquire via WhatsApp ({BRAND_INFO.phone})
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
