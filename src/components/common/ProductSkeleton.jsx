import React from 'react';

/**
 * ProductSkeleton — Loading placeholder card for product grid.
 * Shows animated shimmer while products are fetching from Supabase.
 */
function SkeletonBox({ width = '100%', height = '1rem', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.5s infinite',
        borderRadius: '3px',
        ...style
      }}
    />
  );
}

export default function ProductSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      {/* Image placeholder */}
      <SkeletonBox height='360px' style={{ borderRadius: '0' }} />
      {/* Category label */}
      <SkeletonBox width='40%' height='0.7rem' />
      {/* Title */}
      <SkeletonBox width='85%' height='1rem' />
      {/* Price */}
      <SkeletonBox width='30%' height='1.1rem' />
      {/* CTA */}
      <SkeletonBox height='2.5rem' style={{ marginTop: '0.4rem' }} />

      <style>{`
        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
