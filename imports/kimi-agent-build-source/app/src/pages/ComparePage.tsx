import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { comparisons, tools } from '@/data/mockData';
import ComparisonCard from '@/components/shared/ComparisonCard';

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [toolA, setToolA] = useState('');
  const [toolB, setToolB] = useState('');

  const filtered = searchQuery
    ? comparisons.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.toolA.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.toolB.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : comparisons;

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Compare Tools</h1>
          <p className="text-white/50 text-lg">Side-by-side comparisons of the most popular no-code platforms</p>
        </motion.div>

        {/* Custom Comparison Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 mb-12"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Build Your Own Comparison</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select
              value={toolA}
              onChange={(e) => setToolA(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#C8FF2F]/50"
            >
              <option value="" className="bg-[#012A38]">Select first tool...</option>
              {tools.map(t => <option key={t.slug} value={t.slug} className="bg-[#012A38]">{t.name}</option>)}
            </select>
            <span className="text-lg font-bold text-[#C8FF2F]">VS</span>
            <select
              value={toolB}
              onChange={(e) => setToolB(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#C8FF2F]/50"
            >
              <option value="" className="bg-[#012A38]">Select second tool...</option>
              {tools.map(t => <option key={t.slug} value={t.slug} className="bg-[#012A38]">{t.name}</option>)}
            </select>
            <Link
              to={toolA && toolB ? `/compare/${toolA}-vs-${toolB}` : '#'}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                toolA && toolB
                  ? 'bg-[#C8FF2F] text-[#012A38] hover:bg-[#a8df0f]'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              Compare <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comparisons..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8FF2F]/50"
          />
        </div>

        {/* Comparison Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp, i) => (
            <motion.div
              key={comp.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ComparisonCard comparison={comp} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
