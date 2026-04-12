import { Leaf, Heart, ShieldCheck, Recycle } from 'lucide-react';

const benefits = [
  {
  icon: Leaf,
  title: 'সার্টিফায়েড অর্গানিক',
  description: 'প্রতিটি পণ্যই সম্পূর্ণ অর্গানিক মানদণ্ডে সার্টিফায়েড—কোনো শর্টকাট নয়, কোনো আপস নয়।',
  color: '#A8C686',
  },
  {
    icon: Heart,
    title: 'আপনার জন্য আরও ভালো',
    description: 'কোনো কৃত্রিম কীটনাশক বা জিএমও ছাড়া, আমাদের পণ্য একেবারে প্রকৃতির মতোই খাঁটি।',
    color: '#F4A261',
  },
  {
    icon: ShieldCheck,
    title: 'খামার যাচাইকৃত',
    description: 'আমরা নিজেই প্রতিটি খামার পরিদর্শন করি এবং প্রতি বছর তাদের চাষাবাদ পদ্ধতি যাচাই করি।',
    color: '#2F5D50',
  },
  {
    icon: Recycle,
    title: 'পরিবেশবান্ধব প্যাকেজিং',
    description: '১০০% পরিবেশবান্ধব ও পুনর্ব্যবহারযোগ্য প্যাকেজিং—আমাদের কার্বন প্রভাব প্রতিনিয়ত কমছে।',
    color: '#A8C686',
  }
];

export function Benefits() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#F4A261] font-medium text-sm mb-2 tracking-wide uppercase">
            কেন আমাদের থেকে কিনবেন?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2E28]">
            The ঝাল মিষ্টি Difference
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-[#FAF7F2] hover:bg-white hover:shadow-xl hover:shadow-[#2F5D50]/8 border border-transparent hover:border-[#A8C686]/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-bold text-[#1A2E28] mb-2">{title}</h3>
              <p className="text-sm text-[#4a6b5f] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
