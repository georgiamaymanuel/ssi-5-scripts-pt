import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'Am I really losing revenue at my front desk?',
    answer:
      'Almost certainly. The average healthcare practice has a no-show rate of 18\u201323%, costing $100\u2013$200 per missed visit. For a multi-provider PT clinic, that can mean $300,000+ lost per year. On top of that, 30% of practice calls go unanswered and over half of patients say a poor front desk experience would make them switch providers. The right scripts close that\u00A0gap.',
  },
  {
    question: 'What exactly is included in the download?',
    answer:
      'You\'ll receive a PDF with 5 word-for-word front desk scripts covering the most common scenarios where practices lose patients and revenue\u00A0\u2014\u00A0including cancellations, no-shows, objections to scheduling, insurance questions, and follow-up calls.',
  },
  {
    question: 'Are these scripts specific to physical therapy practices?',
    answer:
      'These scripts were developed specifically for PT and rehab practices, but the principles apply to any private healthcare practice with a front desk team handling patient scheduling and\u00A0retention.',
  },
  {
    question: 'Do I need to train my team to use these?',
    answer:
      'No formal training is required. The scripts are written in natural, conversational language that your front desk can start using immediately. Simply print them out or share them digitally with your\u00A0team.',
  },
  {
    question: 'Is this really free? What\'s the catch?',
    answer:
      'It\'s completely free with no strings attached. We created this resource to help practice owners see the kind of results our consulting delivers. If you find the scripts valuable, you\'ll know where to find us when you\'re ready to take the next\u00A0step.',
  },
  {
    question: 'How quickly will I see results?',
    answer:
      'Most practices see a noticeable reduction in cancellations within the first week of implementing the scripts. The key is consistency\u00A0\u2014\u00A0make sure every front desk team member is using them on every\u00A0call.',
  },
  {
    question: 'Who is Survival Strategies, Inc.?',
    answer:
      'Survival Strategies, Inc. is a training and consulting firm that has worked with over 1,000 private practices across the country for more than 25 years. We specialize in helping practice owners increase revenue, reduce overhead, and build teams that\u00A0perform.',
  },
];

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="border-b border-gray-200 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-base sm:text-lg font-semibold text-navy-900 pr-8 group-hover:text-navy-700 transition-colors">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-navy-400"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600 leading-relaxed pr-12">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about the free front desk&nbsp;scripts.
          </p>
        </motion.div>

        <div className="bg-white rounded-lg border border-gray-100 px-6 sm:px-8">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
