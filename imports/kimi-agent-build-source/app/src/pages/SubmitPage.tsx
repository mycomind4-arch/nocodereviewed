import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    toolName: '', toolUrl: '', category: '', description: '',
    pricing: '', hasAffiliate: false, affiliateUrl: '', email: '', source: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Submit a Tool</h1>
          <p className="text-white/50 text-lg mb-10">
            Know a great no-code tool we should review? Submit it here and our team will check it out.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center"
          >
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Thanks for your submission!</h2>
            <p className="text-white/60">We review new tool submissions weekly. We will email you at {form.email} if we decide to include it.</p>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleSubmit} className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tool Name *</label>
              <input required value={form.toolName} onChange={e => setForm({...form, toolName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tool URL *</label>
              <input required type="url" value={form.toolUrl} onChange={e => setForm({...form, toolUrl: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#C8FF2F]/50">
                <option value="" className="bg-[#012A38]">Select category...</option>
                <option value="website-builders" className="bg-[#012A38]">Website Builders</option>
                <option value="app-builders" className="bg-[#012A38]">App Builders</option>
                <option value="ecommerce" className="bg-[#012A38]">Ecommerce</option>
                <option value="automation" className="bg-[#012A38]">Automation</option>
                <option value="ai-tools" className="bg-[#012A38]">AI Tools</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Short Description *</label>
              <textarea required maxLength={200} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50 h-24 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Contact Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50" />
            </div>
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#C8FF2F] text-[#012A38] font-semibold hover:bg-[#a8df0f] transition-colors">
              <Send className="w-5 h-5" /> Submit Tool
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
