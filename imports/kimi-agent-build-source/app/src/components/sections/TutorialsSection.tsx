import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionMarker from '@/components/shared/SectionMarker';

const tutorials = [
  { title: 'How to Build Your First App with Lovable', image: '/images/tutorial-beginners.jpg', slug: 'lovable-review-2026', duration: '12 min' },
  { title: 'Webflow for Beginners: Complete Tutorial', image: '/images/tool-webflow.jpg', slug: 'webflow-vs-framer-2026', duration: '18 min' },
  { title: 'Master Framer: From Design to Published Site', image: '/images/tutorial-framer.jpg', slug: 'best-no-code-ai-builders', duration: '15 min' },
];

export default function TutorialsSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionMarker number="04" label="Tutorials." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial, i) => (
            <motion.div
              key={tutorial.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link to={`/blog/${tutorial.slug}`} className="group block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#011A24] border border-white/10 mb-4">
                  <img
                    src={tutorial.image}
                    alt={tutorial.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#C8FF2F] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-6 h-6 text-[#012A38] ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 rounded-md text-xs text-white font-medium">
                    {tutorial.duration}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#C8FF2F] transition-colors leading-snug">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-white/40 mt-1">Tutorial</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
