import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { articles } from '@/data/mockData';
import SectionMarker from '@/components/shared/SectionMarker';

const guideArticles = articles.filter(a => a.articleType === 'guide' || a.articleType === 'best-of' || a.articleType === 'tutorial');

export default function GuidesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionMarker number="02" label="Guides and deep-dives." />

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {guideArticles.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="min-w-[320px] sm:min-w-[380px] snap-start"
            >
              <Link to={`/blog/${article.slug}`} className="group block">
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden card-hover h-full">
                  <div className="aspect-[4/3] overflow-hidden bg-[#011A24]">
                    <img
                      src={article.featuredImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-[#C8FF2F] uppercase tracking-wider">
                      {article.articleType}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-2 mb-3 group-hover:text-[#C8FF2F] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[#C8FF2F] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Read guide</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
