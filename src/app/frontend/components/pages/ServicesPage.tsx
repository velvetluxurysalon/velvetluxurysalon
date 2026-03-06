import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import {
  getServicesGroupedByCategory,
  ServiceCategory,
} from "../../services/contentService";

interface GroupedService {
  category: ServiceCategory;
  services: any[];
}

export default function ServicesPage() {
  const [grouped, setGrouped] = useState<GroupedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchParams] = useSearchParams();

  const mainCategories = [
    { id: "men", name: "Men" },
    { id: "women", name: "Women" },
    { id: "unisex", name: "Unisex" },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const grp = await getServicesGroupedByCategory();
        const reorganized = organizeServicesByMainCategories(grp);
        setGrouped(reorganized);

        // Check for category query parameter
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
          const matchingCategory = reorganized.find(
            (g) => g.category.id === categoryParam,
          );
          if (matchingCategory) {
            setActiveCategory(matchingCategory.category.name);
          }
        }
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  const organizeServicesByMainCategories = (
    groupedServices: GroupedService[],
  ): GroupedService[] => {
    const result: GroupedService[] = [];
    mainCategories.forEach((mainCat) => {
      const services: any[] = [];
      groupedServices.forEach((grp) => {
        if (
          grp.category.name.toLowerCase().includes(mainCat.name.toLowerCase())
        ) {
          services.push(...grp.services);
        }
      });
      if (services.length > 0) {
        result.push({
          category: {
            id: mainCat.id,
            name: mainCat.name,
            order: 0,
            isActive: true,
          },
          services,
        });
      }
    });
    return result;
  };

  return (
    <div className="bg-white text-slate-900 font-sans">
      {/* --- HERO SECTION: Minimal & Elegant --- */}
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            Our Curated Menu
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            Exquisite <span className="italic">Treatments.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            A harmonious blend of traditional techniques and modern clinical
            excellence, tailored specifically for your wellbeing.
          </p>
        </div>
      </section>

      {/* --- FILTER & SERVICES --- */}
      <section className="py-12 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Refined Tabs */}
          <div className="flex items-center justify-start space-x-8 mb-16 border-b border-slate-100 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`pb-4 text-sm font-medium transition-all relative ${
                activeCategory === "all"
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              All Services
              {activeCategory === "all" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900" />
              )}
            </button>
            {grouped.map((grp) => (
              <button
                key={grp.category.id}
                onClick={() => setActiveCategory(grp.category.name)}
                className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                  activeCategory === grp.category.name
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {grp.category.name}
                {activeCategory === grp.category.name && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900" />
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400 animate-pulse">
              Refining collection...
            </div>
          ) : (
            <div className="space-y-32">
              {grouped
                .filter(
                  (grp) =>
                    activeCategory === "all" ||
                    activeCategory === grp.category.name,
                )
                .map((grp) => (
                  <div key={grp.category.id}>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                      <h2 className="text-3xl font-light font-serif">
                        {grp.category.name}{" "}
                        <span className="font-sans font-normal text-slate-400 text-sm ml-2">
                          ({grp.services.length})
                        </span>
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                      {grp.services.map((service) => (
                        <div key={service.id} className="group cursor-default">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium group-hover:text-indigo-600 transition-colors">
                              {service.name}
                            </h3>
                            <span className="font-medium text-slate-900">
                              {service.price}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center text-[11px] font-bold uppercase tracking-widest text-slate-400 space-x-4">
                            <span className="flex items-center gap-1.5">
                              <Clock size={12} /> {service.duration} MIN
                            </span>
                            <Link
                              to="/appointments"
                              className="text-slate-900 hover:underline flex items-center gap-1"
                            >
                              Reserve <ChevronRight size={12} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* --- FAQ: Modern Minimalist --- */}
      {/* Moved to Home Page */}
    </div>
  );
}
