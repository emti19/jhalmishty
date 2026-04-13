import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'সায়মা রহমান',
    role: 'গৃহিণী ও রাঁধুনি',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "গুণগত মান সত্যিই তুলনাহীন। আমি অনেক অর্গানিক ডেলিভারি সার্ভিস ব্যবহার করেছি, কিন্তু JhalMishty-এর সবজির স্বাদ একেবারেই আলাদা — যেন আজ সকালেই তোলা হয়েছে।",
  },
  {
    name: 'ইমরান শাহরিয়ার',
    role: 'পুষ্টিবিদ',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "আমি আমার সব ক্লায়েন্টকে JhalMishty সুপারিশ করি। খাবার কোথা থেকে আসে এবং কীভাবে উৎপাদিত হয় তা জানা আমাদের খাওয়া ও সুস্থতার উপর বড় প্রভাব ফেলে।",
  },
  {
    name: 'নাজিফা ফিরুজ',
    role: 'তিন সন্তানের মা',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "আমার বাচ্চারা এখন সত্যিই সবজি খায়! স্বাদ এতটাই তাজা ও প্রাণবন্ত। সাপ্তাহিক ডেলিভারি আমাদের পরিবারের ডিনার পুরোপুরি বদলে দিয়েছে।",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#F4A261] font-medium text-sm mb-2 tracking-wide uppercase">
            গ্রাহকদের মতামত
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2E28]">
            খাবারপ্রেমীদের ভালোবাসা
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map(({ name, role, avatar, rating, text }) => (
            <div
              key={name}
              className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#A8C686]/15 hover:shadow-lg hover:shadow-[#2F5D50]/6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F4A261] text-[#F4A261]" />
                ))}
              </div>
              <p className="text-[#4a6b5f] text-sm leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#A8C686]/30"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1A2E28]">{name}</p>
                  <p className="text-xs text-[#4a6b5f]/60">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}