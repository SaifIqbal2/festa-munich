import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice, validateFormData, validateEmail, validatePhone, validatePostalCode } from '../../utils/helpers';
import { BRAND_INFO } from '../../data/initialProducts';
import confetti from 'canvas-confetti';
import { X, CheckCircle, ArrowRight, MessageSquare, Package, AlertCircle } from 'lucide-react';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    currency, 
    createOrder,
    setIsOrderTrackingOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    appliedGiftCard,
    applyGiftCard,
    removeGiftCard,
    discountAmount,
    cartTotal
  } = useShop();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [couponInput, setCouponInput] = useState('');
  const [giftCardInput, setGiftCardInput] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    postalCode: '',
    paymentMethod: 'Cash on Delivery (COD)',
    specialInstructions: ''
  });

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const validation = validateFormData(formData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    setFormErrors({});
    setStep(2);
  };

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleApplyGiftCard = () => {
    if (giftCardInput.trim()) {
      applyGiftCard(giftCardInput.trim());
      setGiftCardInput('');
    }
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          specialInstructions: formData.specialInstructions
        },
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: Number(item.price),
          quantity: Number(item.quantity),
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.image
        })),
        subtotal: Number(cartSubtotal),
        discount_applied: Number(discountAmount),
        total_amount: Number(cartTotal),
        currency: currency,
        payment_method: formData.paymentMethod,
        notes: [
          appliedCoupon && `Coupon applied: ${appliedCoupon.code}`,
          appliedGiftCard && `Gift card applied: ${appliedGiftCard.code}`
        ].filter(Boolean).join('; ') || null
      };

      const placedOrder = await createOrder(orderPayload);
      if (!placedOrder) {
        throw new Error('Order could not be saved to the database.');
      }
      setConfirmedOrder(placedOrder);
      setStep(3);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#000000', '#c89d66', '#ffffff']
      });
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={() => setIsCheckoutOpen(false)}
      style={{ padding: '1rem' }}
    >
      <div 
        className="animate-slide-up"
        style={{
          backgroundColor: '#ffffff',
          maxWidth: '860px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.8rem 2.2rem',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777', fontWeight: '600' }}>
              CHECKOUT
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#000', marginTop: '0.2rem' }}>
              {step === 3 ? 'Order Confirmed' : 'Secure Atelier Checkout'}
            </h3>
          </div>
          <button 
            onClick={() => setIsCheckoutOpen(false)}
            style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Step 1: Shipping Details */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} style={{ padding: '2.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#000', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                  1. Contact & Shipping Address
                </h4>

                <div>
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    required 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="e.g. Alexander Sinclair" 
                    className="form-input"
                    style={{ borderColor: formErrors.fullName ? '#dc2626' : undefined }}
                  />
                  {formErrors.fullName && (
                    <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={12} />
                      {formErrors.fullName}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="client@domain.com" 
                      className="form-input"
                      style={{ borderColor: formErrors.email ? '#dc2626' : undefined }}
                    />
                    {formErrors.email && (
                      <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertCircle size={12} />
                        {formErrors.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+92 300 1234567" 
                      className="form-input"
                      style={{ borderColor: formErrors.phone ? '#dc2626' : undefined }}
                    />
                    {formErrors.phone && (
                      <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertCircle size={12} />
                        {formErrors.phone}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label">Delivery Street Address *</label>
                  <input 
                    type="text" 
                    name="address" 
                    required 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="Street Address, Suite / Apartment #" 
                    className="form-input"
                    style={{ borderColor: formErrors.address ? '#dc2626' : undefined }}
                  />
                  {formErrors.address && (
                    <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={12} />
                      {formErrors.address}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label className="form-label">City *</label>
                    <input 
                      type="text" 
                      name="city" 
                      required 
                      value={formData.city} 
                      onChange={handleChange} 
                      placeholder="e.g. Lahore / Sialkot" 
                      className="form-input"
                      style={{ borderColor: formErrors.city ? '#dc2626' : undefined }}
                    />
                    {formErrors.city && (
                      <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertCircle size={12} />
                        {formErrors.city}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Country *</label>
                    <input 
                      type="text" 
                      name="country" 
                      required 
                      value={formData.country} 
                      onChange={handleChange} 
                      className="form-input"
                      style={{ borderColor: formErrors.country ? '#dc2626' : undefined }}
                    />
                    {formErrors.country && (
                      <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertCircle size={12} />
                        {formErrors.country}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label">Postal Code / ZIP *</label>
                  <input 
                    type="text" 
                    name="postalCode" 
                    required 
                    value={formData.postalCode} 
                    onChange={handleChange} 
                    placeholder="e.g. 54000 or M5V 3A8" 
                    className="form-input"
                    style={{ borderColor: formErrors.postalCode ? '#dc2626' : undefined }}
                  />
                  {formErrors.postalCode && (
                    <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={12} />
                      {formErrors.postalCode}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ backgroundColor: '#fafafa', padding: '1.8rem', border: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#000', marginBottom: '1rem' }}>
                    Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)})
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.2rem' }}>
                    {cart.map((item) => (
                      <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                        <div>
                          <div style={{ color: '#000', fontWeight: '500' }}>{item.title}</div>
                          <div style={{ color: '#777', fontSize: '0.76rem' }}>
                            {item.selectedSize} • {item.selectedColor} (x{item.quantity})
                          </div>
                        </div>
                        <div style={{ fontWeight: '600', color: '#000' }}>
                          {formatPrice(item.price * item.quantity, currency)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(cartSubtotal, currency)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                      <span>Express Shipping</span>
                      <span style={{ color: '#000', fontWeight: '600' }}>COMPLIMENTARY</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: '600' }}>
                        <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                        <span>-{formatPrice(discountAmount, currency)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#000', fontWeight: '700', fontSize: '1.15rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #ddd' }}>
                      <span>Total</span>
                      <span>{formatPrice(cartTotal, currency)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-zegna-primary" style={{ width: '100%' }}>
                    Continue to Payment
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div style={{ padding: '2.5rem' }}>
            <div style={{ maxWidth: '560px', margin: '0 auto' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#000', marginBottom: '1.2rem' }}>
                2. Select Payment Method
              </h4>

              {/* Coupon Code Input */}
              {!appliedCoupon && (
                <div style={{ background: '#fafafa', padding: '1.2rem', borderRadius: '6px', marginBottom: '2rem', border: '1px solid #e5e5e5' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.6rem', color: '#000' }}>
                    Have a discount code?
                  </label>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <input 
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyCoupon();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '0.6rem 0.9rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-sans)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                    Try: WELCOME10, SUMMER20, or VIPEXCLUSIVE
                  </div>
                </div>
              )}

              {appliedCoupon && (
                <div style={{ background: '#d1fae5', padding: '1.2rem', borderRadius: '6px', marginBottom: '2rem', border: '1px solid #6ee7b7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#059669' }}>
                      ✓ Coupon Applied: {appliedCoupon.code}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#065f46', marginTop: '0.3rem' }}>
                      Saving: {formatPrice(discountAmount, currency)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCoupon()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {!appliedGiftCard && (
                <div style={{ background: '#fafafa', padding: '1.2rem', borderRadius: '6px', marginBottom: '2rem', border: '1px solid #e5e5e5' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.6rem', color: '#000' }}>
                    Have a gift card?
                  </label>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <input
                      type="text"
                      placeholder="Enter gift card code"
                      value={giftCardInput}
                      onChange={(e) => setGiftCardInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleApplyGiftCard();
                      }}
                      style={{ flex: 1, padding: '0.6rem 0.9rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', fontFamily: 'var(--font-sans)' }}
                    />
                    <button type="button" onClick={handleApplyGiftCard} style={{ padding: '0.6rem 1.2rem', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {appliedGiftCard && (
                <div style={{ background: '#dbeafe', padding: '1.2rem', borderRadius: '6px', marginBottom: '2rem', border: '1px solid #93c5fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1d4ed8' }}>
                      Gift Card Applied: {appliedGiftCard.code}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: '0.3rem' }}>
                      Saving: {formatPrice(discountAmount, currency)}
                    </div>
                  </div>
                  <button type="button" onClick={removeGiftCard} style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', fontWeight: '600' }}>
                    Remove
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.2rem',
                    background: formData.paymentMethod === 'Cash on Delivery (COD)' ? '#fafafa' : '#fff',
                    border: `1px solid ${formData.paymentMethod === 'Cash on Delivery (COD)' ? '#000' : '#ddd'}`,
                    cursor: 'pointer'
                  }}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Cash on Delivery (COD)" 
                    checked={formData.paymentMethod === 'Cash on Delivery (COD)'} 
                    onChange={handleChange}
                    style={{ accentColor: '#000' }}
                  />
                  <div>
                    <div style={{ color: '#000', fontWeight: '600', fontSize: '0.92rem' }}>Cash on Delivery / Handover</div>
                    <div style={{ color: '#777', fontSize: '0.78rem' }}>Inspect upon delivery. Pay cash to courier partner.</div>
                  </div>
                </label>

                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.2rem',
                    background: formData.paymentMethod === 'Direct Atelier Bank Wire' ? '#fafafa' : '#fff',
                    border: `1px solid ${formData.paymentMethod === 'Direct Atelier Bank Wire' ? '#000' : '#ddd'}`,
                    cursor: 'pointer'
                  }}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Direct Atelier Bank Wire" 
                    checked={formData.paymentMethod === 'Direct Atelier Bank Wire'} 
                    onChange={handleChange}
                    style={{ accentColor: '#000' }}
                  />
                  <div>
                    <div style={{ color: '#000', fontWeight: '600', fontSize: '0.92rem' }}>Direct Bank Wire (IBAN / Raast)</div>
                    <div style={{ color: '#777', fontSize: '0.78rem' }}>Transfer via official Festa Munich IBAN account.</div>
                  </div>
                </label>

                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.2rem',
                    background: formData.paymentMethod === 'WhatsApp Concierge Invoice' ? '#fafafa' : '#fff',
                    border: `1px solid ${formData.paymentMethod === 'WhatsApp Concierge Invoice' ? '#000' : '#ddd'}`,
                    cursor: 'pointer'
                  }}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="WhatsApp Concierge Invoice" 
                    checked={formData.paymentMethod === 'WhatsApp Concierge Invoice'} 
                    onChange={handleChange}
                    style={{ accentColor: '#000' }}
                  />
                  <div>
                    <div style={{ color: '#000', fontWeight: '600', fontSize: '0.92rem' }}>WhatsApp Assisted Payment Link</div>
                    <div style={{ color: '#777', fontSize: '0.78rem' }}>Receive instant private payment link on WhatsApp.</div>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setStep(1)} className="btn-zegna-outline" style={{ flex: 1 }}>
                  Back
                </button>
                <button type="button" onClick={handleCompleteOrder} disabled={isSubmitting} className="btn-zegna-primary" style={{ flex: 2 }}>
                  {isSubmitting ? 'Confirming...' : `Confirm Order (${formatPrice(cartSubtotal, currency)})`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && confirmedOrder && (
          <div style={{ padding: '4rem 2.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <CheckCircle size={48} color="#000000" style={{ margin: '0 auto 1.5rem' }} />

            <div style={{ fontSize: '0.74rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', fontWeight: '700', marginBottom: '0.4rem' }}>
              ORDER RESERVED
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#000', marginBottom: '0.6rem' }}>
              Thank You, {confirmedOrder.customer_name}
            </h3>

            <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your order has been registered at the atelier. Your order reference is:
            </p>

            <div 
              style={{
                background: '#fafafa',
                border: '1px solid #000',
                padding: '1.2rem',
                fontSize: '1.6rem',
                fontWeight: '700',
                letterSpacing: '0.15em',
                color: '#000',
                marginBottom: '2.5rem'
              }}
            >
              {confirmedOrder.order_number}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsOrderTrackingOpen(true);
                }}
                className="btn-zegna-primary"
                style={{ width: '100%' }}
              >
                <Package size={16} />
                Track Order Live
              </button>

              <a
                href={`https://wa.me/923277551063?text=Hello%20Festa%20Munich,%20I%20just%20placed%20Order%20%23${confirmedOrder.order_number}%20for%20${confirmedOrder.customer_name}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-zegna-outline"
                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <MessageSquare size={16} />
                Contact Atelier on WhatsApp
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
