import { motion } from 'framer-motion';

const testimonials = [
  {
    quote:
      "This Topeka, Kansas, private PT practice grew from a 4,000-square-foot facility to an 18,000-square-foot clinic plus added a second location \u2014 reaching approximately 1,500 PT visits\u00A0weekly.",
    name: 'Paul Silovsky, PT',
    role: 'Rebound Physical Therapy, Topeka, KS',
    image: '/images/paul-silovsky.jpg',
  },
  {
    quote:
      "Number of treatments grew from 150 per week to 800 per week while referral sources rocketed from 5 per year to 250 for this Long Island PT private\u00A0practice.",
    name: 'Christina Panetta, PT',
    role: 'Panetta Physical Therapy, Long Island, NY',
    image: '/images/christina-panetta.jpg',
  },
  {
    quote:
      "Number of patients and treatments doubled in six months. Expanded from 1 to 7 facilities across Pennsylvania while gaining the freedom to teach and spend time with\u00A0family.",
    name: 'John R. Mishock, DC, MPT',
    role: 'Mishock Physical Therapy, Gilbertsville, PA',
    image: '/images/john-mishock.jpg',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-navy-900" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Trusted by Practice Owners Nationwide
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Real results from PT practice owners who partnered with Survival&nbsp;Strategies.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:bg-white/10 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-white/80 leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author with photo */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                  <div className="text-xs text-white/50">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
