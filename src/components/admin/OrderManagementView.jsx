import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice, formatDate } from '../../utils/helpers';
import { Search, Package, CheckCircle2, Clock, Truck, XCircle, AlertCircle, Phone, Mail, MapPin, Edit3 } from 'lucide-react';

export default function OrderManagementView() {
  const { orders, updateOrderStatus, currency } = useShop();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrderForNotes, setSelectedOrderForNotes] = useState(null);
  const [newTrackingNotes, setNewTrackingNotes] = useState('');

  const filtered = orders.filter(ord => {
    const matchStatus = statusFilter === 'All' || ord.status === statusFilter;
    const matchSearch = 
      !search ||
      ord.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer_email?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    if (selectedOrderForNotes) {
      updateOrderStatus(selectedOrderForNotes.id || selectedOrderForNotes.order_number, selectedOrderForNotes.status, newTrackingNotes);
      setSelectedOrderForNotes(null);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
      case 'Processing':
        return { background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd' };
      case 'Shipped':
        return { background: '#f3e8ff', color: '#9333ea', border: '1px solid #e9d5ff' };
      case 'Delivered':
        return { background: '#d1fae5', color: '#059669', border: '1px solid #a7f3d0' };
      case 'Cancelled':
        return { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' };
      default:
        return { background: '#f5f5f5', color: '#333' };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '400', fontFamily: 'var(--font-serif)', margin: '0 0 0.5rem 0' }}>
          Customer Orders Manager
        </h2>
        <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
          Track orders in real time, update dispatch statuses, add courier tracking notes, and inspect client garments.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div 
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          background: '#fff',
          padding: '1rem',
          border: '1px solid #eaeaea',
          borderRadius: '6px'
        }}
      >
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem', border: '1px solid #ddd', outline: 'none', fontSize: '0.9rem' }}
          />
          <Search size={16} color="#888" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div style={{ minWidth: '180px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid #ddd', outline: 'none', fontSize: '0.9rem', backgroundColor: '#fff' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing (Atelier Prep)</option>
            <option value="Shipped">Shipped (DHL Express)</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List Cards */}
      {filtered.length === 0 ? (
        <div style={{ padding: '4rem 1rem', textAlign: 'center', background: '#fbfbfb', border: '1px dashed #ddd', borderRadius: '8px' }}>
          <Package size={40} color="#ccc" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ color: '#555', fontSize: '1.1rem', marginBottom: '0.3rem' }}>No orders found</h4>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>Try adjusting your search criteria or status filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.map((ord) => (
            <div 
              key={ord.id || ord.order_number}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #eaeaea',
                borderRadius: '8px',
                padding: '1.5rem 1.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}
            >
              {/* Order Card Header */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#000', fontWeight: '600' }}>
                      #{ord.order_number}
                    </span>
                    <span 
                      style={{
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        borderRadius: '12px',
                        ...getStatusBadgeStyle(ord.status)
                      }}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.4rem' }}>
                    Placed on: {formatDate(ord.created_at)} • Payment: <strong style={{ color: '#333' }}>{ord.payment_method || 'Standard'}</strong>
                  </div>
                </div>

                {/* Status Selector Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 500 }}>Update Status:</span>
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.id || ord.order_number, e.target.value)}
                    style={{
                      width: 'auto',
                      fontSize: '0.8rem',
                      padding: '0.4rem 0.8rem',
                      border: '1px solid #ddd',
                      background: '#fff',
                      outline: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Body: Customer details & Items */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                
                {/* Client & Address Info */}
                <div style={{ fontSize: '0.85rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                    Client & Destination
                  </div>
                  <div style={{ color: '#111', fontWeight: '600', fontSize: '1rem' }}>{ord.customer_name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={14} color="#666" />
                    <a href={`mailto:${ord.customer_email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{ord.customer_email}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} color="#666" />
                    <a href={`tel:${ord.customer_phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{ord.customer_phone}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.3rem' }}>
                    <MapPin size={14} color="#666" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                    <span>
                      {ord.shipping_address?.address}, {ord.shipping_address?.city}, {ord.shipping_address?.country} {ord.shipping_address?.postalCode}
                    </span>
                  </div>
                  {ord.shipping_address?.specialInstructions && (
                    <div style={{ fontStyle: 'italic', color: '#d97706', fontSize: '0.8rem', marginTop: '0.4rem', background: '#fef3c7', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                      Note: "{ord.shipping_address.specialInstructions}"
                    </div>
                  )}
                </div>

                {/* Items in this Order */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                    Ordered Garments
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {ord.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc', border: '1px solid #f0f0f0', padding: '0.6rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          {item.image && (
                            <img src={item.image} alt={item.title} style={{ width: '36px', height: '46px', objectFit: 'cover', borderRadius: '2px' }} />
                          )}
                          <div>
                            <div style={{ color: '#111', fontWeight: '500' }}>{item.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>
                              Size: {item.selectedSize || 'M'} | Color: {item.selectedColor || 'Black'} | Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-serif)', color: '#000', fontWeight: '600' }}>
                          {formatPrice(item.price * item.quantity, ord.currency || currency)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #eaeaea' }}>
                    <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>Total Amount</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#000', fontWeight: '600' }}>
                      {formatPrice(ord.total_amount, ord.currency || currency)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Tracking Notes / Dispatch Information */}
              <div 
                style={{
                  background: '#fcfcfc',
                  padding: '1rem',
                  border: '1px solid #eaeaea',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#555' }}>
                  <Truck size={16} color="#666" />
                  <span>
                    <strong>Tracking Notice for Customer:</strong> {ord.tracking_notes || 'No tracking remarks added yet.'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedOrderForNotes(ord);
                    setNewTrackingNotes(ord.tracking_notes || '');
                  }}
                  style={{ 
                    background: '#fff', border: '1px solid #ddd', padding: '0.4rem 0.8rem', 
                    fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px', 
                    display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#333'
                  }}
                >
                  <Edit3 size={14} />
                  Update Tracking Note
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tracking Note Edit Modal */}
      {selectedOrderForNotes && (
        <div className="modal-overlay" onClick={() => setSelectedOrderForNotes(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div 
            style={{
              backgroundColor: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#000', marginBottom: '0.5rem', fontWeight: 500 }}>
              Update Courier Tracking for #{selectedOrderForNotes.order_number}
            </h4>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              This message is visible to the client when they track their order on festamunich.com.
            </p>

            <form onSubmit={handleSaveNotes}>
              <textarea
                rows={4}
                value={newTrackingNotes}
                onChange={(e) => setNewTrackingNotes(e.target.value)}
                placeholder="e.g. Dispatched via DHL Express Airway Bill #DHL-9948201. Estimated arrival: 3 business days."
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: '1.2rem' }}
                autoFocus
              />

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setSelectedOrderForNotes(null)} style={{ flex: 1, padding: '0.8rem', background: '#f5f5f5', border: '1px solid #ddd', color: '#333', cursor: 'pointer', borderRadius: '4px', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 600 }}>
                  Save & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
