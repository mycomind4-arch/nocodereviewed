import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { Tool } from '@/types';
import StarRating from './StarRating';

interface ToolCardProps {
  tool: Tool;
  showSponsored?: boolean;
}

export default function ToolCard({ tool, showSponsored = true }: ToolCardProps) {
  const isSponsored = showSponsored && tool.sponsored;

  return (
    <div className="group relative bg-white rounded-xl border border-[#e8e4dc] overflow-hidden card-hover">
      {isSponsored && (
        <div className="absolute top-3 right-3 z-10 bg-[#fff7ed] text-[#c2410c] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#fed7aa]">
          Sponsored
        </div>
      )}
      
      <div className="p-5">
        {/* Logo + Name */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#f3ede4] flex items-center justify-center shrink-0 overflow-hidden">
            {tool.imageUrl ? (
              <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-[#012A38]">{tool.name[0]}</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[#012A38] text-base leading-tight truncate">{tool.name}</h3>
            <p className="text-xs text-[#4a4845] mt-0.5 line-clamp-1">{tool.tagline}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={tool.ratingOverall} size={14} />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.category.slice(0, 2).map((cat) => (
            <span key={cat} className="px-2.5 py-0.5 bg-[#f3ede4] text-[#4a4845] text-[11px] font-medium rounded-full capitalize">
              {cat.replace('-', ' ')}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/tools/${tool.slug}`}
            className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold bg-[#C8FF2F] text-[#012A38] hover:bg-[#a8df0f] transition-colors"
          >
            Read Review
          </Link>
          <a
            href={tool.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg border border-[#e8e4dc] text-[#4a4845] hover:border-[#C8FF2F] hover:text-[#012A38] transition-colors"
            aria-label={`Visit ${tool.name}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
