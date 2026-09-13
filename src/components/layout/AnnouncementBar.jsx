import React from 'react';
import { useShop } from '../../context/ShopContext';
import { BRAND_INFO } from '../../data/initialProducts';
import { MessageSquare, Send } from 'lucide-react';

export default function AnnouncementBar() {
  const { openQuoteModal } = useShop();

  return (
    <div className="zegna-top-bar">
      {/* Left: B2B Atelier Announcement */}
      <div className="announcement-message">
        <span>GLOBAL B2B WHOLESALE & BESPOKE ATELIER MANUFACTURING — </span>
        <a 
          href={BRAND_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: '#fff', fontWeight: '600' }}
        >
          SIALKOT EXPORT DESK
        </a>
      </div>

      {/* Right: B2B Direct Inquiry Actions */}
      <div className="announcement-tools" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <button
          onClick={() => openQuoteModal()}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#ffffff', 
            cursor: 'pointer', 
            textTransform: 'uppercase', 
            fontSize: '0.72rem', 
            letterSpacing: '0.08em', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Send size={12} />
          <span>Request a Quote</span>
        </button>

        <span>|</span>

        <a 
          href={BRAND_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            color: '#ffffff', 
            textDecoration: 'none', 
            fontSize: '0.72rem', 
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <MessageSquare size={12} />
          <span>WhatsApp: {BRAND_INFO.phone}</span>
        </a>
      </div>
    </div>
  );
}
