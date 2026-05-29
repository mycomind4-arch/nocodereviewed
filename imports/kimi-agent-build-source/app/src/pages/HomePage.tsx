import HeroSection from '@/components/sections/HeroSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import GuidesSection from '@/components/sections/GuidesSection';
import CompareSection from '@/components/sections/CompareSection';
import TutorialsSection from '@/components/sections/TutorialsSection';
import PlatformerSection from '@/components/sections/PlatformerSection';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import ArticleCard from '@/components/shared/ArticleCard';
import { articles } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <HeroSection />
      <ReviewsSection />
      <GuidesSection />
      <CompareSection />
      <TutorialsSection />
      <PlatformerSection />

      {/* Latest Articles */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-6xl lg:text-8xl font-bold text-white/5">06</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white -mt-4">Latest articles</h2>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#C8FF2F] hover:text-[#a8df0f] transition-colors"
            >
              View all articles
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
