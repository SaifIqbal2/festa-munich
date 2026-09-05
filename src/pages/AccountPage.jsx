import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/helpers';

export default function AccountPage() {
  const { currentUser, userOrders, logoutUser, updateUserProfile, showToast } = useShop();
  const [mode, setMode] = useState('profile');
  const [profile, setProfile] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    country: currentUser?.country || 'Pakistan',
    postalCode: currentUser?.postalCode || ''
  });

  const totals = useMemo(() => {
    return userOrders.reduce((acc, order) => {
      acc.items += Array.isArray(order.items) ? order.items.length : 0;
      acc.total += Number(order.total_amount || 0);
      return acc;
    }, { items: 0, total: 0 });
  }, [userOrders]);

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
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 4rem)', marginBottom: '1rem' }}>Account Access Required</h1>
        <p style={{ maxWidth: '720px', margin: '0 auto 2rem', color: '#555', lineHeight: 1.7 }}>
          Please sign in or create an account to track your orders and save your address details.
        </p>
        <a href="/login" className="btn-zegna-primary" style={{ textDecoration: 'none' }}>Go to Login</a>
      </div>
    );
  }

  return (
    <div className="container-zegna" style={{ padding: '4rem 1.5rem 6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#777', marginBottom: '0.7rem', fontWeight: '600' }}>
            My Account
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', margin: 0 }}>Welcome, {currentUser.fullName}</h1>
        </div>
        <button className="btn-zegna-outline" onClick={logoutUser}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: '2rem' }}>
        <aside style={{ background: '#f7f7f7', border: '1px solid #e8e8e8', padding: '1.2rem', height: 'fit-content' }}>
          <button
            onClick={() => setMode('profile')}
            style={{ display: 'block', width: '100%', textAlign: 'left', background: mode === 'profile' ? '#000' : 'transparent', color: mode === 'profile' ? '#fff' : '#000', border: 'none', padding: '0.85rem 1rem', marginBottom: '0.5rem', cursor: 'pointer' }}
          >
            Profile Details
          </button>
          <button
            onClick={() => setMode('orders')}
            style={{ display: 'block', width: '100%', textAlign: 'left', background: mode === 'orders' ? '#000' : 'transparent', color: mode === 'orders' ? '#fff' : '#000', border: 'none', padding: '0.85rem 1rem', cursor: 'pointer' }}
          >
            Order History
          </button>
        </aside>

        <div>
          {mode === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ background: '#fff', border: '1px solid #eee', padding: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1.5rem' }}>Profile Details</h2>
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
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input className="form-input" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input className="form-input" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Postal Code</label>
                  <input className="form-input" value={profile.postalCode} onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Address</label>
                  <textarea className="form-input" rows="4" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn-zegna-primary">Save Details</button>
              </div>
            </form>
          )}

          {mode === 'orders' && (
            <div style={{ background: '#fff', border: '1px solid #eee', padding: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Order History</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f7f7f7', border: '1px solid #eee', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>Orders</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.4rem' }}>{userOrders.length}</div>
                </div>
                <div style={{ background: '#f7f7f7', border: '1px solid #eee', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>Items</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.4rem' }}>{totals.items}</div>
                </div>
                <div style={{ background: '#f7f7f7', border: '1px solid #eee', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>Spend</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.4rem' }}>{formatPrice(totals.total, 'USD')}</div>
                </div>
              </div>

              {userOrders.length === 0 ? (
                <div style={{ border: '1px dashed #ddd', padding: '2rem', textAlign: 'center', color: '#666' }}>
                  No orders yet. Start shopping to see your order history here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {userOrders.map((order) => (
                    <div key={order.id} style={{ border: '1px solid #eee', padding: '1rem 1.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>Order Number</div>
                          <strong>{order.order_number || order.id}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>Status</div>
                          <span>{order.status || 'Pending'}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>Total</div>
                          <strong>{formatPrice(Number(order.total_amount || 0), order.currency || 'USD')}</strong>
                        </div>
                      </div>
                      <div style={{ color: '#555', fontSize: '0.9rem' }}>
                        {Array.isArray(order.items) ? order.items.length : 0} item(s) • {order.customer_email || currentUser.email}
                      </div>
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
