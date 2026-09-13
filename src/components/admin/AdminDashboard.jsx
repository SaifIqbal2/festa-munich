import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import ProductManagementView from './ProductManagementView';
import CategoryManagementView from './CategoryManagementView';
import HeroManagementView from './HeroManagementView';
import InquiryManagementView from './InquiryManagementView';
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeft, 
  Layers,
  FolderTree,
  Cloud,
  Image as ImageIcon,
  MessageSquare,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    categories = [],
    inquiries = []
  } = useShop();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'inquiries' | 'products' | 'categories' | 'hero'

  if (!isAdminOpen) return null;

  // B2B Wholesale KPI Calculations
  const totalInquiriesCount = inquiries.length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;
  const totalProductsCount = products.length;
  const totalCategoriesCount = categories.length;
  const lowStockProducts = products.filter(p => (p.stock || 0) <= 8);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#f9f9f9', // Light Theme Background
        zIndex: 1100,
        color: '#111',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Navbar */}
      <header 
        style={{
          height: '76px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #eaeaea',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => setIsAdminOpen(false)}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'none', border: '1px solid #ddd', padding: '0.5rem 1rem',
              fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px',
              color: '#333'
            }}
          >
            <ArrowLeft size={16} />
            Back to Storefront
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                color: '#fff',
                fontWeight: '700',
                fontFamily: 'var(--font-serif)'
              }}
            >
              FM
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.1em', fontWeight: '700', color: '#000' }}>
              FESTA MUNICH ATELIER
            </span>
          </div>
        </div>

        {/* Cloud Sync indicator (generic) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              background: 'rgba(62, 207, 142, 0.1)',
              border: `1px solid rgba(62, 207, 142, 0.3)`,
              color: '#2b9c67',
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Cloud size={14} />
            Cloud Sync Active
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar / Tabs */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 76px)' }}>
        
        {/* Navigation Sidebar */}
        <aside 
          style={{
            width: '260px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #eaeaea',
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            overflow: 'hidden'
          }}
          className="admin-sidebar"
        >
          <div style={{ padding: '0 0.8rem 1rem', fontSize: '0.75rem', letterSpacing: '0.1em', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>
            Modules
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              width: '100%',
              padding: '0.85rem 1rem',
              background: activeTab === 'overview' ? '#f5f5f5' : 'transparent',
              color: activeTab === 'overview' ? '#000' : '#666',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'overview' ? '600' : '400',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <LayoutDashboard size={18} />
            Overview & Analytics
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.85rem 1rem',
              background: activeTab === 'inquiries' ? '#f5f5f5' : 'transparent',
              color: activeTab === 'inquiries' ? '#000' : '#666',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'inquiries' ? '600' : '400',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <MessageSquare size={18} />
              Wholesale RFQs
            </div>
            {inquiries.filter(i => i.status === 'New').length > 0 && (
              <span style={{ fontSize: '0.72rem', background: '#2563eb', color: '#fff', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                {inquiries.filter(i => i.status === 'New').length} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              width: '100%',
              padding: '0.85rem 1rem',
              background: activeTab === 'categories' ? '#f5f5f5' : 'transparent',
              color: activeTab === 'categories' ? '#000' : '#666',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'categories' ? '600' : '400',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <FolderTree size={18} />
            Categories
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              width: '100%',
              padding: '0.85rem 1rem',
              background: activeTab === 'hero' ? '#f5f5f5' : 'transparent',
              color: activeTab === 'hero' ? '#000' : '#666',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'hero' ? '600' : '400',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <ImageIcon size={18} />
            Hero Slides
          </button>

          <button
            onClick={() => setActiveTab('products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.85rem 1rem',
              background: activeTab === 'products' ? '#f5f5f5' : 'transparent',
              color: activeTab === 'products' ? '#000' : '#666',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'products' ? '600' : '400',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Layers size={18} />
              Products Catalog
            </div>
            <span style={{ fontSize: '0.75rem', background: '#e0e0e0', color: '#333', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
              {products.length}
            </span>
          </button>
        </aside>

        {/* Tab Body */}
        <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '400', fontFamily: 'var(--font-serif)', margin: '0 0 0.5rem 0' }}>
                  Atelier Overview
                </h2>
                <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>Welcome back. Here is the current status of your boutique.</p>
              </div>

              {/* 4 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                
                {/* Total Wholesale Inquiries */}
                <div style={{ background: '#fff', padding: '1.8rem', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Wholesale RFQs</span>
                    <MessageSquare size={18} color="#000" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#000', fontWeight: '500' }}>
                    {totalInquiriesCount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>All-time quotation requests</div>
                </div>

                {/* Pending Inquiries */}
                <div style={{ background: '#fff', padding: '1.8rem', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>New Quotations</span>
                    <Clock size={18} color="#2563eb" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#2563eb', fontWeight: '500' }}>
                    {newInquiriesCount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: newInquiriesCount > 0 ? '#2563eb' : '#888', marginTop: '0.5rem', fontWeight: newInquiriesCount > 0 ? 600 : 400 }}>
                    {newInquiriesCount > 0 ? `${newInquiriesCount} inquiries awaiting response` : 'All inquiries addressed'}
                  </div>
                </div>

                {/* Active Catalog */}
                <div style={{ background: '#fff', padding: '1.8rem', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Live Garments</span>
                    <Layers size={18} color="#000" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#000', fontWeight: '500' }}>
                    {totalProductsCount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Active catalog products</div>
                </div>

                {/* Categories */}
                <div style={{ background: '#fff', padding: '1.8rem', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Collections</span>
                    <FolderTree size={18} color="#000" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#000', fontWeight: '500' }}>
                    {totalCategoriesCount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Atelier disciplines</div>
                </div>

              </div>

              {/* Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                
                {/* Recent Inquiries Overview */}
                <div style={{ background: '#fff', padding: '2rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#000', margin: 0 }}>
                      Recent Wholesale RFQs
                    </h4>
                    <button onClick={() => setActiveTab('inquiries')} style={{ background: 'none', border: 'none', color: '#000', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
                      View All ({inquiries.length})
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {inquiries.length === 0 ? (
                      <div style={{ color: '#888', fontSize: '0.88rem', padding: '2rem 0', textAlign: 'center' }}>
                        No wholesale inquiries yet. Incoming requests will appear here.
                      </div>
                    ) : (
                      inquiries.slice(0, 4).map(inq => (
                        <div key={inq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                          <div>
                            <div style={{ color: '#000', fontWeight: '600', fontSize: '0.9rem' }}>{inq.buyer_name || inq.buyerName || 'Valued Buyer'}</div>
                            <div style={{ color: '#666', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                              {inq.product_title || inq.productTitle || 'Bulk Order'} • <strong>{inq.quantity || 'Wholesale'}</strong>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ 
                              fontSize: '0.72rem', 
                              fontWeight: '600',
                              color: inq.status === 'New' ? '#1d4ed8' : '#374151',
                              background: inq.status === 'New' ? '#eff6ff' : '#f3f4f6',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '12px'
                            }}>
                              {inq.status || 'New'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div style={{ background: '#fff', padding: '2rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#000', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <AlertTriangle size={18} color="#d97706" />
                      Inventory Alerts
                    </h4>
                    <button onClick={() => setActiveTab('products')} style={{ background: 'none', border: 'none', color: '#000', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Manage Stock
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {lowStockProducts.slice(0, 4).map(prod => (
                      <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                        <div>
                          <div style={{ color: '#000', fontWeight: '500', fontSize: '0.9rem' }}>{prod.title}</div>
                          <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.2rem' }}>{prod.category}</div>
                        </div>
                        <div style={{ color: '#d97706', fontWeight: '600', fontSize: '0.9rem' }}>
                          {prod.stock || 0} remaining
                        </div>
                      </div>
                    ))}
                    {lowStockProducts.length === 0 && (
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>All products are sufficiently stocked.</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB: INQUIRIES & RFQ */}
          {activeTab === 'inquiries' && <InquiryManagementView />}

          {/* TAB 2: CATEGORIES */}
          {activeTab === 'categories' && <CategoryManagementView />}

          {/* TAB 3: HERO SLIDES */}
          {activeTab === 'hero' && <HeroManagementView />}

          {/* TAB 4: PRODUCTS MANAGER */}
          {activeTab === 'products' && <ProductManagementView />}

        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
