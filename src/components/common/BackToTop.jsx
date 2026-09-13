import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * BackToTop — floating button that appears after scrolling 400px down.
 * Smooth scrolls back to top on click.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Back to top"
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9000,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: isHovered ? '#1a1a1a' : '#000000',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isHovered
          ? '0 8px 24px rgba(0,0,0,0.3)'
          : '0 4px 12px rgba(0,0,0,0.2)',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
}
