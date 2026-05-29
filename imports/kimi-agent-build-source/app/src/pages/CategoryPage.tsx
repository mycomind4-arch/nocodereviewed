import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getCategoryBySlug, getToolsByCategory } from '@/data/mockData';
import ToolCard from '@/components/shared/ToolCard';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || '');
  const categoryTools = getToolsByCategory(slug || '');

  if (!category) return <Navigate to="/tools" replace />;

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/tools" className="hover:text-white transition-colors">Tools</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{category.name}</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
            Best {category.name} Tools
          </h1>
          <p className="text-white/50 text-lg">{category.description} &mdash; Reviewed and ranked</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryTools.map((tool, i) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>

        {categoryTools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No tools in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
