import React, { useEffect, useState } from 'react';
import { Gift, Ticket, Save, RefreshCw, Trash2 } from 'lucide-react';
import { getSupabaseClient, isSupabaseConfigured } from '../../supabaseClient';

const fieldStyle = { width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' };

export default function CommerceManagementView() {
  const [coupon, setCoupon] = useState({ code: '', description: '', discount_type: 'percentage', discount_value: '', min_purchase_amount: '', valid_until: '' });
  const [giftCard, setGiftCard] = useState({ code: '', balance: '', expires_at: '' });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const loadRecords = async () => {
    const client = isSupabaseConfigured() ? getSupabaseClient() : null;
    if (!client) return;
    setLoadingRecords(true);
    const [{ data: couponData, error: couponError }, { data: giftData, error: giftError }] = await Promise.all([
      client.from('coupon_codes').select('*').order('created_at', { ascending: false }),
      client.from('gift_cards').select('*').order('created_at', { ascending: false })
    ]);
    setLoadingRecords(false);
    if (couponError || giftError) {
      setStatus({ type: 'error', message: couponError?.message || giftError?.message || 'Records could not be loaded.' });
      return;
    }
    setCoupons(couponData || []);
    setGiftCards(giftData || []);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const save = async (table, payload, reset) => {
    if (!isSupabaseConfigured()) {
      setStatus({ type: 'error', message: 'Supabase is not configured.' });
      return;
    }
    setSaving(true);
    const client = getSupabaseClient();
    const { error } = await client.from(table).insert([payload]);
    setSaving(false);
    if (error) {
      setStatus({ type: 'error', message: error.message });
      return;
    }
    reset();
    setStatus({ type: 'success', message: `${table === 'coupon_codes' ? 'Coupon' : 'Gift card'} saved to Supabase.` });
    await loadRecords();
  };

  const addCoupon = (event) => {
    event.preventDefault();
    save('coupon_codes', {
      code: coupon.code.trim().toUpperCase(),
      description: coupon.description || null,
      discount_type: coupon.discount_type,
      discount_value: Number(coupon.discount_value),
      min_purchase_amount: coupon.min_purchase_amount ? Number(coupon.min_purchase_amount) : null,
      active: true,
      valid_from: new Date().toISOString(),
      valid_until: new Date(coupon.valid_until).toISOString()
    }, () => setCoupon({ code: '', description: '', discount_type: 'percentage', discount_value: '', min_purchase_amount: '', valid_until: '' }));
  };

  const addGiftCard = (event) => {
    event.preventDefault();
    save('gift_cards', {
      code: giftCard.code.trim().toUpperCase(),
      balance: Number(giftCard.balance),
      original_amount: Number(giftCard.balance),
      is_active: true,
      expires_at: giftCard.expires_at ? new Date(giftCard.expires_at).toISOString() : null
    }, () => setGiftCard({ code: '', balance: '', expires_at: '' }));
  };

  const updateRecordStatus = async (table, id, field, value) => {
    const client = getSupabaseClient();
    const { error } = await client.from(table).update({ [field]: value }).eq('id', id);
    if (error) setStatus({ type: 'error', message: error.message });
    else await loadRecords();
  };

  const deleteRecord = async (table, id) => {
    if (!window.confirm('Delete this record permanently?')) return;
    const client = getSupabaseClient();
    const { error } = await client.from(table).delete().eq('id', id);
    if (error) setStatus({ type: 'error', message: error.message });
    else {
      setStatus({ type: 'success', message: 'Record deleted.' });
      await loadRecords();
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <h2 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400 }}>Commerce Tools</h2>
      <p style={{ color: '#666', margin: '0 0 1.5rem' }}>Create coupons and gift cards directly in Supabase.</p>
      {status && <div role="status" style={{ padding: '0.8rem 1rem', marginBottom: '1.25rem', background: status.type === 'success' ? '#f0fff4' : '#fff5f5', color: status.type === 'success' ? '#176b3a' : '#9b2226', border: `1px solid ${status.type === 'success' ? '#b7e4c7' : '#f1b5b5'}` }}>{status.message}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <form onSubmit={addCoupon} style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}><Ticket size={18} /> New Coupon</h3>
          <input required placeholder="Code e.g. WELCOME10" value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value })} style={{ ...fieldStyle, marginBottom: '0.8rem' }} />
          <input placeholder="Description" value={coupon.description} onChange={(e) => setCoupon({ ...coupon, description: e.target.value })} style={{ ...fieldStyle, marginBottom: '0.8rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <select value={coupon.discount_type} onChange={(e) => setCoupon({ ...coupon, discount_type: e.target.value })} style={fieldStyle}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select>
            <input required type="number" min="0" step="0.01" placeholder="Value" value={coupon.discount_value} onChange={(e) => setCoupon({ ...coupon, discount_value: e.target.value })} style={fieldStyle} />
          </div>
          <input type="number" min="0" step="0.01" placeholder="Minimum purchase (optional)" value={coupon.min_purchase_amount} onChange={(e) => setCoupon({ ...coupon, min_purchase_amount: e.target.value })} style={{ ...fieldStyle, marginBottom: '0.8rem' }} />
          <input required type="date" value={coupon.valid_until} onChange={(e) => setCoupon({ ...coupon, valid_until: e.target.value })} style={{ ...fieldStyle, marginBottom: '1rem' }} />
          <button disabled={saving} type="submit" style={{ background: '#000', color: '#fff', border: 0, padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Save size={15} /> {saving ? 'Saving...' : 'Save Coupon'}</button>
        </form>

        <form onSubmit={addGiftCard} style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}><Gift size={18} /> New Gift Card</h3>
          <input required placeholder="Code e.g. FESTA100" value={giftCard.code} onChange={(e) => setGiftCard({ ...giftCard, code: e.target.value })} style={{ ...fieldStyle, marginBottom: '0.8rem' }} />
          <input required type="number" min="1" step="0.01" placeholder="Amount" value={giftCard.balance} onChange={(e) => setGiftCard({ ...giftCard, balance: e.target.value })} style={{ ...fieldStyle, marginBottom: '0.8rem' }} />
          <input type="date" value={giftCard.expires_at} onChange={(e) => setGiftCard({ ...giftCard, expires_at: e.target.value })} style={{ ...fieldStyle, marginBottom: '1rem' }} />
          <button disabled={saving} type="submit" style={{ background: '#000', color: '#fff', border: 0, padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Save size={15} /> {saving ? 'Saving...' : 'Save Gift Card'}</button>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400 }}>Saved Offers & Gift Cards</h3>
        <button type="button" onClick={loadRecords} disabled={loadingRecords} style={{ background: '#fff', border: '1px solid #ccc', padding: '0.6rem 0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <RefreshCw size={15} /> {loadingRecords ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <RecordList title="Coupons" emptyText="No coupons created yet." records={coupons} type="coupon_codes" onToggle={updateRecordStatus} onDelete={deleteRecord} />
        <RecordList title="Gift Cards" emptyText="No gift cards created yet." records={giftCards} type="gift_cards" onToggle={updateRecordStatus} onDelete={deleteRecord} />
      </div>
    </div>
  );
}

function RecordList({ title, emptyText, records, type, onToggle, onDelete }) {
  const isCoupon = type === 'coupon_codes';
  return (
    <section style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #eee', fontWeight: 600 }}>{title} <span style={{ color: '#888', fontWeight: 400 }}>({records.length})</span></div>
      {records.length === 0 ? <div style={{ padding: '2rem 1.25rem', color: '#777', fontSize: '0.9rem' }}>{emptyText}</div> : records.map((record) => (
        <div key={record.id} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <div>
            <strong style={{ display: 'block', letterSpacing: '0.06em' }}>{record.code}</strong>
            <span style={{ color: '#666', fontSize: '0.82rem' }}>
              {isCoupon ? `${record.discount_type === 'percentage' ? `${record.discount_value}%` : `$${record.discount_value}`} discount` : `$${record.balance} balance`}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button type="button" onClick={() => onToggle(type, record.id, isCoupon ? 'active' : 'is_active', isCoupon ? !record.active : !record.is_active)} style={{ border: '1px solid #ddd', background: record.active === false || record.is_active === false ? '#fff5f5' : '#f0fff4', color: '#333', padding: '0.35rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}>
              {record.active === false || record.is_active === false ? 'Inactive' : 'Active'}
            </button>
            <button type="button" aria-label={`Delete ${record.code}`} onClick={() => onDelete(type, record.id)} style={{ border: 0, background: 'transparent', color: '#a11', cursor: 'pointer', padding: '0.35rem' }}><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
    </section>
  );
}
