import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ChevronRight, Share2, Twitter, Linkedin } from 'lucide-react';
import { getArticleBySlug, articles } from '@/data/mockData';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug || '');

  if (!article) return <Navigate to="/blog" replace />;

  const related = articles
    .filter(a => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3);

  const typeLabel = article.articleType.charAt(0).toUpperCase() + article.articleType.slice(1);

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{article.title}</span>
        </nav>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-[#C8FF2F]/10 text-[#C8FF2F] text-sm font-medium rounded-full mb-4">
              {typeLabel}
            </span>
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
              <span>{article.author}</span>
              <span>&middot;</span>
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>&middot;</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.readingTimeMins} min read</span>
              <span>&middot;</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {article.wordCount.toLocaleString()} words</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video rounded-2xl overflow-hidden bg-[#011A24] mb-10">
            <img src={article.featuredImageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>

          {/* Body */}
          <div className="prose prose-invert prose-lg max-w-none mb-12">
            <p className="text-xl text-white/80 leading-relaxed">{article.excerpt}</p>
            <div className="mt-8 space-y-4 text-white/70 leading-relaxed">
              <p>This is a detailed article about {article.title.toLowerCase()}. In this comprehensive guide, we explore all the key aspects you need to understand before making a decision.</p>
              <h2 className="text-2xl font-bold text-white mt-10 mb-4">Key Highlights</h2>
              <p>Our team spent over 40 hours testing and researching to bring you the most accurate and up-to-date information. We evaluated each platform across five key dimensions: ease of use, features, pricing, support, and overall value.</p>
              <h2 className="text-2xl font-bold text-white mt-10 mb-4">What You Will Learn</h2>
              <ul className="space-y-2">
                <li>How each platform compares on core features</li>
                <li>Pricing breakdowns and hidden costs</li>
                <li>Who each tool is best suited for</li>
                <li>Real user feedback and ratings</li>
                <li>Our final recommendations</li>
              </ul>
              <h2 className="text-2xl font-bold text-white mt-10 mb-4">Final Thoughts</h2>
              <p>After extensive testing, we believe the right choice depends on your specific needs, budget, and technical comfort level. Each platform has its strengths and ideal use cases.</p>
            </div>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 mb-12">
            <span className="text-sm text-white/50">Share:</span>
            <button className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-[#C8FF2F] hover:bg-white/10 transition-colors">
              <Twitter className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-[#C8FF2F] hover:bg-white/10 transition-colors">
              <Linkedin className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-[#C8FF2F] hover:bg-white/10 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white/5 text-white/50 text-sm rounded-full capitalize">
                {tag}
              </span>
            ))}
          </div>
        </motion.article>

        {/* Related */}
        {related.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
            <div className="space-y-4">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#C8FF2F]/30 transition-colors group">
                  <img src={r.featuredImageUrl} alt={r.title} className="w-24 h-16 rounded-lg object-cover shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-[#C8FF2F] transition-colors line-clamp-1">{r.title}</h3>
                    <p className="text-sm text-white/40 mt-1">{r.readingTimeMins} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <NewsletterSignup />
      </div>
    </div>
  );
}
