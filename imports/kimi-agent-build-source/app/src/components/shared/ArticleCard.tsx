import { Link } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const typeLabels: Record<string, string> = {
    review: 'Review',
    comparison: 'Comparison',
    tutorial: 'Tutorial',
    'best-of': 'Best Of',
    guide: 'Guide',
    news: 'News',
  };

  const typeColors: Record<string, string> = {
    review: 'bg-emerald-500/10 text-emerald-400',
    comparison: 'bg-blue-500/10 text-blue-400',
    tutorial: 'bg-purple-500/10 text-purple-400',
    'best-of': 'bg-amber-500/10 text-amber-400',
    guide: 'bg-cyan-500/10 text-cyan-400',
    news: 'bg-pink-500/10 text-pink-400',
  };

  return (
    <Link to={`/blog/${article.slug}`} className="group block">
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden card-hover">
        <div className="aspect-video overflow-hidden bg-[#011A24]">
          <img
            src={article.featuredImageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${typeColors[article.articleType]}`}>
              {typeLabels[article.articleType]}
            </span>
            <span className="text-xs text-white/40">{article.category}</span>
          </div>
          <h3 className="font-semibold text-white text-lg leading-tight mb-2 group-hover:text-[#C8FF2F] transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-white/50 line-clamp-2 mb-4">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTimeMins} min read
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {article.wordCount.toLocaleString()} words
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
