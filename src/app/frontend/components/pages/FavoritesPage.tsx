import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Calendar, Sparkles } from "lucide-react";

interface FavoriteItem {
  id: number;
  name: string;
  category: string;
  price: string;
  gradient: string;
}

const demoFavorites: FavoriteItem[] = [
  {
    id: 1,
    name: "Signature Hair Treatment",
    category: "Hair Services",
    price: "$120",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    id: 2,
    name: "Radiance Facial",
    category: "Skincare",
    price: "$95",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: 3,
    name: "Aromatherapy Massage",
    category: "Massage & Spa",
    price: "$110",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    name: "Gel Nail Art Set",
    category: "Nails",
    price: "$65",
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(demoFavorites);

  const remove = (id: number) =>
    setFavorites((prev) => prev.filter((f) => f.id !== id));

  return (
    <>
      <div className="bg-white text-slate-900 font-sans">
        {/* Header */}
        <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100 bg-gradient-to-br from-white via-blue-50/20 to-white">
          <div className="max-w-4xl">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-6">
              Your Picks
            </span>
            <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
              <span className="text-blue-600">Favorites</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
              {favorites.length > 0
                ? `You have ${favorites.length} saved service${favorites.length > 1 ? "s" : ""}.`
                : "Start exploring and save the services you love."}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 px-6 sm:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto">
            {favorites.length === 0 ? (
              /* Empty state */
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                  <Heart size={32} className="text-slate-300" />
                </div>
                <h2 className="text-xl font-light text-slate-900 mb-2">
                  No Favorites Yet
                </h2>
                <p className="text-[14px] text-slate-500 max-w-sm mx-auto mb-8">
                  Browse our services and tap the heart icon to save your
                  favorite treatments.
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-sans font-medium hover:bg-slate-800 transition-colors"
                >
                  Explore Services
                </Link>
              </div>
            ) : (
              <>
                {/* Favorites grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="bg-white rounded-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <div className="flex">
                        {/* Color stripe */}
                        <div
                          className={`w-1.5 bg-gradient-to-b ${fav.gradient} flex-shrink-0`}
                        />

                        <div className="flex-1 p-5 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-[11px] font-sans font-medium text-slate-500 uppercase tracking-wide mb-1">
                              {fav.category}
                            </p>
                            <h3 className="text-[15px] font-sans font-medium text-slate-900 mb-1">
                              {fav.name}
                            </h3>
                            <p className="text-[14px] font-sans font-medium text-slate-600">
                              {fav.price}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => remove(fav.id)}
                              className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={15} />
                            </button>
                            <Link
                              to="/contact"
                              className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center transition-colors"
                              title="Book"
                            >
                              <Calendar size={15} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-10 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Ready to Book?
                    </h3>
                    <p className="text-[13px] text-violet-100">
                      Schedule your favorite services with our expert team.
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    className="px-8 py-3.5 bg-white text-violet-700 text-sm font-bold rounded-xl shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all flex-shrink-0"
                  >
                    Book Appointment
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
