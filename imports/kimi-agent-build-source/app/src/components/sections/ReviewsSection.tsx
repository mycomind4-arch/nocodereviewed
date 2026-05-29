import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { tools } from '@/data/mockData';
import SectionMarker from '@/components/shared/SectionMarker';
import ToolCard from '@/components/shared/ToolCard';
import StarRating from '@/components/shared/StarRating';

type Tab = 'recent' | 'rated';

export default function ReviewsSection() {
  const [activeTab, setActiveTab] = useState<Tab>('rated');
  const sortedTools = activeTab === 'rated'
    ? [...tools].sort((a, b) => b.ratingOverall - a.ratingOverall)
    : [...tools].sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0));

  const featuredTool = sortedTools[0];

  return (
    <section id="reviews" className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionMarker number="01" label="Featured Reviews" />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Featured Tool */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <div className="relative rounded-2xl overflow-hidden bg-[#011A24] border border-white/10">
              <img
                src={featuredTool.imageUrl}
                alt={featuredTool.name}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#011A24] via-[#011A24]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-[#C8FF2F]/20 text-[#C8FF2F] text-xs font-medium rounded-full">
                    Featured Review
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{featuredTool.name}</h3>
                <p className="text-white/60 text-sm mb-3 line-clamp-2">{featuredTool.verdict}</p>
                <StarRating rating={featuredTool.ratingOverall} size={18} />
                <Link
                  to={`/tools/${featuredTool.slug}`}
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg bg-[#C8FF2F] text-[#012A38] font-semibold text-sm hover:bg-[#a8df0f] transition-colors"
                >
                  Read Full Review
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right: Tool List */}
          <div>
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setActiveTab('rated')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === 'rated'
                    ? 'text-[#C8FF2F] border-[#C8FF2F]'
                    : 'text-white/50 border-transparent hover:text-white'
                }`}
              >
                Highest Rated
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === 'recent'
                    ? 'text-[#C8FF2F] border-[#C8FF2F]'
                    : 'text-white/50 border-transparent hover:text-white'
                }`}
              >
                Most Recent
              </button>
            </div>

            {/* Tool Cards */}
            <div className="space-y-4">
              {sortedTools.slice(0, 5).map((tool, i) => (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#C8FF2F] hover:text-[#a8df0f] transition-colors"
              >
                View all {tools.length} tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
