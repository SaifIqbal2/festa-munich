// Loyalty Program Service - Rewards and points management
import { useModernStore } from '../stores/modernStore';
import notificationService from './notificationService';
import { getSupabaseClient, isSupabaseConfigured } from '../supabaseClient';

export const loyaltyService = {
  TIER_SETTINGS: {
    bronze: { minPoints: 0, discount: 0.05, benefits: ['5% discount on all purchases', 'Access to member-only sales'] },
    silver: { minPoints: 500, discount: 0.1, benefits: ['10% discount on all purchases', 'Free shipping', 'Early access to new collections'] },
    gold: { minPoints: 1500, discount: 0.15, benefits: ['15% discount on all purchases', 'Free expedited shipping', 'Priority customer support', 'Birthday gift'] },
    platinum: { minPoints: 3000, discount: 0.2, benefits: ['20% discount on all purchases', 'Free priority shipping', 'Concierge service', 'Exclusive events', 'Personal stylist'] },
  },

  POINTS_RULES: {
    purchase: 1, // 1 point per $1 spent
    review: 50, // 50 points for review
    referral: 100, // 100 points for successful referral
    birthday: 250, // 250 bonus points in birthday month
    socialShare: 25, // 25 points for social share
    signup: 100, // 100 points for new account
  },

  initializeLoyalty: async (userId) => {
    const loyaltyData = {
      user_id: userId,
      total_points: loyaltyService.POINTS_RULES.signup,
      redeemed_points: 0,
      current_balance: loyaltyService.POINTS_RULES.signup,
      tier: 'bronze',
      created_at: new Date().toISOString(),
    };

    useModernStore.getState().setLoyaltyPoints(loyaltyData.current_balance);
    useModernStore.getState().setLoyaltyTier('bronze');

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) await client.from('loyalty_points').upsert(loyaltyData, { onConflict: 'user_id' });
    }

    return loyaltyData;
  },

  addPoints: async (userId, pointType, amount = null) => {
    const points = amount || loyaltyService.POINTS_RULES[pointType] || 0;
    const currentPoints = useModernStore.getState().loyaltyPoints;
    const newBalance = currentPoints + points;

    useModernStore.getState().setLoyaltyPoints(newBalance);

    // Notify user
    notificationService.notifyLoyaltyPointsEarned(userId, points, newBalance);

    // Check for tier upgrade
    const newTier = loyaltyService.calculateTier(newBalance);
    const currentTier = useModernStore.getState().loyaltyTier;

    if (newTier !== currentTier) {
      useModernStore.getState().setLoyaltyTier(newTier);
      loyaltyService.notifyTierUpgrade(userId, newTier);
    }

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        await client.from('loyalty_points').upsert({
          user_id: userId,
          total_points: newBalance,
          current_balance: newBalance,
          tier: newTier,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      }
    }

    return {
      pointsAdded: points,
      newBalance,
      tier: newTier,
    };
  },

  redeemPoints: async (userId, points) => {
    const currentBalance = useModernStore.getState().loyaltyPoints;

    if (currentBalance < points) {
      return { success: false, message: 'Insufficient loyalty points' };
    }

    const newBalance = currentBalance - points;
    useModernStore.getState().setLoyaltyPoints(newBalance);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) await client.from('loyalty_points').update({ current_balance: newBalance, redeemed_points: points }).eq('user_id', userId);
    }

    return {
      success: true,
      pointsRedeemed: points,
      newBalance,
      discountAmount: loyaltyService.pointsToDiscount(points),
    };
  },

  pointsToDiscount: (points) => {
    return points * 0.01; // 1 point = $0.01
  },

  discountToPoints: (discountAmount) => {
    return Math.floor(discountAmount / 0.01);
  },

  calculateTier: (points) => {
    if (points >= loyaltyService.TIER_SETTINGS.platinum.minPoints) return 'platinum';
    if (points >= loyaltyService.TIER_SETTINGS.gold.minPoints) return 'gold';
    if (points >= loyaltyService.TIER_SETTINGS.silver.minPoints) return 'silver';
    return 'bronze';
  },

  getTierInfo: (tier) => {
    return loyaltyService.TIER_SETTINGS[tier];
  },

  getCurrentTierInfo: () => {
    const tier = useModernStore.getState().loyaltyTier;
    return loyaltyService.getTierInfo(tier);
  },

  getPointsToNextTier: () => {
    const currentPoints = useModernStore.getState().loyaltyPoints;
    const currentTier = useModernStore.getState().loyaltyTier;

    let nextTierMinPoints = Infinity;
    const tiers = Object.entries(loyaltyService.TIER_SETTINGS).sort(
      (a, b) => a[1].minPoints - b[1].minPoints
    );

    for (const [tier, settings] of tiers) {
      if (settings.minPoints > currentPoints) {
        nextTierMinPoints = settings.minPoints;
        break;
      }
    }

    return Math.max(0, nextTierMinPoints - currentPoints);
  },

  notifyTierUpgrade: (userId, newTier) => {
    const tierInfo = loyaltyService.getTierInfo(newTier);
    notificationService.sendNotification(
      userId,
      'loyalty_tier_upgrade',
      `🎉 Welcome to ${newTier.toUpperCase()} Tier!`,
      `Enjoy exclusive benefits: ${tierInfo.benefits.join(', ')}`,
      '/account'
    );
  },

  getEstimatedEarnings: (purchaseAmount) => {
    return Math.floor(purchaseAmount * loyaltyService.POINTS_RULES.purchase);
  },

  generateReferralCode: (userId) => {
    return `FM_${userId.substring(0, 8)}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  },

  validateReferralCode: (code, userId) => {
    // Stub - implement actual validation
    return code.startsWith('FM_') && !code.includes(userId);
  },
};

export default loyaltyService;
