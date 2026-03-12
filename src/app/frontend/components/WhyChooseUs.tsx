import {
  Award,
  ShoppingBag,
  Calendar,
  DollarSign,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    icon: Award,
    title: "Expert Stylists",
    description:
      "Professional team with 10+ years experience in premium beauty services",
  },
  {
    icon: ShoppingBag,
    title: "Premium Products",
    description:
      "Only international quality products used for the best results",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book online in seconds, reschedule or cancel anytime easily",
  },
  {
    icon: DollarSign,
    title: "Best Prices",
    description:
      "Competitive rates with luxury service, unbeatable value guaranteed",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-4 bg-white border-y border-[#c9a227]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#fdfbf7] border border-[#c9a227]/20 rounded-none mb-8">
            <Sparkles className="w-4 h-4 text-[#c9a227]" />
            <span className="text-[10px] font-black text-[#c9a227] uppercase tracking-[0.25em]">
              Luxury Standards
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 text-slate-900 tracking-tight">
            The <span className="italic font-light text-[#c9a227]">Velvet</span>{" "}
            Difference
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Experience the pinnacle of refined beauty with our bespoke services
            crafted for distinguished grace.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mb-24">
          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-6 w-max">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-72 group relative bg-[#fdfbf7]/50 rounded-none p-10 hover:bg-white hover:shadow-2xl transition-all duration-700 border border-slate-100 hover:border-[#c9a227]/30 overflow-hidden"
                  >
                    {/* Icon container */}
                    <div className="relative w-14 h-14 rounded-none bg-white border border-slate-100 flex items-center justify-center mb-8 group-hover:bg-[#1a1a2e] group-hover:border-[#1a1a2e] transition-all duration-500 shadow-sm">
                      <Icon className="w-6 h-6 text-[#c9a227] group-hover:text-white transition-colors duration-500" />
                    </div>

                    <h3 className="text-xl font-serif font-bold mb-4 text-slate-900 group-hover:text-[#c9a227] transition-colors">
                      {highlight.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm font-sans">
                      {highlight.description}
                    </p>

                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 right-0 w-[1px] h-full bg-[#c9a227]" />
                      <div className="absolute top-0 right-0 w-full h-[1px] bg-[#c9a227]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-[#fdfbf7]/50 rounded-none p-10 hover:bg-white hover:shadow-2xl transition-all duration-700 border border-slate-100 hover:border-[#c9a227]/30 overflow-hidden"
                >
                  {/* Icon container */}
                  <div className="relative w-14 h-14 rounded-none bg-white border border-slate-100 flex items-center justify-center mb-8 group-hover:bg-[#1a1a2e] group-hover:border-[#1a1a2e] transition-all duration-500 shadow-sm">
                    <Icon className="w-6 h-6 text-[#c9a227] group-hover:text-white transition-colors duration-500" />
                  </div>

                  <h3 className="text-xl font-serif font-bold mb-4 text-slate-900 group-hover:text-[#c9a227] transition-colors">
                    {highlight.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm font-sans">
                    {highlight.description}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-[1px] h-full bg-[#c9a227]" />
                    <div className="absolute top-0 right-0 w-full h-[1px] bg-[#c9a227]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
