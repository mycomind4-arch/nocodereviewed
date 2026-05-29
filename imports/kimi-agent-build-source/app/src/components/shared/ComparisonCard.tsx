import { Link } from 'react-router-dom';
import type { Comparison } from '@/types';
import StarRating from './StarRating';

interface ComparisonCardProps {
  comparison: Comparison;
}

export default function ComparisonCard({ comparison }: ComparisonCardProps) {
  return (
    <Link to={`/compare/${comparison.slug}`} className="group block">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 card-hover">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-[#f3ede4] flex items-center justify-center mx-auto mb-2 overflow-hidden">
              <img src={comparison.toolA.imageUrl} alt={comparison.toolA.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-white">{comparison.toolA.name}</span>
          </div>
          <div className="px-4 py-2 bg-[#C8FF2F]/10 rounded-lg">
            <span className="text-lg font-bold text-[#C8FF2F]">VS</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-[#f3ede4] flex items-center justify-center mx-auto mb-2 overflow-hidden">
              <img src={comparison.toolB.imageUrl} alt={comparison.toolB.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-white">{comparison.toolB.name}</span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-white text-center mb-3 group-hover:text-[#C8FF2F] transition-colors">
          {comparison.title}
        </h3>
        <div className="flex items-center justify-center gap-6 text-xs text-white/40">
          <StarRating rating={comparison.toolA.ratingOverall} size={12} showValue={false} />
          <span>vs</span>
          <StarRating rating={comparison.toolB.ratingOverall} size={12} showValue={false} />
        </div>
        {comparison.winnerOverall && (
          <div className="mt-3 text-center">
            <span className="text-xs text-[#C8FF2F] font-medium bg-[#C8FF2F]/10 px-3 py-1 rounded-full">
              Winner: {comparison.winnerOverall === comparison.toolA.slug ? comparison.toolA.name : comparison.toolB.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
