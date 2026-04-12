import { ArrowRight, Award, Home, Leaf } from 'lucide-react';
import balachao from '../../assets/balachao.png'

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[#FAF7F2]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#A8C686]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-72 h-72 bg-[#F4A261]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-[#A8C686]/20 text-[#2F5D50] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Leaf className="w-3.5 h-3.5" />
              100% Certified Organic
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A2E28] leading-[1.1] mb-6">
              খামার থেকে
              <span className="text-[#2F5D50]"> সরাসরি </span>
              আপনার টেবিলে
            </h1>
            <p className="text-lg text-[#4a6b5f] leading-relaxed mb-8 max-w-lg">
              আমরা ছোট, টেকসই খামার থেকে সরাসরি সেরা মানের অর্গানিক পণ্য সংগ্রহ করি।
              প্রতিটি উপাদান সতেজতা, স্বাদ এবং আপনার সুস্থতার কথা মাথায় রেখে যত্নসহকারে নির্বাচন করা হয়।
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-[#2F5D50] hover:bg-[#264d43] text-white px-7 py-3.5 rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#2F5D50]/20 hover:-translate-y-0.5"
              >
                কিনুন
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#ourstory"
                className="inline-flex items-center gap-2 border border-[#2F5D50]/30 text-[#2F5D50] px-7 py-3.5 rounded-full font-medium hover:bg-[#2F5D50]/5 transition-all duration-200"
              >
                আমাদের গল্প
              </a>
            </div>

            <div className="flex flex-wrap gap-6 sm:gap-10">
              {[
                { icon: Award, label: '5+ Products', sub: 'Certified Organic' },
                { icon: Home, label: 'Home Made', sub: 'Tasty & Fresh' },
                { icon: Leaf, label: 'Farm Direct', sub: '30+ Local Farms' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#A8C686]/25 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#2F5D50]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A2E28]">{label}</p>
                    <p className="text-xs text-[#4a6b5f]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-square shadow-2xl shadow-[#2F5D50]/10">
              <img
                src={balachao}
                alt="Fresh organic produce"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E28]/20 to-transparent" />
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-[#A8C686]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F4A261]/15 rounded-xl flex items-center justify-center">
                  <span className="text-lg">🌿</span>
                </div>
                <div>
                  <p className="text-xs text-[#4a6b5f]">আমাদের বেস্ট সেলিং প্রোডাক্ট</p>
                  <p className="text-sm font-bold text-[#1A2E28]">চিংড়ি বালাচাও</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-[#2F5D50] rounded-2xl p-4 shadow-xl text-white">
              <p className="text-2xl font-bold">4.9</p>
              <p className="text-xs text-[#A8C686]">Rating</p>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#F4A261] text-xs">★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
