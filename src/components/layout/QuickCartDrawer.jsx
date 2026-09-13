import React from 'react';
import { useShop } from '../../context/ShopContext';
import { BRAND_INFO } from '../../data/initialProducts';
import { X, Trash2, Plus, Minus, ShieldCheck, MessageSquare, Send, ArrowRight } from 'lucide-react';

export default function QuickCartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity,
    openQuoteModal 
  } = useShop();

  if (!isCartOpen) return null;

  const generateBulkWhatsAppUrl = () => {
    const itemsSummary = cart.map((item, index) => 
      `${index + 1}. *${item.title}* | Size: ${item.selectedSize} | Color: ${item.selectedColor} | Requested Batch: ${item.quantity}`
    ).join('\n');

    const text = `*FESTA MUNICH — MULTI-ITEM WHOLESALE RFQ*
----------------------------------
*Selected Garments for Bulk Quotation:*
${itemsSummary}

*Total Garment Types:* ${cart.length}
*Total Units Requested:* ${cart.reduce((s, i) => s + i.quantity, 0)}

Please provide FOB export pricing, sampling timeframe, and private label customization details.
----------------------------------
Inquiry from festamunich.com`;

    return `https://wa.me/923277551063?text=${encodeURIComponent(text)}`;
  };

  const handleOpenGeneralQuote = () => {
    setIsCartOpen(false);
    openQuoteModal({
      title: `Bulk Inquiry (${cart.length} Garments Selected)`,
      id: 'bulk-rfq',
      category: 'Consolidated Bulk Order',
      material: cart.map(i => i.title).join(', ')
    });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
          maxWidth: '480px',
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
            justifyContent: 'space-between',
            backgroundColor: '#fafafa'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777', fontWeight: '600' }}>
              WHOLESALE & B2B SELECTION
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#000', margin: '0.2rem 0 0 0', fontWeight: '400' }}>
              RFQ & Quotation List ({cart.length})
            </h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: '0.4rem' }}
            aria-label="Close RFQ Drawer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#777' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#000', marginBottom: '0.6rem', fontWeight: '400' }}>
                Your Quotation List is Empty
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
                Browse our atelier leather & cashmere catalog. Add garments to this list to request custom pricing, tech pack sampling, or bulk production.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="btn-zegna-primary"
                style={{ padding: '0.9rem 1.8rem' }}
              >
                Explore Catalog
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
                      height: '95px',
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
                        <h4 style={{ fontSize: '0.92rem', fontWeight: '600', color: '#000', lineHeight: 1.3, margin: 0 }}>
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '0.2rem' }}
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
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', minWidth: '28px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          style={{ background: 'none', border: 'none', color: '#000', padding: '0.2rem 0.6rem', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: '#777', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Wholesale MOQ
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div 
            style={{
              padding: '1.6rem 2rem',
              borderTop: '1px solid #e5e5e5',
              backgroundColor: '#fafafa'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: '#555', marginBottom: '1.2rem', lineHeight: 1.4 }}>
              <ShieldCheck size={16} color="#000" style={{ flexShrink: 0 }} />
              <span>Direct factory manufacturing in Sialkot, Pakistan with custom private labeling and global FOB/DDP export.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button
                onClick={handleOpenGeneralQuote}
                className="btn-zegna-primary"
                style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Send size={15} />
                <span>Submit Quotation Request ({cart.length} Items)</span>
              </button>

              <a
                href={generateBulkWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-zegna-outline"
                style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderColor: '#25D366', color: '#128C7E', fontSize: '0.78rem', fontWeight: '600' }}
              >
                <MessageSquare size={16} color="#25D366" />
                <span>Send Bulk RFQ on WhatsApp ({BRAND_INFO.phone})</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
