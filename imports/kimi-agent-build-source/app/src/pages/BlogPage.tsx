import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { articles } from '@/data/mockData';
import ArticleCard from '@/components/shared/ArticleCard';

const typeFilters = [
  { key: 'all', label: 'All' },
  { key: 'review', label: 'Reviews' },
  { key: 'comparison', label: 'Comparisons' },
  { key: 'tutorial', label: 'Tutorials' },
  { key: 'best-of', label: 'Best-Of Lists' },
  { key: 'guide', label: 'Guides' },
];

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  let filtered = activeFilter === 'all'
    ? [...articles]
    : articles.filter(a => a.articleType === activeFilter);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Blog & Guides</h1>
          <p className="text-white/50 text-lg">In-depth reviews, comparisons, tutorials, and best-of lists</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8FF2F]/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {typeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === f.key
                  ? 'bg-[#C8FF2F] text-[#012A38]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
