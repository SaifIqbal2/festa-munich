// Analytics Service - Track user behavior and engagement
import { useModernStore } from '../stores/modernStore';

export const analyticsService = {
  events: [],

  trackEvent: (eventType, eventData = {}) => {
    const event = {
      id: `event_${Date.now()}`,
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
      sessionId: useModernStore.getState().sessionId,
      userAgent: navigator.userAgent,
      url: window.location.pathname,
    };
    
    analyticsService.events.push(event);
    
    // Send to backend (stub for now)
    if (window.localStorage) {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(event);
      localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100)));
    }
    
    return event;
  },

  trackPageView: (page, metadata = {}) => {
    useModernStore.getState().trackPageView(page);
    return analyticsService.trackEvent('page_view', {
      page,
      ...metadata,
    });
  },

  trackProductView: (productId, productData = {}) => {
    return analyticsService.trackEvent('product_view', {
      productId,
      ...productData,
    });
  },

  trackAddToCart: (productId, quantity, price) => {
    return analyticsService.trackEvent('add_to_cart', {
      productId,
      quantity,
      price,
      cartValue: quantity * price,
    });
  },

  trackCheckout: (orderId, totalAmount, itemCount) => {
    return analyticsService.trackEvent('checkout', {
      orderId,
      totalAmount,
      itemCount,
    });
  },

  trackSearch: (query, resultsCount) => {
    useModernStore.getState().addToSearchHistory(query);
    return analyticsService.trackEvent('search', {
      query,
      resultsCount,
    });
  },

  trackFilter: (filterType, filterValue) => {
    return analyticsService.trackEvent('filter_applied', {
      filterType,
      filterValue,
    });
  },

  trackWishlist: (productId, action) => {
    return analyticsService.trackEvent('wishlist_interaction', {
      productId,
      action, // 'add' or 'remove'
    });
  },

  trackReview: (productId, rating) => {
    return analyticsService.trackEvent('review_submitted', {
      productId,
      rating,
    });
  },

  trackEngagement: (elementType, action) => {
    return analyticsService.trackEvent('engagement', {
      elementType, // 'button', 'link', 'modal', etc.
      action,
    });
  },

  getAnalyticsSummary: () => ({
    totalEvents: analyticsService.events.length,
    pageViews: useModernStore.getState().pageViews.length,
    sessionId: useModernStore.getState().sessionId,
    events: analyticsService.events,
  }),

  exportAnalytics: () => {
    const data = analyticsService.getAnalyticsSummary();
    const csv = JSON.stringify(data, null, 2);
    const blob = new Blob([csv], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_${new Date().toISOString()}.json`;
    link.click();
  },
};

export default analyticsService;
