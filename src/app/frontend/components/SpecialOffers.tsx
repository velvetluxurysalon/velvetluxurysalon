import { Button } from "./ui/button";
import { Tag, Calendar, Sparkles, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getSpecialOffers } from "../services/contentService";

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  validity: string;
  active?: boolean;
}

export default function SpecialOffers({
  id = "special-offers",
}: {
  id?: string;
}) {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await getSpecialOffers();
      // Ensure each offer has a validity property (provide a default if missing)
      const offersWithValidity = data.map((offer: any) => ({
        ...offer,
        validity: offer.validity ?? "N/A",
      }));
      setOffers(offersWithValidity);
    } catch (error) {
      console.error("Error loading offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // Scroll to services or booking
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const defaultOffers: SpecialOffer[] = [];

  const displayOffers = offers.length > 0 ? offers : defaultOffers;

  if (loading) {
    return (
      <section className="py-24 px-4 bg-[#fdfbf7] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#c9a227]/30 border-t-[#c9a227] rounded-full animate-spin" />
            <p className="text-[#c9a227] font-medium animate-pulse font-sans">
              Curating exclusive experiences...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (displayOffers.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className="py-16 sm:py-20 md:py-24 px-4 bg-[#fdfbf7] relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#c9a227]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c9a227]/5 rounded-full blur-[100px]" />

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles
              className="w-6 h-6 text-[#c9a227] animate-pulse"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white rounded-full mb-8 shadow-sm border border-[#c9a227]/20 uppercase tracking-[0.2em] font-sans">
            <Tag className="w-4 h-4 text-[#c8a227]" />
            <span className="text-[10px] font-black text-[#c9a227]">
              Limited Time Privileges
            </span>
            <span className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-[#c9a227] text-white text-[9px] rounded-full animate-pulse font-bold">
              <Clock className="w-3 h-3" />
              ELITE
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 text-slate-900 tracking-tight">
            Special{" "}
            <span className="italic font-light text-[#c9a227]">Promotions</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-sans">
            Exclusive rituals and celebratory offers curated for our
            distinguished guests.
          </p>
        </div>

        {/* Offers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayOffers.map((offer, index) => (
            <div
              key={offer.id}
              className="group relative"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100 hover:border-[#c9a227]/30 h-full flex flex-col">
                {/* Image/Discount section */}
                <div className="relative h-56 overflow-hidden">
                  {offer.image ? (
                    <>
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
                    </>
                  ) : (
                    <div className="h-full bg-[#1a1a2e] relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,162,39,0.2),transparent_50%)]" />
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 1px 1px, #c9a227 1px, transparent 0)",
                          backgroundSize: "20px 20px",
                        }}
                      />
                    </div>
                  )}

                  {/* Discount badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative bg-white/95 backdrop-blur-sm p-6 shadow-2xl border border-[#c9a227]/20 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <p className="text-4xl font-serif font-black text-[#c9a227]">
                        {offer.discount}%
                      </p>
                      <p className="text-[10px] text-slate-400 text-center uppercase font-black tracking-widest font-sans">
                        Saving
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-[#c9a227] transition-colors leading-tight">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 flex-grow line-clamp-2 leading-loose font-sans">
                    {offer.description}
                  </p>

                  {/* Validity */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-8 pb-4 border-b border-slate-50 font-sans tracking-wide">
                    <Calendar className="w-3.5 h-3.5 text-[#c9a227]" />
                    <span>
                      UNTIL:{" "}
                      <span className="font-bold text-slate-600">
                        {offer.validity.toUpperCase()}
                      </span>
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={handleBookNow}
                    className="w-full bg-[#1a1a2e] hover:bg-[#c9a227] text-white font-black py-4 rounded-none transition-all duration-500 text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 group-hover:shadow-[#c9a227]/20 font-sans"
                  >
                    Claim privilege
                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
