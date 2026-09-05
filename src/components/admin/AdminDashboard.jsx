import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/helpers';
import ProductManagementView from './ProductManagementView';
import OrderManagementView from './OrderManagementView';
import CategoryManagementView from './CategoryManagementView';
import HeroManagementView from './HeroManagementView';
import CommerceManagementView from './CommerceManagementView';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Layers,
  FolderTree,
  AlertTriangle,
  Cloud,
  Image as ImageIcon,
  Gift
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    orders
  } = useShop();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'categories' | 'products' | 'orders'
  
  // Need to read from global for currency but ShopContext might just have `currency`
  // We'll hardcode 'USD' or get it from context if it's there
  const currency = 'USD'; 

  if (!isAdminOpen) return null;

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + Number(ord.total_amount || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
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

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.85rem 1rem',
              background: activeTab === 'orders' ? '#f5f5f5' : 'transparent',
              color: activeTab === 'orders' ? '#000' : '#666',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'orders' ? '600' : '400',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Package size={18} />
              Orders & Tracking
            </div>
            {pendingOrdersCount > 0 && (
              <span style={{ fontSize: '0.75rem', background: '#000', color: '#fff', fontWeight: '600', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('commerce')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100%', padding: '0.85rem 1rem', background: activeTab === 'commerce' ? '#f5f5f5' : 'transparent', color: activeTab === 'commerce' ? '#000' : '#666', border: 'none', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: activeTab === 'commerce' ? '600' : '400', cursor: 'pointer', textAlign: 'left' }}
          >
            <Gift size={18} />
            Coupons & Gift Cards
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
                
                {/* Total Sales */}
                <div style={{ background: '#fff', padding: '1.8rem', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Revenue</span>
                    <TrendingUp size={18} color="#000" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#000', fontWeight: '500' }}>
                    {formatPrice(totalRevenue, currency)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Lifetime store volume</div>
                </div>

                {/* Total Orders */}
                <div style={{ background: '#fff', padding: '1.8rem', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Orders</span>
                    <Package size={18} color="#000" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#000', fontWeight: '500' }}>
                    {totalOrdersCount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: pendingOrdersCount > 0 ? '#d97706' : '#888', marginTop: '0.5rem', fontWeight: pendingOrdersCount > 0 ? 500 : 400 }}>
                    {pendingOrdersCount} orders requiring attention
                  </div>
                </div>

                {/* Average Order Value */}
                <div style={{ background: '#fff', padding: '1.8rem', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Avg. Order Value</span>
                    <DollarSign size={18} color="#000" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#000', fontWeight: '500' }}>
                    {formatPrice(averageOrderValue, currency)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Per transaction</div>
                </div>

                {/* Active Catalog */}
                <div style={{ background: '#fff', padding: '1.8rem', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Live Garments</span>
                    <ShoppingBag size={18} color="#000" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#000', fontWeight: '500' }}>
                    {totalProductsCount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Active catalog products</div>
                </div>

              </div>

              {/* Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                
                {/* Recent Orders Overview */}
                <div style={{ background: '#fff', padding: '2rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#000', margin: 0 }}>
                      Recent Orders
                    </h4>
                    <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: '#000', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
                      View All
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.slice(0, 4).map(ord => (
                      <div key={ord.id || ord.order_number} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                        <div>
                          <div style={{ color: '#000', fontWeight: '600', fontSize: '0.9rem' }}>#{ord.order_number}</div>
                          <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.2rem' }}>{ord.customer_name}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#000', fontWeight: '600', fontSize: '0.9rem' }}>{formatPrice(ord.total_amount, currency)}</div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: ord.status === 'Delivered' ? '#059669' : '#d97706',
                            background: ord.status === 'Delivered' ? '#d1fae5' : '#fef3c7',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '12px',
                            marginTop: '0.3rem',
                            display: 'inline-block'
                          }}>
                            {ord.status}
                          </div>
                        </div>
                      </div>
                    ))}
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

          {/* TAB 2: CATEGORIES */}
          {activeTab === 'categories' && <CategoryManagementView />}

          {/* TAB 3: HERO SLIDES */}
          {activeTab === 'hero' && <HeroManagementView />}

          {/* TAB 4: PRODUCTS MANAGER */}
          {activeTab === 'products' && <ProductManagementView />}

          {/* TAB 5: ORDERS TRACKER */}
          {activeTab === 'orders' && <OrderManagementView />}
          {activeTab === 'commerce' && <CommerceManagementView />}

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
