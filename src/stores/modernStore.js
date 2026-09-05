// Modern State Management with Zustand for 2026
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useModernStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: false,
      setDarkMode: (darkMode) => set({ darkMode }),
      
      // User
      currentUser: null,
      userPreferences: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      setUserPreferences: (prefs) => set({ userPreferences: prefs }),
      
      // Notifications
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
      })),
      markAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      
      // Analytics
      sessionId: `session_${Date.now()}`,
      pageViews: [],
      trackPageView: (page) => set((state) => ({
        pageViews: [...state.pageViews, { page, timestamp: Date.now() }],
      })),
      
      // Loyalty
      loyaltyPoints: 0,
      loyaltyTier: 'bronze',
      setLoyaltyPoints: (points) => set({ loyaltyPoints: points }),
      setLoyaltyTier: (tier) => set({ loyaltyTier: tier }),
      
      // Recommendations
      recommendedProducts: [],
      setRecommendedProducts: (products) => set({ recommendedProducts: products }),
      
      // Search
      aiSearch: false,
      searchHistory: [],
      addToSearchHistory: (query) => set((state) => ({
        searchHistory: [query, ...state.searchHistory].filter((v, i, a) => a.indexOf(v) === i).slice(0, 20),
      })),
    }),
    {
      name: 'festa-munich-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        searchHistory: state.searchHistory,
        loyaltyTier: state.loyaltyTier,
      }),
    }
  )
);
