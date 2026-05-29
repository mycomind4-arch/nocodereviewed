import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({ rating, size = 16, showValue = true, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="text-[#C8FF2F] fill-[#C8FF2F]" style={{ width: size, height: size }} />
        ))}
        {hasHalf && (
          <div className="relative" style={{ width: size, height: size }}>
            <Star className="absolute text-white/20" style={{ width: size, height: size }} />
            <div className="absolute overflow-hidden" style={{ width: size / 2 }}>
              <Star className="text-[#C8FF2F] fill-[#C8FF2F]" style={{ width: size, height: size }} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="text-white/20" style={{ width: size, height: size }} />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-white/80 ml-1">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-white/40">({reviewCount})</span>
      )}
    </div>
  );
}
