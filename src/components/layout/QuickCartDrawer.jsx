import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/helpers';
import { X, Trash2, Plus, Minus, ShieldCheck, Gift, ArrowRight } from 'lucide-react';

export default function QuickCartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    currency,
    setIsCheckoutOpen 
  } = useShop();

  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);

  if (!isCartOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.8rem 2rem',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777', fontWeight: '600' }}>
              SHOPPING BAG
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#000', marginTop: '0.2rem' }}>
              Your Selection ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#777' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#000', marginBottom: '0.5rem' }}>
                Your Shopping Bag is Empty
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '2rem' }}>
                Explore the latest Autumn / Winter leather & cashmere collection.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="btn-zegna-primary"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map((item) => (
                <div 
                  key={item.cartItemId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: '1rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid #eeeeee'
                  }}
                >
                  <div 
                    style={{
                      height: '100px',
                      backgroundColor: '#f5f5f5',
                      overflow: 'hidden'
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: '500', color: '#000', lineHeight: 1.3 }}>
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.78rem', color: '#666', marginTop: '0.3rem' }}>
                        <span>Size: <strong style={{ color: '#000' }}>{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>Color: <strong style={{ color: '#000' }}>{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                      <div 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid #cccccc'
                        }}
                      >
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                          style={{ background: 'none', border: 'none', color: '#000', padding: '0.2rem 0.6rem', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          style={{ background: 'none', border: 'none', color: '#000', padding: '0.2rem 0.6rem', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ fontSize: '1rem', color: '#000', fontWeight: '700' }}>
                        {formatPrice(item.price * item.quantity, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div 
                style={{
                  background: '#fafafa',
                  border: '1px dashed #d5d5d5',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.8rem',
                  cursor: 'pointer'
                }}
                onClick={() => setIncludeGiftWrap(!includeGiftWrap)}
              >
                <input 
                  type="checkbox" 
                  checked={includeGiftWrap} 
                  onChange={() => {}}
                  style={{ marginTop: '0.2rem', accentColor: '#000' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '600', color: '#000' }}>
                    <Gift size={14} />
                    Complimentary Monogram Box & Suit Cover
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#777', marginTop: '0.2rem' }}>
                    Includes Festa Munich wooden bespoke hanger and protective canvas bag.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div 
            style={{
              padding: '1.8rem 2rem',
              borderTop: '1px solid #e5e5e5',
              backgroundColor: '#fafafa'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>
                Subtotal
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#000' }}>
                {formatPrice(cartSubtotal, currency)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#666', marginBottom: '1.4rem' }}>
              <ShieldCheck size={14} color="#000" />
              <span>Complimentary insured global express delivery.</span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="btn-zegna-primary"
              style={{ width: '100%', padding: '1.1rem' }}
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
