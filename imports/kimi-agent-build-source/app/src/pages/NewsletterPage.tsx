import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const pastIssues = [
  { issue: 42, date: 'May 15, 2026', subject: 'The AI Builder Revolution: Lovable vs Bolt', preview: 'This week we compare the two hottest AI app builders and reveal which one comes out on top.' },
  { issue: 41, date: 'May 8, 2026', subject: 'Webflow New AI Features: Worth the Hype?', preview: 'Webflow just announced AI-powered site generation. We test it hands-on.' },
  { issue: 40, date: 'May 1, 2026', subject: '5 Automation Workflows That Save 10+ Hours/Week', preview: 'Zapier and Make workflows that will transform your productivity.' },
  { issue: 39, date: 'Apr 24, 2026', subject: 'Shopify vs WooCommerce in 2026', preview: 'The ecommerce platform showdown. Which is right for your store?' },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) { setSubscribed(true); setEmail(''); }
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-[#C8FF2F]/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-[#C8FF2F]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">The No-Code Digest</h1>
          <p className="text-white/50 text-lg">Weekly reviews, comparisons, and guides. Every Tuesday. Free forever.</p>
        </motion.div>

        {/* Subscribe Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12"
        >
          {subscribed ? (
            <div className="flex items-center justify-center gap-3 text-emerald-400">
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">You are in! Check your inbox to confirm.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email" required
                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50" />
              <button type="submit" className="px-6 py-3 rounded-xl bg-[#C8FF2F] text-[#012A38] font-semibold hover:bg-[#a8df0f] transition-colors inline-flex items-center justify-center gap-2">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>

        {/* Past Issues */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold text-white mb-6">Past Issues</h2>
          <div className="space-y-4">
            {pastIssues.map((issue) => (
              <div key={issue.issue} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-[#C8FF2F] bg-[#C8FF2F]/10 px-2 py-0.5 rounded-full">Issue #{issue.issue}</span>
                  <span className="text-xs text-white/40">{issue.date}</span>
                </div>
                <h3 className="font-semibold text-white mb-1">{issue.subject}</h3>
                <p className="text-sm text-white/50">{issue.preview}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
