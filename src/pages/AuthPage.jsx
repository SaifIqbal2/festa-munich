import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser, registerUser, currentUser, setIsAdminOpen } = useShop();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    postalCode: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) navigate('/account');
    if (currentUser?.isAdmin) {
      setIsAdminOpen(true);
      navigate('/');
    }
  }, [currentUser, navigate, setIsAdminOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (mode === 'login') {
      const result = await loginUser({ email: form.email, password: form.password });
      if (!result.success) {
        setError(result.message);
        setIsSubmitting(false);
        return;
      }

      if (result.user.isAdmin) {
        setIsAdminOpen(true);
        navigate('/');
      } else {
        navigate('/account');
      }
      setIsSubmitting(false);
      return;
    }

    const result = await registerUser({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: form.address,
      city: form.city,
      country: form.country,
      postalCode: form.postalCode
    });

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    if (result.message !== 'Account created successfully.') {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }
    navigate('/account');
    setIsSubmitting(false);
  };

  return (
    <div className="container-zegna" style={{ padding: '4rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', background: '#fff', border: '1px solid #eee', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: '#000', color: '#fff', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.8 }}>Member Access</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', marginTop: '0.8rem' }}>
            {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
          </h1>
          <p style={{ marginTop: '1rem', lineHeight: 1.7, color: '#ddd' }}>
            Save your cart, view order history, manage delivery details, and access the atelier experience from one account.
          </p>
        </div>

        <div style={{ padding: '2.5rem 2rem' }}>
          <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid #eee', gap: '1rem' }}>
            <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', paddingBottom: '0.8rem', borderBottom: mode === 'login' ? '2px solid #000' : '2px solid transparent', cursor: 'pointer', fontWeight: 700 }}>Login</button>
            <button type="button" onClick={() => setMode('register')} style={{ background: 'none', border: 'none', paddingBottom: '0.8rem', borderBottom: mode === 'register' ? '2px solid #000' : '2px solid transparent', cursor: 'pointer', fontWeight: 700 }}>Register</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
            )}

            <div>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <textarea rows="3" className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">City</label>
                    <input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Postal Code</label>
                    <input className="form-input" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#9f1239', padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-zegna-primary" style={{ width: '100%' }}>
              {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login to Account' : 'Create Account'}
            </button>

            <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
              Admin access is managed securely through Supabase Auth.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
