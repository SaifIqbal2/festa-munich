import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice, formatDate } from '../../utils/helpers';
import { X, Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin } from 'lucide-react';

export default function OrderTrackingModal() {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, orders, currency } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim().toUpperCase();
    const found = orders.find(
      o => o.order_number?.toUpperCase() === term || 
           o.customer_email?.toUpperCase() === term ||
           o.id === searchTerm.trim()
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStepProgress = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const currentStep = searchedOrder ? getStepProgress(searchedOrder.status) : 0;

  return (
    <div 
      className="modal-overlay"
      onClick={() => setIsOrderTrackingOpen(false)}
      style={{ padding: '1rem' }}
    >
      <div 
        className="animate-slide-up"
        style={{
          backgroundColor: '#141414',
          border: '1px solid rgba(200, 157, 102, 0.3)',
          maxWidth: '750px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.8rem 2.2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div className="luxury-eyebrow">CONCIERGE TRACKING</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', marginTop: '0.2rem' }}>
              Atelier Order Status
            </h3>
          </div>
          <button 
            onClick={() => setIsOrderTrackingOpen(false)}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Search Input Box */}
        <div style={{ padding: '2rem 2.2rem', backgroundColor: '#111', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Enter Order # (e.g. FM-7K9A2X) or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                autoFocus
              />
              <Search size={16} color="#c89d66" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button type="submit" className="btn btn-gold">
              Track Order
            </button>
          </form>
          
          <div style={{ marginTop: '0.8rem', fontSize: '0.74rem', color: '#777' }}>
            Tip: Try demo order numbers <span style={{ color: '#c89d66', cursor: 'pointer' }} onClick={() => setSearchTerm('FM-7K9A2X')}>FM-7K9A2X</span> or <span style={{ color: '#c89d66', cursor: 'pointer' }} onClick={() => setSearchTerm('FM-3B8N9W')}>FM-3B8N9W</span>
          </div>
        </div>

        {/* Tracking Details Results */}
        <div style={{ padding: '2.2rem' }}>
          {searchedOrder ? (
            <div>
              {/* Top Banner */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#1a1a1a',
                  padding: '1.2rem 1.5rem',
                  borderLeft: '4px solid #c89d66',
                  marginBottom: '2rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Tracking Order
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#c89d66', fontWeight: '600' }}>
                    #{searchedOrder.order_number}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#888' }}>
                    Placed on: {formatDate(searchedOrder.created_at)}
                  </div>
                  <div 
                    style={{
                      display: 'inline-block',
                      background: 'rgba(200, 157, 102, 0.2)',
                      color: '#c89d66',
                      border: '1px solid #c89d66',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      marginTop: '0.3rem'
                    }}
                  >
                    STATUS: {searchedOrder.status}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div className="luxury-eyebrow" style={{ marginBottom: '1.2rem' }}>
                  ATELIER LOGISTICS TIMELINE
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }}>
                  
                  {/* Step 1 */}
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        margin: '0 auto 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: currentStep >= 1 ? '#c89d66' : '#222',
                        color: currentStep >= 1 ? '#000' : '#666',
                        fontWeight: 'bold'
                      }}
                    >
                      1
                    </div>
                    <div style={{ fontSize: '0.74rem', color: currentStep >= 1 ? '#fff' : '#666', fontWeight: '600' }}>
                      Order Placed
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#888' }}>Confirmed</div>
                  </div>

                  {/* Step 2 */}
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        margin: '0 auto 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: currentStep >= 2 ? '#c89d66' : '#222',
                        color: currentStep >= 2 ? '#000' : '#666',
                        fontWeight: 'bold'
                      }}
                    >
                      2
                    </div>
                    <div style={{ fontSize: '0.74rem', color: currentStep >= 2 ? '#fff' : '#666', fontWeight: '600' }}>
                      Atelier Prep
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#888' }}>Quality Check</div>
                  </div>

                  {/* Step 3 */}
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        margin: '0 auto 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: currentStep >= 3 ? '#c89d66' : '#222',
                        color: currentStep >= 3 ? '#000' : '#666',
                        fontWeight: 'bold'
                      }}
                    >
                      3
                    </div>
                    <div style={{ fontSize: '0.74rem', color: currentStep >= 3 ? '#fff' : '#666', fontWeight: '600' }}>
                      Dispatched
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#888' }}>DHL Express</div>
                  </div>

                  {/* Step 4 */}
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        margin: '0 auto 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: currentStep >= 4 ? '#c89d66' : '#222',
                        color: currentStep >= 4 ? '#000' : '#666',
                        fontWeight: 'bold'
                      }}
                    >
                      4
                    </div>
                    <div style={{ fontSize: '0.74rem', color: currentStep >= 4 ? '#fff' : '#666', fontWeight: '600' }}>
                      Delivered
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#888' }}>Destination</div>
                  </div>

                </div>
              </div>

              {/* Tracking Notes */}
              {searchedOrder.tracking_notes && (
                <div style={{ background: '#181818', padding: '1rem 1.4rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <Truck size={18} color="#c89d66" />
                  <div style={{ fontSize: '0.84rem', color: '#ded9cf' }}>
                    <strong>Latest Atelier Update:</strong> {searchedOrder.tracking_notes}
                  </div>
                </div>
              )}

              {/* Items in this Order */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                <div className="luxury-eyebrow" style={{ marginBottom: '1rem' }}>
                  GARMENTS IN THIS ORDER
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {searchedOrder.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161616', padding: '0.8rem 1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {item.image && (
                          <img src={item.image} alt={item.title} style={{ width: '45px', height: '55px', objectFit: 'cover' }} />
                        )}
                        <div>
                          <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: '500' }}>{item.title}</div>
                          <div style={{ fontSize: '0.74rem', color: '#888' }}>
                            Size: {item.selectedSize || 'M'} • Color: {item.selectedColor || 'Original'} • Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-serif)', color: '#c89d66', fontSize: '1rem', fontWeight: '600' }}>
                        {formatPrice(item.price * item.quantity, currency)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>Total Amount</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', fontWeight: '600' }}>
                    {formatPrice(searchedOrder.total_amount, currency)}
                  </span>
                </div>
              </div>
            </div>
          ) : hasSearched ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Package size={40} color="#666" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '0.4rem' }}>
                No Order Found
              </h4>
              <p style={{ color: '#888', fontSize: '0.85rem' }}>
                Please check the spelling of your Order Reference Number or Email Address.
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888', fontSize: '0.88rem' }}>
              Enter your Order Reference Number above to track real-time atelier progress and DHL dispatch status.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
