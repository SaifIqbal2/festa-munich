import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import QuickCartDrawer from './components/layout/QuickCartDrawer';
import ProductDetailModal from './components/shop/ProductDetailModal';
import OrderTrackingModal from './components/shop/OrderTrackingModal';
import CheckoutModal from './components/checkout/CheckoutModal';
import AdminDashboard from './components/admin/AdminDashboard';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import StoryPage from './pages/StoryPage';
import BespokePage from './pages/BespokePage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';
import { CheckCircle, Info } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function BoutiqueStoreContent() {
  const { toast } = useShop();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <AnnouncementBar />
      <Navbar />

      <main style={{ flex: 1 }}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CatalogPage />} />
          <Route path="/our-world" element={<StoryPage />} />
          <Route path="/bespoke" element={<BespokePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <QuickCartDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderTrackingModal />
      <AdminDashboard />

      {toast && (
        <div className="toast-container">
          <div className="toast-box">
            {toast.type === 'info' ? (
              <Info size={18} color="#ffffff" />
            ) : (
              <CheckCircle size={18} color="#ffffff" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <BoutiqueStoreContent />
      </BrowserRouter>
    </ShopProvider>
  );
}
