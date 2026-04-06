import { motion } from 'framer-motion';

const benefits = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Stop Losing Revenue at the Front Desk',
    description:
      'The average practice loses thousands each month from cancellations and no-shows that could have been prevented with the right response. These scripts close\u00A0that\u00A0gap.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    title: 'Give Your Team Confidence on Every Call',
    description:
      'No more guessing or awkward pauses. Your front desk will have word-for-word scripts for the toughest patient conversations\u00A0\u2014\u00A0from objections to\u00A0reschedules.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: 'Proven in Over 1,000 Practices',
    description:
      'These aren\'t theoretical templates. They\'re battle-tested scripts refined through decades of consulting with private practices across the\u00A0country.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'Implement Immediately',
    description:
      'Print them out, share them with your team, and start using them today. No training program required\u00A0\u2014\u00A0just plug, play, and watch your retention\u00A0improve.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Benefits() {
  return (
    <section className="py-20 lg:py-28 bg-white" id="benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with image placeholder */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-4">
              Why These Scripts Work
            </h2>
            <p className="text-lg text-gray-600">
              Your front desk handles thousands of patient interactions each month. Even small
              improvements to those conversations create massive impact on your&nbsp;bottom&nbsp;line.
            </p>
          </motion.div>

          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="/images/front-desk-phone.png"
              alt="Front desk staff member on the phone at a practice"
              className="w-full h-auto rounded-lg object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-8 lg:gap-10"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-8 rounded-lg border border-gray-100 hover:border-navy-100 bg-white hover:bg-navy-50/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-md bg-navy-50 text-navy-600 flex items-center justify-center group-hover:bg-navy-100 transition-colors">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
