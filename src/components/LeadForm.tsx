import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadFormProps {
  variant?: 'hero' | 'cta';
}

export default function LeadForm({ variant = 'hero' }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    practiceName: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      setErrorMessage('Please accept the Privacy Policy and Terms to continue.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // ─────────────────────────────────────────────
    // MAILCHIMP INTEGRATION
    // ─────────────────────────────────────────────
    // Replace the URL below with your Mailchimp form POST URL.
    // To find it: Mailchimp → Audience → Signup forms → Embedded forms
    // The action URL looks like:
    //   https://XXXXX.us1.list-manage.com/subscribe/post?u=XXXXX&id=XXXXX
    //
    // Change "/post?" to "/post-json?" and add "&c=?" at the end for JSONP.
    // Map your merge fields below (FNAME, EMAIL, MMERGE3, etc.)
    // ─────────────────────────────────────────────

    const MAILCHIMP_URL =
      'https://YOURPREFIX.usX.list-manage.com/subscribe/post-json?u=YOUR_U_VALUE&id=YOUR_ID_VALUE&c=?';

    // Build URL params for Mailchimp merge fields
    const params = new URLSearchParams({
      FNAME: formData.name,
      EMAIL: formData.email,
      MMERGE3: formData.practiceName, // Custom merge field for practice name
    });

    try {
      // JSONP approach for Mailchimp (avoids CORS issues)
      const url = `${MAILCHIMP_URL}&${params.toString()}`;

      await new Promise<void>((resolve, reject) => {
        const callbackName = `mc_callback_${Date.now()}`;

        // Timeout after 10s
        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error('Request timed out'));
        }, 10000);

        function cleanup() {
          clearTimeout(timeout);
          delete (window as Record<string, unknown>)[callbackName];
          const script = document.getElementById(callbackName);
          if (script) script.remove();
        }

        // Define callback
        (window as Record<string, unknown>)[callbackName] = (data: { result: string; msg: string }) => {
          cleanup();
          if (data.result === 'success') {
            resolve();
          } else {
            reject(new Error(data.msg || 'Subscription failed'));
          }
        };

        // Create JSONP script
        const script = document.createElement('script');
        script.id = callbackName;
        script.src = url.replace('c=?', `c=${callbackName}`);
        script.onerror = () => {
          cleanup();
          reject(new Error('Network error'));
        };
        document.body.appendChild(script);
      });

      setStatus('success');
    } catch (err) {
      // If Mailchimp URL is not configured yet, still show success for development
      if (MAILCHIMP_URL.includes('YOURPREFIX')) {
        console.warn('Mailchimp URL not configured. Showing success state for development.');
        setStatus('success');
        return;
      }

      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message.replace(/<a[^>]*>.*?<\/a>/gi, '').trim()
          : 'Something went wrong. Please try again.'
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isHero = variant === 'hero';
  const formId = `lead-form-${variant}`;

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-center p-8 rounded-lg ${
              isHero ? 'bg-white/10 backdrop-blur-sm' : 'bg-navy-50 border border-navy-100'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h3 className={`text-xl font-bold mb-2 ${isHero ? 'text-white' : 'text-navy-900'}`}>
              Your scripts are ready!
            </h3>
            <p className={`mb-4 ${isHero ? 'text-white/80' : 'text-gray-600'}`}>
              Click below to download your free front&nbsp;desk&nbsp;scripts.
            </p>

            {/* Privacy & Terms notice above download */}
            <p className={`text-xs mb-4 ${isHero ? 'text-white/40' : 'text-gray-400'}`}>
              By downloading, you agree to our{' '}
              <a href="/privacy" className={`underline hover:no-underline ${isHero ? 'text-white/60' : 'text-gray-500'}`}>
                Privacy&nbsp;Policy
              </a>{' '}
              and{' '}
              <a href="/terms" className={`underline hover:no-underline ${isHero ? 'text-white/60' : 'text-gray-500'}`}>
                Terms&nbsp;of&nbsp;Use
              </a>.
            </p>

            <motion.a
              href="/assets/SSI-PT-Front-Desk-Scripts.pdf"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Your Scripts (PDF)
            </motion.a>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            id={formId}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3.5 rounded-md text-base transition-all outline-none ${
                  isHero
                    ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/15'
                    : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20'
                }`}
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Work Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3.5 rounded-md text-base transition-all outline-none ${
                  isHero
                    ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/15'
                    : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20'
                }`}
              />
            </div>
            <div>
              <input
                type="text"
                name="practiceName"
                placeholder="Practice Name"
                value={formData.practiceName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3.5 rounded-md text-base transition-all outline-none ${
                  isHero
                    ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/15'
                    : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20'
                }`}
              />
            </div>

            {/* Privacy Policy & Terms checkbox */}
            <label
              htmlFor={`${formId}-agree`}
              className={`flex items-center gap-2.5 cursor-pointer ${
                isHero ? 'text-white/50' : 'text-gray-400'
              }`}
            >
              <input
                type="checkbox"
                id={`${formId}-agree`}
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked && status === 'error') {
                    setStatus('idle');
                    setErrorMessage('');
                  }
                }}
                className="appearance-none h-[16px] w-[16px] min-h-[16px] min-w-[16px] flex-shrink-0 rounded-sm border-2 border-current checked:bg-navy-600 checked:border-navy-600 cursor-pointer relative after:content-[''] after:absolute after:left-[4px] after:top-[1px] after:w-[5px] after:h-[9px] after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:opacity-0 checked:after:opacity-100"
              />
              <span className="text-xs leading-[16px]">
                I agree to the{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline hover:no-underline ${
                    isHero ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  Privacy&nbsp;Policy
                </a>{' '}
                and{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline hover:no-underline ${
                    isHero ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  Terms&nbsp;of&nbsp;Use
                </a>.
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 px-6 rounded-md font-bold text-lg transition-all shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                isHero
                  ? 'bg-white text-navy-900 hover:bg-gray-100 shadow-white/20'
                  : 'bg-navy-900 text-white hover:bg-navy-800 shadow-navy-900/30'
              }`}
            >
              {status === 'submitting' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Get Your Free Scripts'
              )}
            </motion.button>

            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {errorMessage}
              </motion.p>
            )}

            <p className={`text-xs text-center ${isHero ? 'text-white/50' : 'text-gray-400'}`}>
              No spam, ever. Unsubscribe&nbsp;anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
