import { useState, useEffect } from "react";
import { Tag, Calendar, Sparkles, Percent, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { getSpecialOffers } from "../../services/contentService";

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  validity: string;
  active?: boolean;
}

export default function SpecialOffersPage() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        const data = await getSpecialOffers();
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

    loadOffers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading special offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 pt-12 border-b border-slate-100 pb-12 bg-gradient-to-br from-transparent via-rose-50/30 to-transparent">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4 flex items-center gap-3">
            <Sparkles className="text-rose-600" size={40} />
            <span>
              <span className="text-rose-600">Special</span> Offers
            </span>
          </h1>
          <p className="text-xl text-slate-500">
            Exclusive deals and promotions just for you
          </p>
        </div>

        {/* Offers Grid */}
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Image Section */}
                <div className="relative h-64 bg-slate-100 overflow-hidden">
                  {offer.image ? (
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles size={48} className="text-slate-300" />
                    </div>
                  )}
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-1">
                    <Percent size={18} />
                    {offer.discount}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-sans font-medium text-slate-900 mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {offer.description}
                  </p>

                  {/* Validity */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Calendar size={16} />
                    <span>
                      Valid until:{" "}
                      <span className="font-medium text-slate-700">
                        {offer.validity}
                      </span>
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans font-medium flex items-center justify-center gap-2">
                    Book Now
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Tag size={64} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-serif font-light text-slate-900 mb-2">
              No Offers Available
            </h2>
            <p className="text-slate-600">
              Check back later for amazing deals!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
