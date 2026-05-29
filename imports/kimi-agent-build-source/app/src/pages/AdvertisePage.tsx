import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, TrendingUp, Users, Eye } from 'lucide-react';

export default function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Reach No-Code Builders</h1>
          <p className="text-white/50 text-lg">Advertise your tool to thousands of engaged no-code enthusiasts</p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Users, label: 'Monthly Readers', value: '12,000+' },
            { icon: Eye, label: 'Avg. Time on Page', value: '4m 32s' },
            { icon: TrendingUp, label: 'Subscriber Growth', value: '+15%/mo' },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-[#C8FF2F] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Slots */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sponsorship Slots</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Homepage Position 1', desc: 'Top featured card on homepage', price: '$500/mo', available: true },
              { name: 'Homepage Position 4', desc: 'Prominent placement in tool grid', price: '$350/mo', available: true },
              { name: 'Newsletter Sponsor', desc: 'Featured in weekly digest', price: '$250/issue', available: false },
            ].map((slot) => (
              <div key={slot.name} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white text-sm">{slot.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    slot.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {slot.available ? 'Available' : 'Booked'}
                  </span>
                </div>
                <p className="text-sm text-white/50 mb-4">{slot.desc}</p>
                <div className="text-lg font-bold text-[#C8FF2F]">{slot.price}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Message sent!</h2>
              <p className="text-white/60">We will get back to you within 2 business days.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-6">Get in Touch</h2>
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required placeholder="Your name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50" />
                  <input required type="email" placeholder="Email address"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50" />
                </div>
                <input required placeholder="Company name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50" />
                <select required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#C8FF2F]/50"
                  defaultValue=""
                >
                  <option value="" disabled className="bg-[#012A38]">Which slot interests you?</option>
                  <option value="homepage-1" className="bg-[#012A38]">Homepage Position 1</option>
                  <option value="homepage-4" className="bg-[#012A38]">Homepage Position 4</option>
                  <option value="newsletter" className="bg-[#012A38]">Newsletter Sponsor</option>
                </select>
                <textarea placeholder="Your message" rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50 resize-none" />
                <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C8FF2F] text-[#012A38] font-semibold hover:bg-[#a8df0f] transition-colors">
                  <Mail className="w-4 h-4" /> Send Message
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
