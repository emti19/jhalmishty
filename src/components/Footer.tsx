import {  Instagram, Twitter, Facebook } from 'lucide-react';
import Jhalmishty from '../../assets/jmlogo.png'

const links = {
  'কেনাকাটা': ['তাজা পণ্য', 'দুগ্ধজাত এবং ডিম', 'রান্নাঘরের প্রয়োজনীয়', 'মসলা এবং ভেষজ', 'মৌসুমী বাক্স'],
  'কোম্পানি': ['আমাদের গল্প', 'খামার অংশীদার', 'টেকসইতা', 'প্রেস', 'কর্মসংস্থান'],
  'সাহায্য': ['সাধারণ প্রশ্ন', 'ডেলিভারি তথ্য', 'রিটার্ন', 'যোগাযোগ করুন', 'উপহার কার্ড'],
};

export function Footer() {
  return (
    <footer className="bg-[#1A2E28] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-20 h-20 rounded-lg flex items-center justify-center">
                <img src={Jhalmishty} alt="JhalMishty" />
              </div>
              <span className="font-bold text-xl tracking-tight">JhalMishty</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              বিশ্বস্ত খামার থেকে সেরা অর্গানিক পণ্য আপনার টেবিলে সরাসরি পৌঁছে দিচ্ছি।
              প্রকৃত খাবার, প্রকৃত কৃষক।
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/8 hover:bg-[#2F5D50] rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4 text-white/70 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-4 text-white/80 tracking-wide uppercase">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} JhalMishty। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-5 items-center">
            <a href="/admin/login" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Admin login
            </a>
            {['গোপনীয়তা নীতি', 'সেবা শর্তাবলী', 'কুকি নীতি'].map((item) => (
              <a key={item} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
