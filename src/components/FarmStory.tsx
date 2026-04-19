export function FarmStory() {
  return (
    <section id="ourstory" className="    bg-[#FAF7F2] scroll-mt-16" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                  <img
                    src="https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Farm worker"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <img
                    src="https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Fresh harvest"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <img
                    src="https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Organic farm"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                  <img
                    src="https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Fresh vegetables"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#2F5D50] text-white rounded-2xl px-6 py-4 shadow-xl whitespace-nowrap">
              <p className="text-2xl font-bold">30+</p>
              <p className="text-xs text-[#A8C686]">Partner Farms</p>
            </div>
          </div>

          <div>
            <p className="text-[#F4A261] font-medium text-sm mb-3 tracking-wide uppercase">
              আমাদের গল্প
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2E28] mb-6">
              প্রকৃতির ছোঁয়ায়, <br /> যত্নে বেড়ে ওঠা
            </h2>

            <p className="text-[#4a6b5f] leading-relaxed mb-6">
              JhalMishty-এর যাত্রা শুরু হয় ২০১৮ সালে, যখন আমাদের প্রতিষ্ঠাতারা বুঝতে পারেন যে সত্যিকারের অর্গানিক খাবার খুঁজে পাওয়া কঠিন এবং সেগুলোর উপস্থাপনাও তেমন আকর্ষণীয় নয়। আমরা এই ধারণা বদলাতে চেয়েছি—ছোট পারিবারিক খামারের সঙ্গে সরাসরি সম্পর্ক গড়ে তুলে, যারা টেকসই কৃষিতে বিশ্বাসী।
            </p>

            <p className="text-[#4a6b5f] leading-relaxed mb-8">
              আজ আমরা ৩০টিরও বেশি খামারের সঙ্গে কাজ করছি, যাদের প্রত্যেকটি অর্গানিক পদ্ধতি ও মাটির স্বাস্থ্যের প্রতি তাদের প্রতিশ্রুতির জন্য যাচাইকৃত। আমাদের থেকে কেনাকাটা মানে হলো এমন মানুষের পাশে থাকা, যারা তাদের উৎপাদিত পণ্যের প্রতি সত্যিই যত্নশীল।
            </p>

            <div className="flex flex-wrap gap-8 mb-8">
              {[
                { value: '২০১৮', label: 'প্রতিষ্ঠিত' },
                { value: '৩০+', label: 'খামার অংশীদার' },
                { value: '৫০০+', label: 'অর্গানিক পণ্য' },
                { value: '১২ হাজার+', label: 'সন্তুষ্ট গ্রাহক' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-[#2F5D50]">{value}</p>
                  <p className="text-sm text-[#4a6b5f]">{label}</p>
                </div>
              ))}
            </div>

            {/* <a
              href="#"
              className="inline-flex items-center gap-2 text-[#2F5D50] font-semibold hover:gap-3 transition-all duration-200 group"
            >
              Meet Our Farms
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}
