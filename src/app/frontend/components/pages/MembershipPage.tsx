import { useState, useEffect } from "react";
import {
  Crown,
  Check,
  ArrowRight,
  Gift,
  Star,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  getMemberships,
  type Membership,
} from "../../services/firebaseService";

export default function MembershipPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    try {
      setLoading(true);
      const data = await getMemberships();
      // Sort by hierarchy: regular (1st), membership/premium/current (2nd), elite (3rd)
      const sorted = [...data].sort((a, b) => {
        // Determine order positions
        const aId = a.id.toLowerCase().trim();
        const bId = b.id.toLowerCase().trim();

        const getOrder = (id: string) => {
          if (id === "regular") return 0;
          if (id === "membership" || id === "premium" || id === "current")
            return 1;
          if (id === "elite") return 2;
          return 999;
        };

        return getOrder(aId) - getOrder(bId);
      });
      setMemberships(sorted);
    } catch (error) {
      console.error("Error loading memberships:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (membershipId: string) => {
    switch (membershipId) {
      case "elite":
        return <Crown className="w-8 h-8 text-amber-500" />;
      case "membership":
      case "current":
        return <Star className="w-8 h-8 text-violet-500" />;
      default:
        return <Gift className="w-8 h-8 text-gray-500" />;
    }
  };

  const getGradient = (membershipId: string) => {
    switch (membershipId) {
      case "elite":
        return "from-amber-500 to-orange-600";
      case "membership":
      case "current":
        return "from-violet-600 to-fuchsia-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getBadgeColor = (membershipId: string) => {
    switch (membershipId) {
      case "elite":
        return "bg-amber-100 text-amber-800";
      case "membership":
      case "current":
        return "bg-violet-100 text-violet-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50 flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-violet-600 font-medium animate-pulse">
            Loading memberships...
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100 bg-gradient-to-br from-white via-rose-50/20 to-white">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            Member Exclusive
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            Exclusive <span className="text-rose-600">Membership</span> Plans
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Join our membership community and unlock premium benefits, exclusive
            discounts, and VIP experiences
          </p>
        </div>
      </section>

      {/* Membership Cards Carousel */}
      <section className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {memberships.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">
                No memberships available at the moment.
              </p>
            </div>
          ) : (
            <div>
              {/* Carousel Container */}
              <div className="relative flex items-center justify-between gap-2 sm:gap-4 mb-6 sm:mb-8">
                {/* Left Arrow */}
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) =>
                        (prev - 1 + memberships.length) % memberships.length,
                    )
                  }
                  className="flex-shrink-0 z-10 p-1.5 sm:p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:bg-gray-50"
                  aria-label="Previous membership"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>

                {/* Carousel Viewport */}
                <div className="flex-1 overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(calc(-${currentIndex * 100}%))`,
                    }}
                  >
                    {memberships.map((membership) => {
                      const isElite = membership.id === "elite";
                      const isMostPopular = membership.popular || isElite;

                      return (
                        <div
                          key={membership.id}
                          className="w-full flex-shrink-0 px-2 sm:px-3"
                        >
                          <div
                            className={`relative group transition-all duration-500 ${
                              isMostPopular ? "scale-100" : ""
                            }`}
                          >
                            {/* Glow Effect for Popular */}
                            {isMostPopular && (
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                            )}

                            {/* Card */}
                            <div
                              className={`relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 h-full flex flex-col border-2 ${
                                isMostPopular
                                  ? "border-amber-200 shadow-xl sm:shadow-2xl shadow-amber-500/20"
                                  : "border-gray-200/50 hover:border-purple-200 shadow-md sm:shadow-lg hover:shadow-xl"
                              }`}
                            >
                              {/* Popular Badge */}
                              {isMostPopular && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 px-4 py-2">
                                  <p className="text-center text-white text-sm font-bold flex items-center justify-center gap-1">
                                    <Zap className="w-4 h-4" /> MOST POPULAR
                                  </p>
                                </div>
                              )}

                              {/* Header */}
                              <div
                                className={`bg-gradient-to-br ${getGradient(
                                  membership.id,
                                )} pt-5 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6 ${
                                  isMostPopular
                                    ? "pt-12 sm:pt-16"
                                    : "pt-5 sm:pt-8"
                                } relative`}
                              >
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                  <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl">
                                    {getIcon(membership.id)}
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="text-lg sm:text-2xl font-bold text-white truncate">
                                      {membership.name}
                                    </h3>
                                    <p className="text-white/70 text-xs sm:text-sm line-clamp-1">
                                      {membership.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Discount Badge */}
                                {membership.discountPercentage > 0 && (
                                  <div
                                    className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold mt-2 ${getBadgeColor(
                                      membership.id,
                                    )}`}
                                  >
                                    {membership.discountPercentage}% Discount
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 px-4 sm:px-6 py-5 sm:py-8">
                                {/* Price */}
                                <div className="mb-6 sm:mb-8">
                                  <p className="text-gray-500 text-xs sm:text-sm mb-1">
                                    Membership Fee
                                  </p>
                                  <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                                    ₹{membership.price ?? 0}
                                    <span className="text-base sm:text-lg text-gray-600 font-normal">
                                      /year
                                    </span>
                                  </p>
                                </div>
                                {/* Features */}
                                <div className="space-y-3 sm:space-y-4">
                                  <p className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
                                    Key Benefits
                                  </p>
                                  {membership.benefits &&
                                  membership.benefits.length > 0 ? (
                                    membership.benefits
                                      .slice(0, 4)
                                      .map((benefit, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-2 sm:gap-3"
                                        >
                                          <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                          <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                            {benefit}
                                          </span>
                                        </div>
                                      ))
                                  ) : (
                                    <p className="text-xs sm:text-sm text-gray-500 italic">
                                      No specific benefits listed
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Action Button */}
                              <div className="px-4 sm:px-6 pb-5 sm:pb-8">
                                <Button
                                  className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                                    isMostPopular
                                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/50 hover:-translate-y-1"
                                      : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                                  }`}
                                >
                                  {membership.id === "regular"
                                    ? "Already Active"
                                    : `Upgrade`}
                                  {membership.id !== "regular" && (
                                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                                  )}
                                </Button>
                                <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2 sm:mt-3">
                                  {membership.id === "regular"
                                    ? "Your current membership"
                                    : "Cancel anytime, no questions asked"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % memberships.length)
                  }
                  className="flex-shrink-0 z-10 p-1.5 sm:p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:bg-gray-50"
                  aria-label="Next membership"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                {memberships.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-violet-600 w-6 sm:w-8"
                        : "bg-gray-300 w-1.5 sm:w-2 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Comparison */}
      <section className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Compare All Benefits
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              See exactly what each membership tier offers
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 sm:py-4 px-2 sm:px-4 font-bold text-gray-900">
                    Feature
                  </th>
                  {memberships.map((membership) => (
                    <th
                      key={membership.id}
                      className="text-center py-2 sm:py-4 px-2 sm:px-4 font-bold text-gray-900"
                    >
                      {membership.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Discount */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-gray-700">
                    Discount
                  </td>
                  {memberships.map((membership) => (
                    <td
                      key={membership.id}
                      className="text-center py-3 sm:py-4 px-2 sm:px-4"
                    >
                      <span className="text-base sm:text-lg font-bold text-violet-600">
                        {membership.discountPercentage}%
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Priority Booking */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-gray-700">
                    Priority Booking
                  </td>
                  {memberships.map((membership) => (
                    <td
                      key={membership.id}
                      className="text-center py-3 sm:py-4 px-2 sm:px-4"
                    >
                      {membership.benefits?.some((b) =>
                        b.toLowerCase().includes("priority"),
                      ) ? (
                        <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* VIP Events */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-gray-700">
                    VIP Events Access
                  </td>
                  {memberships.map((membership) => (
                    <td
                      key={membership.id}
                      className="text-center py-3 sm:py-4 px-2 sm:px-4"
                    >
                      {membership.benefits?.some(
                        (b) =>
                          b.toLowerCase().includes("exclusive") ||
                          b.toLowerCase().includes("event"),
                      ) ? (
                        <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Free Consultations */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-gray-700">
                    Free Consultations
                  </td>
                  {memberships.map((membership) => (
                    <td
                      key={membership.id}
                      className="text-center py-3 sm:py-4 px-2 sm:px-4"
                    >
                      {membership.benefits?.some((b) =>
                        b.toLowerCase().includes("consultation"),
                      ) ? (
                        <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Loyalty Points */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-gray-700">
                    Loyalty Points Multiplier
                  </td>
                  {memberships.map((membership) => (
                    <td
                      key={membership.id}
                      className="text-center py-3 sm:py-4 px-2 sm:px-4"
                    >
                      {membership.benefits?.some(
                        (b) =>
                          b.toLowerCase().includes("loyalty") ||
                          b.toLowerCase().includes("2x"),
                      ) ? (
                        <span className="font-bold text-violet-600">2x</span>
                      ) : (
                        <span className="font-bold text-gray-600">1x</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Concierge */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-gray-700">
                    Dedicated Concierge
                  </td>
                  {memberships.map((membership) => (
                    <td
                      key={membership.id}
                      className="text-center py-3 sm:py-4 px-2 sm:px-4"
                    >
                      {membership.benefits?.some((b) =>
                        b.toLowerCase().includes("concierge"),
                      ) ? (
                        <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 md:px-6 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Join Elite?
          </h2>
          <p className="text-violet-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Unlock exclusive benefits and enjoy premium services with our
            membership plans
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Button className="bg-white text-violet-600 hover:bg-gray-100 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base">
              View All Plans
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/20 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
