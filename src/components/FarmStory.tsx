import { ArrowRight } from 'lucide-react';

export function FarmStory() {
  return (
    <section id="ourstory" className="py-16 lg:py-24 bg-[#FAF7F2] scroll-mt-16" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2E28] mb-6">
              Rooted in nature, <br />grown with care
            </h2>
            <p className="text-[#4a6b5f] leading-relaxed mb-6">
              Verdure began in 2018 when our founders realized that truly organic food was
              hard to find and often came in uninspiring packaging. We set out to change
              that — building direct relationships with small family farms committed to
              regenerative agriculture.
            </p>
            <p className="text-[#4a6b5f] leading-relaxed mb-8">
              Today, we partner with over 30 farms across the region, each verified for
              their organic practices and dedication to soil health. When you shop with us,
              you're supporting real people who care deeply about what they grow.
            </p>

            <div className="flex flex-wrap gap-8 mb-8">
              {[
                { value: '2018', label: 'Founded' },
                { value: '30+', label: 'Farm Partners' },
                { value: '500+', label: 'Organic Products' },
                { value: '12k+', label: 'Happy Customers' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-[#2F5D50]">{value}</p>
                  <p className="text-sm text-[#4a6b5f]">{label}</p>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#2F5D50] font-semibold hover:gap-3 transition-all duration-200 group"
            >
              Meet Our Farms
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
