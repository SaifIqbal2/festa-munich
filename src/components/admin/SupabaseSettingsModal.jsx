import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { getSavedSupabaseConfig, saveSupabaseCredentials, isSupabaseConfigured, getSupabaseClient } from '../../supabaseClient';
import { X, Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, RefreshCw, Key, Globe } from 'lucide-react';

export default function SupabaseSettingsModal() {
  const { isSupabaseModalOpen, setIsSupabaseModalOpen, syncWithSupabase, showToast } = useShop();

  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  useEffect(() => {
    if (isSupabaseModalOpen) {
      const config = getSavedSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.key);
      setStatusMessage(null);
    }
  }, [isSupabaseModalOpen]);

  if (!isSupabaseModalOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      saveSupabaseCredentials('', '');
      setStatusMessage({ type: 'info', text: 'Supabase credentials cleared. Running in High-Performance LocalStorage Mode.' });
      return;
    }

    setIsTesting(true);
    setStatusMessage(null);

    saveSupabaseCredentials(url, anonKey);

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Invalid Supabase configuration URL or Key format.');
      }

      // Test query
      const { data, error } = await client.from('products').select('count').limit(1);

      if (error && error.code === '42P01') {
        setStatusMessage({
          type: 'warning',
          text: 'Connected to Supabase successfully! Note: Tables not created yet. Please execute the SQL Schema in your Supabase SQL Editor.'
        });
      } else if (error) {
        setStatusMessage({
          type: 'warning',
          text: `Supabase reached, but returned: ${error.message}. Please check your tables & RLS policies.`
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Connection verified! Your Festa Munich store is now actively synchronized with live Supabase database.'
        });
        syncWithSupabase();
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `Connection test failed: ${err.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopySQL = () => {
    const sqlCode = `-- FESTA MUNICH SUPABASE DATABASE SCHEMA
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    images TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    craftsmanship_details TEXT[] DEFAULT '{}',
    material TEXT NOT NULL,
    available_sizes TEXT[] DEFAULT '{"S", "M", "L", "XL", "XXL"}',
    colors TEXT[] DEFAULT '{"Black", "Cognac", "Espresso"}',
    stock INTEGER DEFAULT 15,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    badge TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT DEFAULT 'Cash on Delivery',
    status TEXT DEFAULT 'Pending',
    tracking_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Manage Products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlCode);
    setCopiedSchema(true);
    showToast('SQL Schema copied to clipboard.');
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="modal-overlay" onClick={() => setIsSupabaseModalOpen(false)} style={{ padding: '1rem' }}>
      <div 
        className="animate-slide-up"
        style={{
          backgroundColor: '#141414',
          border: '1px solid rgba(200, 157, 102, 0.4)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.6rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#181818'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(62, 207, 142, 0.1)', border: '1px solid rgba(62, 207, 142, 0.3)', color: '#3ecf8e' }}>
              <Database size={20} />
            </div>
            <div>
              <div className="luxury-eyebrow" style={{ color: '#3ecf8e' }}>DATABASE CONNECTION</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#fff' }}>
                Supabase Cloud Database Settings
              </h3>
            </div>
          </div>
          <button onClick={() => setIsSupabaseModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem' }}>
          
          {/* Status Indicator */}
          <div 
            style={{
              padding: '1rem 1.2rem',
              background: isConfigured ? 'rgba(62, 207, 142, 0.08)' : 'rgba(255, 193, 7, 0.08)',
              border: `1px solid ${isConfigured ? 'rgba(62, 207, 142, 0.3)' : 'rgba(255, 193, 7, 0.3)'}`,
              marginBottom: '1.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.8rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isConfigured ? <CheckCircle2 size={18} color="#3ecf8e" /> : <AlertCircle size={18} color="#ffc107" />}
              <span style={{ fontSize: '0.84rem', color: isConfigured ? '#3ecf8e' : '#ffc107', fontWeight: '600' }}>
                {isConfigured ? 'Live Supabase Cloud Database Connected' : 'Running in Standalone LocalStorage Mode'}
              </span>
            </div>
            {isConfigured && (
              <button 
                onClick={() => { syncWithSupabase(); showToast('Synchronized with Supabase!'); }}
                className="btn btn-outline-light btn-sm"
                style={{ padding: '0.3rem 0.7rem', fontSize: '0.72rem' }}
              >
                <RefreshCw size={12} /> Sync Now
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleTestAndSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label className="form-label">
                <Globe size={12} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                <Key size={12} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Supabase Public Anon Key (API Key)
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="form-input"
              />
            </div>

            {statusMessage && (
              <div 
                style={{
                  padding: '0.9rem 1.1rem',
                  fontSize: '0.82rem',
                  background: statusMessage.type === 'success' ? 'rgba(62, 207, 142, 0.1)' : statusMessage.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                  border: `1px solid ${statusMessage.type === 'success' ? '#3ecf8e' : statusMessage.type === 'warning' ? '#ffc107' : '#f44336'}`,
                  color: statusMessage.type === 'success' ? '#3ecf8e' : statusMessage.type === 'warning' ? '#ffc107' : '#f44336'
                }}
              >
                {statusMessage.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" disabled={isTesting} className="btn btn-gold" style={{ flex: 1 }}>
                {isTesting ? 'Testing Connection...' : 'Save & Connect Supabase'}
              </button>
            </div>
          </form>

          {/* Quick SQL Schema Export */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <div className="luxury-eyebrow" style={{ fontSize: '0.68rem' }}>SUPABASE SQL SETUP SCRIPT</div>
              <button 
                onClick={handleCopySQL} 
                className="btn btn-outline-light btn-sm"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
              >
                {copiedSchema ? <Check size={12} color="#81c784" /> : <Copy size={12} />}
                {copiedSchema ? 'Copied SQL!' : 'Copy SQL Script'}
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#888', lineHeight: 1.5 }}>
              Paste this SQL into your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: '#c89d66', textDecoration: 'none' }}>Supabase SQL Editor <ExternalLink size={11} style={{ display: 'inline' }} /></a> to automatically generate the <code>products</code> and <code>orders</code> tables with instant Row Level Security permissions.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
