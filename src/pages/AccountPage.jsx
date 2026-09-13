import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/helpers';

export default function AccountPage() {
  const { currentUser, logoutUser, updateUserProfile, showToast, inquiries = [], openQuoteModal } = useShop();
  const [mode, setMode] = useState('profile');
  const [profile, setProfile] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    company: currentUser?.company || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    country: currentUser?.country || 'Pakistan',
    postalCode: currentUser?.postalCode || ''
  });

  const userInquiries = useMemo(() => {
    if (!currentUser) return [];
    return inquiries.filter(inq => 
      (currentUser.email && inq.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
      (currentUser.phone && inq.phone === currentUser.phone) ||
      (currentUser.fullName && inq.buyer_name?.toLowerCase() === currentUser.fullName.toLowerCase())
    );
  }, [inquiries, currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const result = await updateUserProfile(profile);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'info');
    }
  };

  if (!currentUser) {
    return (
      <div className="container-zegna" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 4rem)', marginBottom: '1rem' }}>Wholesale Client Access</h1>
        <p style={{ maxWidth: '720px', margin: '0 auto 2rem', color: '#555', lineHeight: 1.7 }}>
          Sign in or create your corporate account to track wholesale RFQ quotations, bespoke leather specifications, and production timelines.
        </p>
        <a href="/login" className="btn-zegna-primary" style={{ textDecoration: 'none' }}>Client Login</a>
      </div>
    );
  }

  return (
    <div className="container-zegna" style={{ padding: '4rem 1.5rem 6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#777', marginBottom: '0.7rem', fontWeight: '600' }}>
            Corporate Atelier Account
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', margin: 0 }}>Welcome, {currentUser.fullName}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="btn-zegna-primary" onClick={() => openQuoteModal && openQuoteModal()}>+ New RFQ Request</button>
          <button className="btn-zegna-outline" onClick={logoutUser}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        <aside style={{ background: '#f7f7f7', border: '1px solid #e8e8e8', padding: '1.2rem', height: 'fit-content' }}>
          <button
            onClick={() => setMode('profile')}
            style={{ display: 'block', width: '100%', textAlign: 'left', background: mode === 'profile' ? '#000' : 'transparent', color: mode === 'profile' ? '#fff' : '#000', border: 'none', padding: '0.85rem 1rem', marginBottom: '0.5rem', cursor: 'pointer' }}
          >
            Profile & Company
          </button>
          <button
            onClick={() => setMode('rfq')}
            style={{ display: 'block', width: '100%', textAlign: 'left', background: mode === 'rfq' ? '#000' : 'transparent', color: mode === 'rfq' ? '#fff' : '#000', border: 'none', padding: '0.85rem 1rem', cursor: 'pointer' }}
          >
            Wholesale RFQs ({userInquiries.length})
          </button>
        </aside>

        <div>
          {mode === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ background: '#fff', border: '1px solid #eee', padding: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1.5rem' }}>Client Profile</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Phone / WhatsApp</label>
                  <input className="form-input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Company / Brand Name</label>
                  <input className="form-input" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} placeholder="e.g. London Leather Co." />
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input className="form-input" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input className="form-input" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Business Address</label>
                  <textarea className="form-input" rows="3" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn-zegna-primary">Save Details</button>
              </div>
            </form>
          )}

          {mode === 'rfq' && (
            <div style={{ background: '#fff', border: '1px solid #eee', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>Wholesale RFQs & Quotations</h2>
                <button className="btn-zegna-primary" onClick={() => openQuoteModal && openQuoteModal()} style={{ fontSize: '0.8rem', padding: '0.6rem 1.2rem' }}>
                  Submit New Request
                </button>
              </div>

              {userInquiries.length === 0 ? (
                <div style={{ border: '1px dashed #ddd', padding: '3rem 2rem', textAlign: 'center', color: '#666' }}>
                  <p style={{ margin: '0 0 1rem 0' }}>No wholesale quote requests found under your email ({currentUser.email}).</p>
                  <button className="btn-zegna-primary" onClick={() => openQuoteModal && openQuoteModal()}>
                    Request a Quotation Now
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {userInquiries.map((inq) => (
                    <div key={inq.id} style={{ border: '1px solid #eee', padding: '1.2rem', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>Garment Reference</div>
                          <strong style={{ fontSize: '1.1rem' }}>{inq.product_title || inq.productTitle || 'Bulk Garment Order'}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>Status</div>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 600, 
                            color: inq.status === 'New' ? '#2563eb' : '#059669',
                            background: inq.status === 'New' ? '#eff6ff' : '#ecfdf5',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px'
                          }}>
                            {inq.status || 'Under Review'}
                          </span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>Requested Batch</div>
                          <strong>{inq.quantity || 'Wholesale MOQ'}</strong>
                        </div>
                      </div>
                      {inq.custom_specs && (
                        <div style={{ background: '#fafafa', padding: '0.8rem', fontSize: '0.85rem', color: '#555', borderRadius: '4px' }}>
                          <strong>Specifications:</strong> {inq.custom_specs}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
