import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { tools, categories } from '@/data/mockData';
import ToolCard from '@/components/shared/ToolCard';

type SortOption = 'rating' | 'newest' | 'price-low' | 'price-high';

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [searchQuery, setSearchQuery] = useState('');

  let filtered = activeCategory === 'all'
    ? [...tools]
    : tools.filter(t => t.category.includes(activeCategory));

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.category.some(c => c.toLowerCase().includes(q))
    );
  }

  switch (sortBy) {
    case 'rating':
      filtered.sort((a, b) => b.ratingOverall - a.ratingOverall);
      break;
    case 'price-low':
      filtered.sort((a, b) => (a.pricingTiers[0]?.priceMonthly || 0) - (b.pricingTiers[0]?.priceMonthly || 0));
      break;
    case 'price-high':
      filtered.sort((a, b) => (b.pricingTiers[b.pricingTiers.length - 1]?.priceMonthly || 0) - (a.pricingTiers[a.pricingTiers.length - 1]?.priceMonthly || 0));
      break;
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">All Tools</h1>
          <p className="text-white/50 text-lg">Browse and compare {tools.length}+ no-code platforms</p>
        </motion.div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8FF2F]/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-white/40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#C8FF2F]/50 cursor-pointer"
            >
              <option value="rating" className="bg-[#012A38]">Best Rated</option>
              <option value="newest" className="bg-[#012A38]">Newest</option>
              <option value="price-low" className="bg-[#012A38]">Price: Low to High</option>
              <option value="price-high" className="bg-[#012A38]">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#C8FF2F] text-[#012A38]'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-[#C8FF2F] text-[#012A38]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tool Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((tool, i) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No tools found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
