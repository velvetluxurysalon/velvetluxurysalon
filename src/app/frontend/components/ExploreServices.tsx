import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ServiceCategory {
  id: string;
  name: string;
  image: string;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "men",
    name: "Men",
    image: "/assets/men.jpeg",
  },
  {
    id: "women",
    name: "Women",
    image: "/assets/women.jpeg",
  },
  {
    id: "unisex",
    name: "Unisex",
    image: "/assets/unisex.jpeg",
  },
];

export default function ExploreServices() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <section className="py-24 px-6 sm:px-10 lg:px-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#c9a227] text-[10px] font-black uppercase tracking-[0.4em] mb-4 font-sans">
            Our Collections
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-serif font-bold mb-6 text-slate-900 tracking-tight">
            Explore Our <span className="italic text-[#c9a227]">Services</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Discover our curated collection of premium beauty and wellness
            services tailored for every individual.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              {/* Image Container */}
              <div className="relative w-full h-32 sm:h-48 md:h-72 lg:h-80 xl:h-96 overflow-hidden bg-slate-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-2 sm:mb-3 md:mb-4 group-hover:text-[#c9a227] transition-colors duration-500">
                    {category.name}
                  </h3>

                  {/* Button */}
                  <button className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-3 bg-[#c9a227] text-white text-[10px] sm:text-xs md:text-xs font-black uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-white hover:text-[#c9a227] transition-all duration-300 rounded-sm font-sans opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 whitespace-nowrap">
                    Explore
                    <ArrowRight
                      size={14}
                      className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
