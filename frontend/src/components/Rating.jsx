import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, numReviews, showCount = true, size = 16 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="d-inline-flex align-items-center gap-1">
      <div className="rating-stars">
        {stars.map((star) => (
          <Star
            key={star}
            size={size}
            fill={value >= star ? '#f59e0b' : value >= star - 0.5 ? 'url(#half-star)' : 'none'}
            color={value >= star - 0.5 ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-muted ms-1 small" style={{ fontSize: '0.85rem' }}>
          ({numReviews || 0})
        </span>
      )}
    </div>
  );
};

export default Rating;
