import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Benefits', href: '/#benefits' },
  { label: 'About', href: '/#about' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img
              src="/images/logo-light.png"
              alt="Survival Strategies, Inc."
              className="h-9 sm:h-11 w-auto"
            />
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#download"
              className="ml-2 px-5 py-2.5 bg-white text-navy-900 text-sm font-bold rounded-md hover:bg-gray-100 transition-colors"
            >
              Get the Scripts
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white/70 hover:text-white p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-navy-950/98 backdrop-blur-md border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3">
                <a
                  href="/#download"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-5 py-3 bg-white text-navy-900 font-bold rounded-md hover:bg-gray-100 transition-colors"
                >
                  Get the Scripts
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
