import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { tools } from '@/data/mockData';

const floatingKeywords = [
  { text: 'reviews', x: '15%', y: '20%', delay: 0 },
  { text: 'guides', x: '75%', y: '15%', delay: 0.5 },
  { text: 'compare', x: '85%', y: '60%', delay: 1 },
  { text: 'tutorials', x: '10%', y: '70%', delay: 1.5 },
  { text: 'ratings', x: '60%', y: '80%', delay: 0.8 },
  { text: 'no-code', x: '30%', y: '85%', delay: 1.2 },
  { text: 'AI tools', x: '80%', y: '30%', delay: 0.3 },
  { text: 'automation', x: '5%', y: '45%', delay: 1.8 },
  { text: 'ecommerce', x: '55%', y: '10%', delay: 0.6 },
  { text: 'databases', x: '90%', y: '85%', delay: 1.1 },
];

export default function HeroSection() {
  const [scrambleText, setScrambleText] = useState('');
  const targetText = 'Start here.';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  const scrambleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const resolvedLength = Math.floor(progress * targetText.length);
      let display = targetText.slice(0, resolvedLength);
      for (let i = resolvedLength; i < targetText.length; i++) {
        display += chars[Math.floor(Math.random() * chars.length)];
      }
      setScrambleText(display);
      if (frame >= totalFrames) {
        setScrambleText(targetText);
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Floating Keywords */}
      {floatingKeywords.map((kw, i) => (
        <motion.div
          key={kw.text}
          className="absolute text-sm font-medium select-none pointer-events-none"
          style={{
            left: kw.x,
            top: kw.y,
            color: i % 2 === 0 ? 'rgba(200,255,47,0.35)' : 'rgba(255,255,255,0.15)',
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + kw.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: kw.delay,
          }}
        >
          {kw.text}
        </motion.div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1
            ref={scrambleRef}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight"
          >
            {scrambleText}
          </h1>
          <p className="text-lg sm:text-xl text-white/50 mb-8">(or anywhere)</p>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Honest reviews, side-by-side comparisons, and hands-on guides for the best no-code platforms in 2026.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search 9+ tools, reviews, comparisons..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8FF2F]/50 text-base"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-6 sm:gap-10 text-sm text-white/50"
        >
          <div>
            <span className="text-2xl font-bold text-[#C8FF2F]">{tools.length}+</span>
            <span className="block mt-1">tools reviewed</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <span className="text-2xl font-bold text-[#C8FF2F]">1.2k</span>
            <span className="block mt-1">monthly readers</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <span className="text-2xl font-bold text-[#C8FF2F]">Free</span>
            <span className="block mt-1">forever</span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <a href="#reviews" className="inline-flex items-center gap-2 text-white/40 hover:text-[#C8FF2F] transition-colors text-sm">
            <span>Explore reviews</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#012A38] via-transparent to-[#012A38] pointer-events-none" />
    </section>
  );
}
