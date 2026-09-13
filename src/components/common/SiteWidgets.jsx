import React, { useState, useEffect } from 'react';

// WhatsApp floating button + Cookie Consent Banner
const WA_NUMBER = '923277551063';
const WA_MSG = encodeURIComponent('Hello Festa Munich! I am interested in your wholesale/bespoke garments. Please share more details.');

export default function SiteWidgets() {
  const [showCookie, setShowCookie] = useState(false);
  const [waVisible, setWaVisible] = useState(false);
  const [waTooltip, setWaTooltip] = useState(false);

  useEffect(() => {
    // Show cookie banner if not accepted
    const accepted = localStorage.getItem('fm_cookie_consent');
    if (!accepted) {
      setTimeout(() => setShowCookie(true), 2000);
    }

    // Show WhatsApp button after scroll or delay
    const timer = setTimeout(() => setWaVisible(true), 1500);
    const onScroll = () => setWaVisible(true);
    window.addEventListener('scroll', onScroll, { once: true });
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('fm_cookie_consent', 'true');
    setShowCookie(false);
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      {waVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '1.5rem',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.5rem'
          }}
        >
          {/* Tooltip */}
          {waTooltip && (
            <div style={{
              background: '#000',
              color: '#fff',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.2s ease'
            }}>
              Chat with us on WhatsApp
            </div>
          )}

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            onMouseEnter={() => setWaTooltip(true)}
            onMouseLeave={() => setWaTooltip(false)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.5)',
              textDecoration: 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              animation: 'waPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both'
            }}
            onMouseEnterCapture={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.6)'; }}
            onMouseLeaveCapture={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.5)'; }}
          >
            {/* WhatsApp SVG */}
            <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.002 3.2C9.008 3.2 3.2 8.992 3.2 16c0 2.256.592 4.384 1.632 6.224L3.2 28.8l6.736-1.6A12.72 12.72 0 0 0 16.002 28.8C23.008 28.8 28.8 23.008 28.8 16c0-7.008-5.792-12.8-12.798-12.8Zm0 23.04a10.96 10.96 0 0 1-5.6-1.536l-.4-.24-4 .944.992-3.888-.256-.4A10.944 10.944 0 0 1 5.056 16c0-6.032 4.912-10.944 10.96-10.944C22.048 5.056 26.944 9.968 26.944 16c-.016 6.048-4.928 10.24-10.942 10.24Zm6.032-8.192c-.336-.16-1.936-.944-2.24-1.056-.304-.112-.512-.16-.72.16-.208.32-.816 1.056-.992 1.264-.192.208-.368.224-.688.064-.32-.16-1.36-.496-2.592-1.584-.96-.848-1.6-1.888-1.792-2.208-.192-.32-.016-.496.144-.656.144-.144.32-.368.48-.56.16-.192.208-.32.32-.544.112-.208.048-.4-.016-.56-.064-.16-.72-1.728-.976-2.368-.256-.624-.512-.528-.72-.544-.192-.016-.4-.016-.608-.016-.208 0-.544.08-.832.384-.288.32-1.088 1.056-1.088 2.576s1.12 2.992 1.28 3.2c.16.208 2.192 3.36 5.312 4.72.752.32 1.344.512 1.792.656.752.24 1.44.208 1.984.128.608-.096 1.92-.784 2.192-1.536.272-.752.272-1.392.192-1.536-.08-.16-.288-.24-.608-.4Z"/>
            </svg>
          </a>
        </div>
      )}

      {/* Cookie Consent Banner */}
      {showCookie && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: '#0d0d0d',
          color: '#fff',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          borderTop: '1px solid #222',
          animation: 'slideUp 0.4s ease'
        }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#ccc', flex: 1, minWidth: '260px' }}>
            🍪 We use cookies to enhance your experience on Festa Munich. By continuing, you agree to our{' '}
            <a href="#" style={{ color: '#c9a84c', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', flexShrink: 0 }}>
            <button
              onClick={() => setShowCookie(false)}
              style={{
                background: 'none', border: '1px solid #555', color: '#aaa',
                padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem', borderRadius: '4px'
              }}
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              style={{
                background: '#c9a84c', border: 'none', color: '#000',
                padding: '0.5rem 1.2rem', cursor: 'pointer', fontSize: '0.8rem',
                fontWeight: 700, borderRadius: '4px', letterSpacing: '0.05em'
              }}
            >
              Accept All
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes waPopIn {
          from { transform: scale(0) rotate(-30deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
