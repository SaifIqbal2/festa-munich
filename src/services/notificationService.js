// Notification Service - Real-time notifications & alerts
import { useModernStore } from '../stores/modernStore';
import { getSupabaseClient, isSupabaseConfigured } from '../supabaseClient';

export const notificationService = {
  async sendNotification(userId, notificationType, title, message, actionUrl = null) {
    const notification = {
      id: `notif_${Date.now()}`,
      user_id: userId,
      notification_type: notificationType,
      title,
      message,
      action_url: actionUrl,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    // Add to Zustand store
    useModernStore.getState().addNotification(notification);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client && userId) {
        const { error } = await client.from('notification_logs').insert([notification]);
        if (error) console.error('Failed to save notification:', error);
      }
    }

    return notification;
  },

  // Specific notification types
  notifyOrderConfirmed: (userId, orderNumber, totalAmount) => {
    return notificationService.sendNotification(
      userId,
      'order_confirmed',
      '✅ Order Confirmed!',
      `Your order #${orderNumber} for $${totalAmount} has been confirmed.`,
      '/account'
    );
  },

  notifyOrderShipped: (userId, orderNumber, trackingNumber) => {
    return notificationService.sendNotification(
      userId,
      'order_shipped',
      '📦 Order Shipped!',
      `Your order #${orderNumber} is on its way. Tracking: ${trackingNumber}`,
      '/account'
    );
  },

  notifyOrderDelivered: (userId, orderNumber) => {
    return notificationService.sendNotification(
      userId,
      'order_delivered',
      '🎉 Order Delivered!',
      `Your order #${orderNumber} has been delivered. Thank you for your purchase!`,
      '/account'
    );
  },

  notifyLoyaltyPointsEarned: (userId, points, newBalance) => {
    return notificationService.sendNotification(
      userId,
      'loyalty_points',
      '⭐ Points Earned!',
      `You earned ${points} loyalty points! New balance: ${newBalance}`,
      '/account'
    );
  },

  notifyProductBackInStock: (userId, productName) => {
    return notificationService.sendNotification(
      userId,
      'back_in_stock',
      '🔔 Back in Stock!',
      `${productName} is back in stock. Don't miss out!`,
      '/shop'
    );
  },

  notifyNewOffer: (userId, offerTitle, discount) => {
    return notificationService.sendNotification(
      userId,
      'new_offer',
      '🎁 Special Offer!',
      `${offerTitle} - Save ${discount}% today!`,
      '/shop'
    );
  },

  notifyWishlistPrice: (userId, productName, oldPrice, newPrice) => {
    return notificationService.sendNotification(
      userId,
      'price_drop',
      '💰 Price Drop!',
      `${productName} price dropped from $${oldPrice} to $${newPrice}!`,
      '/shop'
    );
  },

  notifyReviewRejected: (userId, productName) => {
    return notificationService.sendNotification(
      userId,
      'review_status',
      '📝 Review Update',
      `Your review for ${productName} was not approved.`,
      '/account'
    );
  },

  notifyReviewApproved: (userId, productName) => {
    return notificationService.sendNotification(
      userId,
      'review_status',
      '✅ Review Approved!',
      `Your review for ${productName} has been published!`,
      '/account'
    );
  },

  notifyReturnApproved: (userId, returnId, refundAmount) => {
    return notificationService.sendNotification(
      userId,
      'return_approved',
      '✅ Return Approved!',
      `Your return has been approved. Refund of $${refundAmount} will be processed within 5-7 business days.`,
      '/account'
    );
  },

  markAsRead: (notificationId) => {
    useModernStore.getState().markAsRead(notificationId);
  },

  getUnreadCount: () => {
    return useModernStore.getState().unreadCount;
  },

  getAllNotifications: () => {
    return useModernStore.getState().notifications;
  },

  clearAllNotifications: () => {
    useModernStore.setState({
      notifications: [],
      unreadCount: 0,
    });
  },
};

export default notificationService;
