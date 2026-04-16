import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="  lg:py-20 bg-[#2F5D50] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#A8C686]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#F4A261]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative">
        <p className="text-[#A8C686] font-medium text-sm mb-3 tracking-wide uppercase">
          Stay Fresh
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Get seasonal picks &amp; <br className="hidden sm:block" />exclusive offers
        </h2>
        <p className="text-[#A8C686]/80 mb-8 leading-relaxed">
          Join 12,000+ members who get weekly updates on what's fresh, plus
          10% off your first order.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 bg-white/10 rounded-2xl px-8 py-5 max-w-md mx-auto">
            <CheckCircle className="w-5 h-5 text-[#A8C686]" />
            <p className="text-white font-medium">You're in! Welcome to the Verdure family.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#A8C686] focus:bg-white/15 transition-all"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#F4A261] hover:bg-[#e8914f] text-white px-6 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-[#F4A261]/30 flex-shrink-0"
            >
              Subscribe
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-white/30 text-xs mt-4">
          No spam ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
