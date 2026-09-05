import React from 'react';
import { BRAND_INFO } from '../../data/initialProducts';
import { MessageSquare, Mail, CheckCircle } from 'lucide-react';

export default function BespokeConcierge() {
  return (
    <section style={{ padding: '6rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #e5e5e5' }}>
      <div className="container-zegna">
        <div 
          style={{
            backgroundColor: '#f7f7f7',
            border: '1px solid #e5e5e5',
            padding: '4.5rem 3.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', marginBottom: '0.6rem', fontWeight: '600' }}>
              BESPOKE COMMISSIONS
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#000000', fontWeight: '400', lineHeight: 1.15, marginBottom: '1.2rem' }}>
              Made-to-Measure Consultation
            </h2>
            <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Seeking an exacting custom jacket cut to your individual measurements, a bespoke textile blend, or personalized monogramming? Our master patternmakers are at your service.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#222' }}>
                <CheckCircle size={16} color="#000" />
                <span>Virtual Measurement Guidance with Atelier Tailor</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#222' }}>
                <CheckCircle size={16} color="#000" />
                <span>Choice of 18 Hand-Waxed Leather & Suede Hues</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#222' }}>
                <CheckCircle size={16} color="#000" />
                <span>Custom Interior Cupro Monogram Initials</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <a 
                href={BRAND_INFO.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-zegna-primary"
              >
                <MessageSquare size={16} />
                Connect on WhatsApp ({BRAND_INFO.phone})
              </a>
              <a 
                href={`mailto:${BRAND_INFO.email}?subject=Bespoke%20Made-to-Measure%20Inquiry%20-%20Festa%20Munich`}
                className="btn-zegna-outline"
              >
                <Mail size={16} />
                Email Atelier
              </a>
            </div>
          </div>

          {/* Right Info Box */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}
          >
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#000000' }}>
              Direct Atelier Contacts
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <div style={{ color: '#777', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Atelier Address
                </div>
                <div style={{ color: '#000', fontWeight: '500', marginTop: '0.2rem' }}>{BRAND_INFO.address}</div>
              </div>

              <div>
                <div style={{ color: '#777', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Official Email
                </div>
                <div style={{ color: '#000', fontWeight: '500', marginTop: '0.2rem' }}>{BRAND_INFO.email}</div>
              </div>

              <div>
                <div style={{ color: '#777', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  WhatsApp / Phone
                </div>
                <div style={{ color: '#000', fontWeight: '500', marginTop: '0.2rem' }}>{BRAND_INFO.phone} / {BRAND_INFO.whatsapp}</div>
              </div>

              <div>
                <div style={{ color: '#777', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Atelier Hours
                </div>
                <div style={{ color: '#000', fontWeight: '500', marginTop: '0.2rem' }}>Monday – Saturday: 09:00 - 19:00 PKT</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
