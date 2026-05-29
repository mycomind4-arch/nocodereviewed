import { Link } from 'react-router-dom';
import { Zap, Twitter, Linkedin, Youtube } from 'lucide-react';
import { tools, comparisons } from '@/data/mockData';

export default function Footer() {
  const topTools = [...tools].sort((a, b) => b.ratingOverall - a.ratingOverall).slice(0, 6);
  const topComparisons = [...comparisons].sort((a, b) => b.viewCount - a.viewCount).slice(0, 6);

  return (
    <footer className="bg-[#011A24] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#C8FF2F]" />
              <span className="font-bold text-white">No-Code Reviews</span>
            </Link>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Honest, in-depth reviews of no-code platforms. We help you choose the right tool to build without code.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-[#C8FF2F] hover:bg-white/10 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-[#C8FF2F] hover:bg-white/10 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-[#C8FF2F] hover:bg-white/10 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Top Tools */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Top Tools</h4>
            <ul className="space-y-2.5">
              {topTools.map((tool) => (
                <li key={tool.slug}>
                  <Link to={`/tools/${tool.slug}`} className="text-sm text-white/50 hover:text-[#C8FF2F] transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Comparisons */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Popular Comparisons</h4>
            <ul className="space-y-2.5">
              {topComparisons.map((comp) => (
                <li key={comp.slug}>
                  <Link to={`/compare/${comp.slug}`} className="text-sm text-white/50 hover:text-[#C8FF2F] transition-colors">
                    {comp.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-white/50 hover:text-[#C8FF2F] transition-colors">About</Link></li>
              <li><Link to="/about" className="text-sm text-white/50 hover:text-[#C8FF2F] transition-colors">Methodology</Link></li>
              <li><Link to="/advertise" className="text-sm text-white/50 hover:text-[#C8FF2F] transition-colors">Advertise</Link></li>
              <li><Link to="/submit" className="text-sm text-white/50 hover:text-[#C8FF2F] transition-colors">Submit a Tool</Link></li>
              <li><Link to="/about" className="text-sm text-white/50 hover:text-[#C8FF2F] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/about" className="text-sm text-white/50 hover:text-[#C8FF2F] transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; 2026 No-Code Reviews. All reviews are editorially independent. Some links are affiliate links.
          </p>
          <p className="text-xs text-white/30">
            Built with passion for the no-code community.
          </p>
        </div>
      </div>
    </footer>
  );
}
