import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Check, X, ArrowRight, ChevronRight } from 'lucide-react';
import { getToolBySlug, getRelatedTools, getRelatedComparisons, userRatings } from '@/data/mockData';
import StarRating from '@/components/shared/StarRating';
import ToolCard from '@/components/shared/ToolCard';
import ComparisonCard from '@/components/shared/ComparisonCard';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug || '');

  if (!tool) return <Navigate to="/tools" replace />;

  const relatedTools = getRelatedTools(tool.id, 3);
  const relatedComparisons = getRelatedComparisons(tool.id, 2);
  const ratings = userRatings.filter(r => r.toolId === tool.id && r.approved);

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/tools" className="hover:text-white transition-colors">Tools</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{tool.name}</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-[#f3ede4] flex items-center justify-center overflow-hidden">
                  <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white">{tool.name}</h1>
                  <p className="text-white/50">{tool.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <StarRating rating={tool.ratingOverall} size={24} reviewCount={ratings.length} />
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {tool.category.map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${cat}`}
                    className="px-3 py-1 bg-white/5 text-white/60 text-sm rounded-full hover:bg-[#C8FF2F]/10 hover:text-[#C8FF2F] transition-colors capitalize"
                  >
                    {cat.replace('-', ' ')}
                  </Link>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C8FF2F] text-[#012A38] font-semibold hover:bg-[#a8df0f] transition-colors"
                >
                  Try {tool.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                >
                  Visit Website
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Quick Specs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Free Plan</span>
                    <span className="text-white font-medium">{tool.pricingTiers.some(p => p.priceMonthly === 0) ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Starting Price</span>
                    <span className="text-white font-medium">
                      ${Math.min(...tool.pricingTiers.map(p => p.priceMonthly))}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Categories</span>
                    <span className="text-white font-medium">{tool.category.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rating Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Rating Breakdown</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Overall', value: tool.ratingOverall },
              { label: 'Ease of Use', value: tool.ratingEase },
              { label: 'Features', value: tool.ratingFeatures },
              { label: 'Pricing', value: tool.ratingPricing },
              { label: 'Support', value: tool.ratingSupport },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-[#C8FF2F] mb-1">{item.value.toFixed(1)}</div>
                <div className="text-sm text-white/50">{item.label}</div>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C8FF2F] rounded-full transition-all"
                    style={{ width: `${(item.value / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Review Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">Our Verdict</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">{tool.verdict}</p>
            <div className="prose prose-invert max-w-none">
              {tool.reviewBody.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('## ')) {
                  return <h3 key={i} className="text-xl font-bold text-white mt-8 mb-4">{paragraph.replace('## ', '')}</h3>;
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={i} className="list-disc list-inside space-y-2 text-white/70 mb-4">
                      {paragraph.split('\n').map((item, j) => (
                        <li key={j}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="text-white/70 leading-relaxed mb-4">{paragraph}</p>;
              })}
            </div>
          </div>
        </motion.div>

        {/* Pros & Cons */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">Pros</h3>
            <ul className="space-y-3">
              {tool.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-3 text-white/70">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-red-500/5 border border-red-500/20 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-red-400 mb-4">Cons</h3>
            <ul className="space-y-3">
              {tool.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-3 text-white/70">
                  <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Pricing</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tool.pricingTiers.map((tier) => (
              <div key={tier.name} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#C8FF2F]/30 transition-colors">
                <h3 className="font-semibold text-white mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#C8FF2F]">${tier.priceMonthly}</span>
                  <span className="text-white/40">/mo</span>
                  {tier.priceAnnual > 0 && (
                    <p className="text-sm text-white/40 mt-1">${tier.priceAnnual}/yr (save {Math.round((1 - tier.priceAnnual / (tier.priceMonthly * 12)) * 100)}%)</p>
                  )}
                </div>
                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <Check className="w-4 h-4 text-[#C8FF2F] shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* User Ratings */}
        {ratings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">User Reviews</h2>
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <StarRating rating={rating.rating} size={16} />
                    <span className="text-sm text-white/40">{rating.reviewerName}</span>
                  </div>
                  <p className="text-white/70">{rating.reviewText}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Comparisons */}
        {relatedComparisons.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Compare {tool.name} with...</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedComparisons.map((comp) => (
                <ComparisonCard key={comp.slug} comparison={comp} />
              ))}
            </div>
          </div>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Similar Tools</h2>
              <Link to="/tools" className="text-sm text-[#C8FF2F] hover:text-[#a8df0f] transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        )}

        {/* Newsletter */}
        <NewsletterSignup />
      </div>
    </div>
  );
}
