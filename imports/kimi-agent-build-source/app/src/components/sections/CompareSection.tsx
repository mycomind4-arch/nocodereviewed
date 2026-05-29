import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionMarker from '@/components/shared/SectionMarker';
import { comparisons } from '@/data/mockData';
import ComparisonCard from '@/components/shared/ComparisonCard';

export default function CompareSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionMarker number="03" label="Compare tools." />

        {/* VS Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-[300px] lg:h-[400px] rounded-2xl bg-[#011A24] border border-white/10 mb-12 overflow-hidden flex items-center justify-center"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotateY: [0, 10, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[120px] lg:text-[180px] font-bold text-[#C8FF2F]/20 select-none"
              style={{ perspective: '1000px' }}
            >
              VS
            </motion.div>
          </div>
          <div className="relative z-10 text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Side-by-side comparisons
            </h3>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              See how tools stack up on features, pricing, ease of use, and more.
            </p>
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C8FF2F] text-[#012A38] font-semibold hover:bg-[#a8df0f] transition-colors"
            >
              Compare Tools
            </Link>
          </div>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisons.map((comp, i) => (
            <motion.div
              key={comp.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <ComparisonCard comparison={comp} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
