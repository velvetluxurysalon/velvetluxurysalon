import { useState, useEffect } from "react";
import { Copy, Check, Gift, Clock } from "lucide-react";
import { getCoupons } from "../../services/firebaseService";

interface Coupon {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  maxUsageCount?: number;
  currentUsageCount?: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  validFrom: any;
  validUntil: any;
  isActive: boolean;
  description: string;
  createdAt?: any;
  updatedAt?: any;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error("Error loading coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDiscountValue = (type: string, value: number): string => {
    if (type === "percentage") {
      return `${value}% OFF`;
    }
    return `₹${value} OFF`;
  };

  const isValidDate = (date: any): boolean => {
    if (!date) return true;
    const dateObj = date?.toDate?.() || new Date(date);
    return dateObj > new Date();
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-amber-100 bg-gradient-to-br from-white via-amber-50/20 to-white">
        <div className="max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-[#c9a227] text-[10px] font-black uppercase tracking-widest mb-6 font-sans">
            Limited Time Offers
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-bold tracking-tight text-slate-900 mb-6">
            Exclusive <span className="text-[#c9a227]">Rewards</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl leading-relaxed font-sans">
            Indulge in our premium beauty and wellness services with these
            curated offers. Copy and apply these exclusive coupon codes to
            elevate your salon experience.
          </p>
        </div>
      </section>

      {/* Coupons Grid */}
      <div className="py-16 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading available coupons...</p>
            </div>
          ) : coupons.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-amber-100 overflow-hidden hover:border-[#c9a227] group"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#c9a227] to-[#e8c547] p-8 text-white relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 mb-3 font-sans">
                          Coupon Code
                        </p>
                        <h3 className="text-4xl font-serif font-black mb-2 tracking-widest">
                          {coupon.code}
                        </h3>
                        <p className="text-amber-50 text-base font-medium font-sans">
                          {formatDiscountValue(
                            coupon.discountType,
                            coupon.discountValue,
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      {/* Description */}
                      {coupon.description && (
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed font-medium font-sans">
                          {coupon.description}
                        </p>
                      )}

                      {/* Discount Details */}
                      <div className="mb-6 p-5 bg-amber-50/50 rounded-xl border border-amber-100">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          {coupon.minOrderAmount > 0 && (
                            <div>
                              <p className="text-amber-600 text-[10px] uppercase font-bold tracking-wider mb-1 font-sans">
                                Min Spend
                              </p>
                              <p className="text-xl font-bold text-slate-900 font-serif">
                                ₹{coupon.minOrderAmount}
                              </p>
                            </div>
                          )}
                          {coupon.maxDiscountAmount && (
                            <div>
                              <p className="text-amber-600 text-[10px] uppercase font-bold tracking-wider mb-1 font-sans">
                                Max Limit
                              </p>
                              <p className="text-xl font-bold text-slate-900 font-serif">
                                ₹{coupon.maxDiscountAmount}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Validity */}
                      {coupon.validUntil && (
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-6 pb-6 border-b border-amber-100 uppercase tracking-widest font-sans">
                          <Clock className="w-4 h-4 text-[#c9a227]" />
                          <span>
                            {isValidDate(coupon.validUntil)
                              ? "Limited Time Reward"
                              : "Expired Offer"}
                          </span>
                        </div>
                      )}

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyCoupon(coupon.code)}
                        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg font-sans ${
                          copiedCode === coupon.code
                            ? "bg-green-600 text-white shadow-green-100"
                            : "bg-[#c9a227] hover:bg-[#a68523] text-white shadow-amber-100"
                        }`}
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <Check className="w-5 h-5" />
                            REWARD SECURED
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            COPY COUPON
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 mb-12 shadow-sm">
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Gift className="w-6 h-6 text-[#c9a227]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-amber-900 text-xl mb-3">
                      How to Redeem Your Exclusive Offer
                    </h3>
                    <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside font-medium font-sans">
                      <li>Select and copy the reward code of your choice</li>
                      <li>Explore our services and proceed to booking</li>
                      <li>
                        Apply the code at checkout for instant luxury rewards
                      </li>
                      <li>
                        Terms and conditions apply for all promotional offers
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-amber-200 shadow-sm">
              <div className="p-4 bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-[#c9a227]" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                No Active Coupons
              </h3>
              <p className="text-slate-500 font-sans">
                Our elite rewards are being refreshed. Check back soon for
                exclusive offers!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
