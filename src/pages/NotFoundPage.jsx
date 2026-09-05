import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container-zegna" style={{ padding: '6rem 1.5rem 8rem', textAlign: 'center' }}>
      <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#777', marginBottom: '1rem', fontWeight: '600' }}>
        404 Error
      </div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '400', color: '#000', marginBottom: '1rem' }}>
        Page Not Found
      </h1>
      <p style={{ maxWidth: '640px', margin: '0 auto 2rem', color: '#555', fontSize: '0.95rem', lineHeight: 1.7 }}>
        The page you are looking for has moved or no longer exists. Return to the collection to continue browsing.
      </p>
      <Link to="/" className="btn-zegna-primary" style={{ textDecoration: 'none' }}>
        Back to Home
      </Link>
    </div>
  );
}
