import { motion } from 'framer-motion';

const stats = [
  { value: '1,000+', label: 'Practices Served' },
  { value: '25+', label: 'Years of Consulting' },
  { value: '50 States', label: 'Nationwide Reach' },
];

export default function AboutSection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4 sm:gap-8 mb-16 lg:mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* About content with image placeholder */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/images/about-consulting.png"
              alt="Survival Strategies consulting team working with a private practice"
              className="w-full h-auto rounded-lg object-cover"
            />
          </motion.div>

          {/* About copy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-sky-accent font-semibold text-sm uppercase tracking-wider mb-3">
              About Survival Strategies
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-6">
              Training and Consulting Built for Private&nbsp;Practices
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                For over 25 years, Survival Strategies, Inc. has been the go-to consulting partner
                for private practice owners who want to grow their revenue, build stronger teams,
                and create practices that run without burning them&nbsp;out.
              </p>
              <p>
                We've worked with more than 1,000 practices across the country, delivering
                hands-on training and proven systems that produce measurable results. From front
                desk operations to provider retention, our methods are built from real-world
                experience inside practices just like&nbsp;yours.
              </p>
              <p>
                Our consulting isn't theory. It's a playbook refined through decades of helping
                practice owners solve the exact problems that keep them up at&nbsp;night.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
