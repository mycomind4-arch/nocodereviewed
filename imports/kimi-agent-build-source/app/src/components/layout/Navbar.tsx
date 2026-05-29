import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, Zap } from 'lucide-react';
import { useStore } from '@/stores/useStore';

const navLinks = [
  { label: 'Tools', href: '/tools' },
  { label: 'Compare', href: '/compare' },
  {
    label: 'Categories',
    href: '#',
    children: [
      { label: 'Website Builders', href: '/category/website-builders' },
      { label: 'App Builders', href: '/category/app-builders' },
      { label: 'Ecommerce', href: '/category/ecommerce' },
      { label: 'Automation', href: '/category/automation' },
      { label: 'Database', href: '/category/database' },
      { label: 'AI Tools', href: '/category/ai-tools' },
      { label: 'Form Builders', href: '/category/form-builders' },
      { label: 'No-Code CMS', href: '/category/nocode-cms' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Submit a Tool', href: '/submit' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { setMobileMenuOpen } = useStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#012A38]/90 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Zap className="w-6 h-6 text-[#C8FF2F]" />
              <span className="font-bold text-lg text-white tracking-tight hidden sm:block">
                No-Code Reviews
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setDropdownOpen(true)}
                  onMouseLeave={() => link.children && setDropdownOpen(false)}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      link.children
                        ? 'text-white/80 hover:text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                    onClick={(e) => link.children && e.preventDefault()}
                  >
                    {link.label}
                    {link.children && <ChevronDown className="w-3.5 h-3.5" />}
                  </Link>

                  {/* Dropdown */}
                  {link.children && dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-[#011A24] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                to="/newsletter"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-[#C8FF2F] text-[#012A38] hover:bg-[#a8df0f] transition-colors"
              >
                Get Free Guide
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(!mobileOpen);
                  setMobileMenuOpen(!mobileOpen);
                }}
                className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-[#012A38]/95 backdrop-blur-lg flex items-start justify-center pt-32">
          <div className="w-full max-w-2xl px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search tools, reviews, comparisons..."
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8FF2F]/50 text-lg"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/40 text-sm mt-3 text-center">
              Press ESC to close
            </p>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#012A38] pt-20 lg:hidden">
          <div className="px-6 py-8 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <div className="space-y-1">
                    <span className="block px-4 py-3 text-lg font-semibold text-white">
                      {link.label}
                    </span>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block px-4 py-2.5 text-base text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className="block px-4 py-3 text-lg font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-6">
              <Link
                to="/newsletter"
                className="block w-full text-center px-4 py-3 rounded-lg font-semibold bg-[#C8FF2F] text-[#012A38]"
              >
                Get Free Guide
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
