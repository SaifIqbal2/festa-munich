import React from 'react';
import './Skeleton.css';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '4px' }) => (
  <div
    className="skeleton"
    style={{
      width,
      height,
      borderRadius,
    }}
  ></div>
);

export const ProductCardSkeleton = () => (
  <div className="product-card-skeleton">
    <Skeleton height="300px" borderRadius="8px" />
    <div className="skeleton-content">
      <Skeleton height="16px" width="80%" />
      <Skeleton height="14px" width="60%" style={{ marginTop: '8px' }} />
      <Skeleton height="20px" width="40%" style={{ marginTop: '12px' }} />
    </div>
  </div>
);

export const ImageSkeleton = ({ width = '100%', height = '200px' }) => (
  <Skeleton width={width} height={height} borderRadius="8px" />
);

export const TextSkeleton = ({ lines = 3, width = '100%' }) => (
  <div className="text-skeleton">
    {[...Array(lines)].map((_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? '80%' : width}
        height="16px"
        borderRadius="4px"
      />
    ))}
  </div>
);

export default Skeleton;
