import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-[#011A24] border border-[#C8FF2F]/20 rounded-2xl p-8 lg:p-12">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-[#C8FF2F]/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-[#C8FF2F]" />
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
          Get the weekly no-code digest
        </h3>
        <p className="text-white/50 mb-6">
          New tool reviews, comparison breakdowns, and early access to our guides. Every Tuesday. Free forever.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#C8FF2F] text-[#012A38] font-semibold hover:bg-[#a8df0f] transition-colors shrink-0"
          >
            Subscribe
          </button>
        </form>
        {status === 'success' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>You&apos;re in! Check your inbox to confirm.</span>
          </div>
        )}
        {status === 'error' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Please enter a valid email address.</span>
          </div>
        )}
      </div>
    </div>
  );
}
