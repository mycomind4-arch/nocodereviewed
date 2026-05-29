import { motion } from 'framer-motion';
import { Shield, Scale, Users, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">About No-Code Reviews</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              No-Code Reviews is the independent authority on no-code platforms. We believe everyone should be able to 
              choose the right tool with confidence, backed by honest, in-depth reviews that go beyond surface-level features.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Our Mission</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              The no-code space is exploding with new tools every month. But with so many options, making the right choice 
              has become harder than ever. Our mission is simple: cut through the marketing noise and give you the real, 
              unfiltered truth about every platform we review.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">How We Review</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Scale, title: 'Independent', desc: 'We purchase our own subscriptions. No sponsored reviews influence our ratings.' },
                { icon: Users, title: 'Real Testing', desc: 'Every tool is tested hands-on for at least 20 hours before we publish.' },
                { icon: Shield, title: 'Editorial Integrity', desc: 'Our editorial team has final say on all reviews and ratings.' },
                { icon: Mail, title: 'Community Feedback', desc: 'We incorporate verified user reviews into our scoring system.' },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <item.icon className="w-6 h-6 text-[#C8FF2F] mb-3" />
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Our Rating Methodology</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Each tool is scored on five key dimensions, each rated 1-5:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                { name: 'Ease of Use', desc: 'How intuitive is the interface? How steep is the learning curve?' },
                { name: 'Features', desc: 'Depth and breadth of functionality. What can you actually build?' },
                { name: 'Pricing', desc: 'Value for money. Free tier quality. Hidden costs.' },
                { name: 'Support', desc: 'Documentation quality, community size, customer service responsiveness.' },
                { name: 'Overall', desc: 'A holistic score considering all factors and real-world usability.' },
              ].map((item) => (
                <li key={item.name} className="flex gap-4 bg-white/5 rounded-xl p-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[#C8FF2F]/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#C8FF2F]">{item.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{item.name}</h4>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Affiliate Disclosure</h2>
            <p className="text-white/70 leading-relaxed mb-8">
              No-Code Reviews participates in affiliate programs. This means we may earn a commission when you click 
              on certain links and make a purchase. However, this does not influence our reviews or ratings in any way. 
              Our editorial team operates independently from our revenue team. We only recommend tools we genuinely believe in.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              Have a question, suggestion, or want to submit a tool for review? Reach out to us at{' '}
              <a href="mailto:hello@nocodereviews.com" className="text-[#C8FF2F] hover:underline">hello@nocodereviews.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
