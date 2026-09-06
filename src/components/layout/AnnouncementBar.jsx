import React from 'react';
import { useShop } from '../../context/ShopContext';
import { BRAND_INFO } from '../../data/initialProducts';

export default function AnnouncementBar() {
  const { currency, setCurrency, setIsOrderTrackingOpen } = useShop();

  return (
    <div className="zegna-top-bar">
      {/* Left: Headline Announcement */}
      <div className="announcement-message">
        <span>ELEVATE YOUR SHOPPING EXPERIENCE. </span>
        <a 
          href={BRAND_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: '#fff' }}
        >
          INQUIRE ATELIER TODAY.
        </a>
      </div>

      {/* Right: Order tracking and currency selector */}
      <div className="announcement-tools" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button
          onClick={() => setIsOrderTrackingOpen(true)}
          style={{ textTransform: 'uppercase' }}
        >
          TRACK ORDER
        </button>

        <span>|</span>

        {/* Currency & Region Selector */}
        <div className="announcement-region" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>REST OF THE WORLD - {currency}</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              padding: 0,
              textDecoration: 'underline'
            }}
          >
            <option value="USD" style={{ background: '#000', color: '#fff' }}>CHANGE (USD $)</option>
            <option value="EUR" style={{ background: '#000', color: '#fff' }}>CHANGE (EUR €)</option>
            <option value="GBP" style={{ background: '#000', color: '#fff' }}>CHANGE (GBP £)</option>
            <option value="PKR" style={{ background: '#000', color: '#fff' }}>CHANGE (PKR Rs.)</option>
          </select>
        </div>

      </div>
    </div>
  );
}
