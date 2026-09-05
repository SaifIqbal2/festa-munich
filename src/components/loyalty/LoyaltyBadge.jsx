import React from 'react';
import { Star } from 'lucide-react';
import { useModernStore } from '../../stores/modernStore';
import { loyaltyService } from '../../services/loyaltyService';
import './LoyaltyBadge.css';

export const LoyaltyBadge = () => {
  const { loyaltyPoints, loyaltyTier } = useModernStore();
  const tierInfo = loyaltyService.getTierInfo(loyaltyTier);
  const pointsToNext = loyaltyService.getPointsToNextTier();

  const tierColors = {
    bronze: { bg: '#CD7F32', text: '#ffffff' },
    silver: { bg: '#C0C0C0', text: '#000000' },
    gold: { bg: '#FFD700', text: '#000000' },
    platinum: { bg: '#E5E4E2', text: '#000000' },
  };

  const colors = tierColors[loyaltyTier];

  return (
    <div className="loyalty-badge" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <div className="loyalty-badge-content">
        <div className="loyalty-badge-header">
          <Star size={16} fill="currentColor" />
          <span className="loyalty-tier-label">{loyaltyTier.toUpperCase()}</span>
        </div>

        <div className="loyalty-badge-points">
          <p className="loyalty-points-value">{loyaltyPoints.toLocaleString()}</p>
          <p className="loyalty-points-label">Points</p>
        </div>

        {pointsToNext > 0 && (
          <div className="loyalty-next-tier">
            <p>{pointsToNext} points to next tier</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((loyaltyPoints / (loyaltyPoints + pointsToNext)) * 100).toFixed(0)}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="loyalty-benefits">
          <p className="loyalty-benefits-title">Your Benefits:</p>
          <ul>
            {tierInfo.benefits.slice(0, 2).map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyBadge;
