import { motion } from 'framer-motion';
import LeadForm from './LeadForm';

export default function CtaSection() {
  return (
    <section className="py-20 lg:py-28 bg-white" id="download">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Copy + Image placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-4">
              Ready to Stop Losing Patients at the&nbsp;Front&nbsp;Desk?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Download the 5 scripts your front desk needs to turn cancellations into committed
              patients. It takes 30&nbsp;seconds.
            </p>

            <img
              src="/images/cta-front-desk.png"
              alt="Front desk receptionist helping patients at a practice"
              className="w-full h-auto rounded-lg object-cover"
            />
          </motion.div>

          {/* Right column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-navy-50 border border-navy-100 rounded-lg p-8 sm:p-10"
          >
            <h3 className="text-xl font-bold text-navy-900 text-center mb-2">
              Get Instant Access
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              Enter your details and download the scripts&nbsp;immediately
            </p>
            <LeadForm variant="cta" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
