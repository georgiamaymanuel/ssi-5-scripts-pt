import { motion } from 'framer-motion';
import LeadForm from './LeadForm';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />

      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-sky-accent/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-navy-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-32 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sky-light font-semibold text-sm sm:text-base uppercase tracking-wider mb-4"
            >
              Free Download for Practice Owners
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-extrabold text-white mb-6"
            >
              Stop Revenue Leaks at&nbsp;Your{' '}
              <span className="text-sky-pale">Front&nbsp;Desk</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-white/70 leading-relaxed mb-8 max-w-lg"
            >
              Get 5 proven, word-for-word scripts that give your front desk team
              the confidence to reduce cancellations, handle objections, and keep
              patients committed to their&nbsp;care&nbsp;plan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6 text-white/60 text-sm mb-10 lg:mb-0"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sky-pale" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Word-for-word scripts
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sky-pale" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Proven in 1,000+ practices
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sky-pale" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Instant PDF download
              </div>
            </motion.div>
          </div>

          {/* Right column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-8 sm:p-10">
              <h2 className="text-xl font-bold text-white text-center mb-2">
                Get Your Free Scripts
              </h2>
              <p className="text-white/60 text-center text-sm mb-6">
                Enter your details below for&nbsp;instant&nbsp;access
              </p>
              <LeadForm variant="hero" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
