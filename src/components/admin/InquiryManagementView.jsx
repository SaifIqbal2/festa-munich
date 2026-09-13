import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatDate } from '../../utils/helpers';
import { 
  Search, 
  MessageSquare, 
  Mail, 
  Building, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  FileText,
  User,
  Filter,
  Phone
} from 'lucide-react';

export default function InquiryManagementView() {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useShop();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    const query = search.toLowerCase();
    const matchesSearch = 
      !search ||
      inq.buyer_name?.toLowerCase().includes(query) ||
      inq.company_name?.toLowerCase().includes(query) ||
      inq.phone?.toLowerCase().includes(query) ||
      inq.email?.toLowerCase().includes(query) ||
      inq.product_title?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const getCleanPhone = (phoneStr) => {
    if (!phoneStr) return '';
    return phoneStr.replace(/[^\d+]/g, '');
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'New':
        return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
      case 'Contacted':
        return { background: '#fefce8', color: '#854d0e', border: '1px solid #fef08a' };
      case 'Quoted':
        return { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
      case 'Sample Sent':
        return { background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff' };
      case 'Closed':
        return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
      default:
        return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Top Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '400', fontFamily: 'var(--font-serif)', margin: '0 0 0.5rem 0' }}>
            Wholesale RFQ & Inquiries
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
            Track and respond to international buyers, bespoke private label inquiries, and bulk production orders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            Total Inquiries: <strong>{inquiries.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
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
            placeholder="Search by buyer name, company, phone, garment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem', border: '1px solid #ddd', outline: 'none', fontSize: '0.88rem' }}
          />
          <Search size={16} color="#888" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div style={{ minWidth: '180px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid #ddd', outline: 'none', fontSize: '0.88rem', backgroundColor: '#fff' }}
          >
            <option value="All">All Statuses ({inquiries.length})</option>
            <option value="New">New ({inquiries.filter(i => i.status === 'New').length})</option>
            <option value="Contacted">Contacted ({inquiries.filter(i => i.status === 'Contacted').length})</option>
            <option value="Quoted">Quoted ({inquiries.filter(i => i.status === 'Quoted').length})</option>
            <option value="Sample Sent">Sample Sent ({inquiries.filter(i => i.status === 'Sample Sent').length})</option>
            <option value="Closed">Closed ({inquiries.filter(i => i.status === 'Closed').length})</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eaeaea', background: '#fbfbfb', color: '#555' }}>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Date</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Buyer & Company</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Contact (Direct Action)</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Target Garment / Order</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>MOQ Volume</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '4rem 1rem', color: '#888' }}>
                  <FileText size={32} color="#ccc" style={{ marginBottom: '0.5rem' }} />
                  <div>No quotation requests found matching this filter.</div>
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inq) => {
                const cleanPhone = getCleanPhone(inq.phone);
                const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}?text=Hello%20${encodeURIComponent(inq.buyer_name || 'there')},%20this%20is%20Festa%20Munich%20Atelier%20regarding%20your%20wholesale%20inquiry.` : null;

                return (
                  <tr key={inq.id} style={{ borderBottom: '1px solid #f2f2f2', transition: 'background 0.15s ease' }}>
                    {/* Date */}
                    <td style={{ padding: '1rem 1.2rem', color: '#666', whiteSpace: 'nowrap' }}>
                      {formatDate(inq.created_at)}
                    </td>

                    {/* Buyer & Company */}
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ fontWeight: '600', color: '#000', fontSize: '0.9rem' }}>
                        {inq.buyer_name || inq.buyerName || 'Valued Buyer'}
                      </div>
                      {(inq.company_name || inq.companyName) && (
                        <div style={{ color: '#666', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                          <Building size={12} />
                          <span>{inq.company_name || inq.companyName}</span>
                        </div>
                      )}
                    </td>

                    {/* Contact Actions */}
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: '#25D366',
                              color: '#fff',
                              padding: '0.35rem 0.7rem',
                              borderRadius: '4px',
                              fontSize: '0.76rem',
                              fontWeight: '600',
                              textDecoration: 'none'
                            }}
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp</span>
                          </a>
                        ) : null}

                        {inq.email && (
                          <a
                            href={`mailto:${inq.email}?subject=Festa%20Munich%20Wholesale%20Quotation%20-%20${encodeURIComponent(inq.product_title || 'Atelier Inquiry')}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: '#f0f0f0',
                              color: '#333',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '4px',
                              fontSize: '0.76rem',
                              textDecoration: 'none'
                            }}
                            title={inq.email}
                          >
                            <Mail size={13} />
                            <span>Email</span>
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '0.3rem' }}>
                        {inq.phone}
                      </div>
                    </td>

                    {/* Garment Title */}
                    <td style={{ padding: '1rem 1.2rem', maxWidth: '240px' }}>
                      <div style={{ fontWeight: '500', color: '#000' }}>
                        {inq.product_title || inq.productTitle || 'Bulk Custom Order'}
                      </div>
                      {(inq.custom_specs || inq.customSpecs) && (
                        <div style={{ fontSize: '0.75rem', color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.2rem' }}>
                          Specs: {inq.custom_specs || inq.customSpecs}
                        </div>
                      )}
                    </td>

                    {/* Quantity */}
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600', color: '#111' }}>
                      {inq.quantity || 'Wholesale'}
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <select
                        value={inq.status || 'New'}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                        style={{
                          ...getStatusBadgeStyle(inq.status || 'New'),
                          borderRadius: '12px',
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Sample Sent">Sample Sent</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: '0.4rem' }}
                          title="View Full Inquiry Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete quotation request from "${inq.buyer_name || 'this buyer'}"?`)) {
                              deleteInquiry(inq.id);
                            }
                          }}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.4rem' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setSelectedInquiry(null)}
        >
          <div 
            style={{
              background: '#fff',
              maxWidth: '560px',
              width: '100%',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>
                  Wholesale Inquiry Details
                </div>
                <h3 style={{ margin: '0.2rem 0 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
                  {selectedInquiry.buyer_name || selectedInquiry.buyerName}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Company / Store:</strong>
                <div>{selectedInquiry.company_name || selectedInquiry.companyName || 'Not specified'}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone / WhatsApp:</strong>
                  <div>{selectedInquiry.phone || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email:</strong>
                  <div>{selectedInquiry.email || 'N/A'}</div>
                </div>
              </div>

              <div>
                <strong style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Garment / Selection:</strong>
                <div style={{ fontWeight: '600' }}>{selectedInquiry.product_title || selectedInquiry.productTitle}</div>
              </div>

              <div>
                <strong style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Target Order Volume:</strong>
                <div>{selectedInquiry.quantity || 'Wholesale'}</div>
              </div>

              {selectedInquiry.sizesRequired && (
                <div>
                  <strong style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Sizes Breakdown:</strong>
                  <div>{selectedInquiry.sizesRequired}</div>
                </div>
              )}

              <div>
                <strong style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Custom Specifications / Requirements:</strong>
                <div style={{ background: '#f8f8f8', padding: '1rem', border: '1px solid #eaeaea', marginTop: '0.4rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {selectedInquiry.custom_specs || selectedInquiry.customSpecs || selectedInquiry.message || 'No additional specifications provided.'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.8rem', display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="btn-zegna-outline"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
