import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Trophy, ExternalLink, Check } from 'lucide-react';
import { getComparisonBySlug } from '@/data/mockData';
import StarRating from '@/components/shared/StarRating';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

export default function ComparisonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const comparison = getComparisonBySlug(slug || '');

  if (!comparison) return <Navigate to="/compare" replace />;

  const { toolA, toolB } = comparison;
  const aWins = comparison.winnerOverall === toolA.slug;

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/compare" className="hover:text-white transition-colors">Compare</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{toolA.name} vs {toolB.name}</span>
        </nav>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 lg:gap-10 mb-6">
            <div className="text-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-[#f3ede4] flex items-center justify-center mx-auto mb-3 overflow-hidden">
                <img src={toolA.imageUrl} alt={toolA.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-white">{toolA.name}</h2>
              {aWins && <span className="inline-flex items-center gap-1 text-xs text-[#C8FF2F] mt-1"><Trophy className="w-3 h-3" /> Winner</span>}
            </div>
            <div className="px-6 py-3 bg-[#C8FF2F]/10 rounded-xl">
              <span className="text-3xl lg:text-4xl font-bold text-[#C8FF2F]">VS</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-[#f3ede4] flex items-center justify-center mx-auto mb-3 overflow-hidden">
                <img src={toolB.imageUrl} alt={toolB.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-white">{toolB.name}</h2>
              {!aWins && comparison.winnerOverall && <span className="inline-flex items-center gap-1 text-xs text-[#C8FF2F] mt-1"><Trophy className="w-3 h-3" /> Winner</span>}
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{comparison.title}</h1>
          <p className="text-white/50">Last updated {new Date(comparison.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 gap-px bg-white/10">
              {/* Header */}
              <div className="bg-[#012A38] p-4 font-semibold text-white/50 text-sm"></div>
              <div className="bg-[#012A38] p-4 font-semibold text-white text-center">{toolA.name}</div>
              <div className="bg-[#012A38] p-4 font-semibold text-white text-center">{toolB.name}</div>

              {/* Ratings */}
              {[
                { label: 'Overall Rating', a: toolA.ratingOverall, b: toolB.ratingOverall },
                { label: 'Ease of Use', a: toolA.ratingEase, b: toolB.ratingEase },
                { label: 'Features', a: toolA.ratingFeatures, b: toolB.ratingFeatures },
                { label: 'Pricing', a: toolA.ratingPricing, b: toolB.ratingPricing },
                { label: 'Support', a: toolA.ratingSupport, b: toolB.ratingSupport },
              ].map((row, i) => (
                <>
                  <div key={`l-${i}`} className="bg-[#012A38] p-4 text-sm text-white/70">{row.label}</div>
                  <div key={`a-${i}`} className={`bg-[#012A38] p-4 text-center ${row.a >= row.b ? 'text-[#C8FF2F]' : 'text-white/60'}`}>
                    <span className="font-bold text-lg">{row.a.toFixed(1)}</span>
                    <StarRating rating={row.a} size={12} showValue={false} />
                  </div>
                  <div key={`b-${i}`} className={`bg-[#012A38] p-4 text-center ${row.b >= row.a ? 'text-[#C8FF2F]' : 'text-white/60'}`}>
                    <span className="font-bold text-lg">{row.b.toFixed(1)}</span>
                    <StarRating rating={row.b} size={12} showValue={false} />
                  </div>
                </>
              ))}

              {/* Starting Price */}
              <div className="bg-[#012A38] p-4 text-sm text-white/70">Starting Price</div>
              <div className="bg-[#012A38] p-4 text-center text-white font-medium">
                ${Math.min(...toolA.pricingTiers.map(p => p.priceMonthly))}/mo
              </div>
              <div className="bg-[#012A38] p-4 text-center text-white font-medium">
                ${Math.min(...toolB.pricingTiers.map(p => p.priceMonthly))}/mo
              </div>

              {/* Free Plan */}
              <div className="bg-[#012A38] p-4 text-sm text-white/70">Free Plan</div>
              <div className="bg-[#012A38] p-4 text-center">
                {toolA.pricingTiers.some(p => p.priceMonthly === 0) ? (
                  <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                ) : <span className="text-white/40">No</span>}
              </div>
              <div className="bg-[#012A38] p-4 text-center">
                {toolB.pricingTiers.some(p => p.priceMonthly === 0) ? (
                  <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                ) : <span className="text-white/40">No</span>}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <a href={toolA.affiliateUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#C8FF2F] text-[#012A38] font-semibold hover:bg-[#a8df0f] transition-colors"
          >
            Try {toolA.name} <ExternalLink className="w-4 h-4" />
          </a>
          <a href={toolB.affiliateUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/10"
          >
            Try {toolB.name} <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Written Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Head-to-Head Analysis</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 leading-relaxed">
              When comparing {toolA.name} and {toolB.name}, the choice really depends on what you are building and your technical comfort level.
            </p>
            <p className="text-white/70 leading-relaxed mt-4">
              <strong className="text-white">{toolA.name}</strong> excels in {toolA.category.includes('ai-tools') ? 'AI-powered development' : 'its core strength areas'}, 
              making it ideal for {toolA.bestFor.slice(0, 2).join(' and ')}. With a rating of {toolA.ratingOverall}/5, 
              it offers {toolA.pricingTiers.some(p => p.priceMonthly === 0) ? 'a generous free tier' : 'competitive pricing'} 
              starting at ${Math.min(...toolA.pricingTiers.map(p => p.priceMonthly))}/month.
            </p>
            <p className="text-white/70 leading-relaxed mt-4">
              <strong className="text-white">{toolB.name}</strong>, on the other hand, shines as a {toolB.tagline.toLowerCase()}. 
              It scores {toolB.ratingOverall}/5 overall and is particularly well-suited for {toolB.bestFor.slice(0, 2).join(' and ')}.
            </p>
            <h3 className="text-xl font-bold text-white mt-8 mb-3">The Verdict</h3>
            <p className="text-white/70 leading-relaxed">
              {comparison.winnerOverall
                ? `${comparison.winnerOverall === toolA.slug ? toolA.name : toolB.name} takes the win for most users, primarily due to its superior ${toolA.ratingOverall >= toolB.ratingOverall ? 'overall experience and feature set' : 'ease of use and accessibility'}.`
                : `Both tools are excellent in their own right. The choice comes down to your specific needs: choose ${toolA.name} for ${toolA.bestFor[0]} and ${toolB.name} for ${toolB.bestFor[0]}.`
              }
            </p>
          </div>
        </motion.div>

        <NewsletterSignup />
      </div>
    </div>
  );
}
