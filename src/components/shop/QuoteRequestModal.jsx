import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { BRAND_INFO } from '../../data/initialProducts';
import { X, Send, MessageSquare, CheckCircle2, Building, User, Mail, Phone, Layers, ShieldCheck } from 'lucide-react';

export default function QuoteRequestModal() {
  const { 
    isQuoteModalOpen, 
    setIsQuoteModalOpen, 
    quoteProduct, 
    setQuoteProduct,
    submitInquiry,
    currentUser
  } = useShop();

  const [formData, setFormData] = useState({
    buyerName: '',
    companyName: '',
    phone: '',
    email: '',
    quantity: '20 - 50 Pcs (Wholesale MOQ)',
    customQuantity: '',
    sizesRequired: '',
    customSpecs: '',
    preferredContact: 'WhatsApp'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        buyerName: currentUser.name || prev.buyerName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone
      }));
    }
  }, [currentUser]);

  if (!isQuoteModalOpen) return null;

  const handleClose = () => {
    setIsQuoteModalOpen(false);
    setSubmittedSuccess(false);
    setQuoteProduct(null);
  };

  const finalQuantity = formData.quantity === 'Custom' ? (formData.customQuantity || 'Custom MOQ') : formData.quantity;
  const productTitle = quoteProduct ? quoteProduct.title : 'Consolidated Bulk Manufacturing Inquiry';

  const generateWhatsAppMessage = () => {
    const text = `*FESTA MUNICH — WHOLESALE / BULK INQUIRY*
----------------------------------
*Buyer:* ${formData.buyerName || 'Valued Client'}
*Company:* ${formData.companyName || 'Private Label / Boutique'}
*Phone:* ${formData.phone || 'N/A'}
*Email:* ${formData.email || 'N/A'}

*Garment of Interest:* ${productTitle}
${quoteProduct ? `*Reference ID:* ${quoteProduct.id}\n*Category:* ${quoteProduct.category}\n*Material:* ${quoteProduct.material || 'Genuine Hide / Wool'}` : ''}

*Target Order Quantity:* ${finalQuantity}
${formData.sizesRequired ? `*Sizes Breakdown:* ${formData.sizesRequired}\n` : ''}*Custom Specs / Requirements:*
${formData.customSpecs || 'Requesting wholesale price list, sample turnaround time, and factory export terms.'}
----------------------------------
Inquiry generated from festamunich.com`;

    return `https://wa.me/923277551063?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e, alsoOpenWhatsApp = false) => {
    if (e) e.preventDefault();
    if (!formData.buyerName.trim() || !formData.phone.trim()) {
      alert('Please provide your Name and WhatsApp / Phone number so our export team can contact you.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        buyerName: formData.buyerName,
        companyName: formData.companyName,
        phone: formData.phone,
        email: formData.email,
        quantity: finalQuantity,
        sizesRequired: formData.sizesRequired,
        productTitle: productTitle,
        productId: quoteProduct?.id || null,
        customSpecs: formData.customSpecs,
        preferredContact: formData.preferredContact
      });

      setSubmittedSuccess(true);

      if (alsoOpenWhatsApp) {
        window.open(generateWhatsAppMessage(), '_blank');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 2200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={handleClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '2px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '1.8rem 2.2rem',
            borderBottom: '1px solid #eeeeee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: '#fafafa'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777777', fontWeight: '600', marginBottom: '0.3rem' }}>
              ATELIER EXPORT & B2B MANUFACTURING
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', color: '#000000', margin: 0, fontWeight: '400' }}>
              Request Wholesale Quotation
            </h2>
          </div>

          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: '#444' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '2rem 2.2rem' }}>
          {submittedSuccess ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#16a34a' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#000', marginBottom: '0.8rem', fontWeight: '400' }}>
                Quotation Request Received
              </h3>
              <p style={{ color: '#555', fontSize: '0.92rem', maxWidth: '460px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                Thank you, <strong>{formData.buyerName}</strong>. Our export desk in Sialkot has received your inquiry for <strong>{productTitle}</strong>. We will review production schedules, material availability, and contact you within 24 hours.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-zegna-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 1.6rem' }}
                >
                  <MessageSquare size={16} />
                  <span>Chat Direct on WhatsApp</span>
                </a>
                <button
                  onClick={handleClose}
                  className="btn-zegna-outline"
                  style={{ padding: '0.9rem 1.6rem' }}
                >
                  Back to Catalog
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => handleSubmit(e, false)}>
              {/* Product Spotlight Banner if inquiring for specific product */}
              {quoteProduct && (
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    background: '#f8f8f8',
                    padding: '1rem 1.2rem',
                    marginBottom: '1.8rem',
                    border: '1px solid #ebebeb'
                  }}
                >
                  <img 
                    src={quoteProduct.images?.[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300&auto=format&fit=crop'} 
                    alt={quoteProduct.title}
                    style={{ width: '60px', height: '60px', objectFit: 'contain', objectPosition: 'center', background: '#fff' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>
                      {quoteProduct.category || 'Atelier Garment'}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '1rem', color: '#000' }}>
                      {quoteProduct.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#666', fontStyle: 'italic' }}>
                      {quoteProduct.material || 'Bespoke specification'}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label className="form-label">
                    Full Name / Buyer Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g., Alexander Weber"
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">
                    Company / Brand / Store Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Munich Leather Goods GmbH"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label className="form-label">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="+49 / +92 3XX XXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="buyer@brand.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Order Volume / Quantity */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label className="form-label">
                  Estimated Order Volume / MOQ
                </label>
                <select
                  className="form-input"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <option value="Sample Order (1 - 5 Pcs)">Sample Prototype (1 - 5 Pcs)</option>
                  <option value="20 - 50 Pcs (Wholesale MOQ)">20 - 50 Pcs (Low MOQ Wholesale)</option>
                  <option value="50 - 150 Pcs (Commercial Production)">50 - 150 Pcs (Commercial Run)</option>
                  <option value="200 - 500 Pcs (Volume Export)">200 - 500 Pcs (High Volume Export)</option>
                  <option value="500+ Pcs (Container / Chain Store)">500+ Pcs (Large Contract Manufacturing)</option>
                  <option value="Custom">Custom Quantity / Discussion</option>
                </select>

                {formData.quantity === 'Custom' && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter target quantity (e.g. 75 pcs)"
                    value={formData.customQuantity}
                    onChange={(e) => setFormData({ ...formData, customQuantity: e.target.value })}
                    style={{ marginTop: '0.6rem' }}
                  />
                )}
              </div>

              {/* Sizes Required */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label className="form-label">
                  Sizes Breakdown / Sizing Standard (Optional)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. European Sizing (30% M, 40% L, 30% XL) or Custom Tech Pack"
                  value={formData.sizesRequired}
                  onChange={(e) => setFormData({ ...formData, sizesRequired: e.target.value })}
                />
              </div>

              {/* Custom specs & notes */}
              <div style={{ marginBottom: '1.8rem' }}>
                <label className="form-label">
                  Custom Branding & Technical Specifications
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Describe your requirements: Custom leather thickness, embossed logos, silk lining, custom hardware finish, target delivery date..."
                  value={formData.customSpecs}
                  onChange={(e) => setFormData({ ...formData, customSpecs: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting}
                  className="btn-zegna-primary"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem', 
                    padding: '1rem 1.4rem' 
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Send via WhatsApp ({BRAND_INFO.phone})</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-zegna-outline"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem', 
                    padding: '1rem 1.4rem' 
                  }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Quote Request'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.2rem', color: '#777', fontSize: '0.74rem' }}>
                <ShieldCheck size={14} color="#555" />
                <span>Direct Sialkot Atelier Manufacturer — Zero Middleman Markups — Strict Confidentiality</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
