import { useState, useEffect } from "react";
import { Copy, Check, Gift, Percent, DollarSign, Clock } from "lucide-react";
import { getCoupons } from "../services/firebaseService";

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

export default function CouponDisplay() {
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
    return dateObj < new Date();
  };

  if (loading) {
    return <div className="text-center py-8">Loading coupons...</div>;
  }

  if (coupons.length === 0) {
    return null;
  }

  return (
    <div className="py-12 px-6 lg:px-16 bg-[#fdfbf7]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
            <Gift className="inline w-8 h-8 text-[#c9a227] mr-3" />
            Limited Time Offers
          </h2>
          <p className="text-slate-600 font-sans font-medium">
            Elevate your experience with our exclusive reward codes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-amber-100 overflow-hidden group"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-[#c9a227] to-[#e8c547] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 font-sans">
                      Reward Code
                    </p>
                    <h3 className="text-3xl font-serif font-black mt-1 tracking-widest">
                      {coupon.code}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopyCoupon(coupon.code)}
                    className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                    title="Copy code"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Discount Description */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      {coupon.discountType === "percentage" ? (
                        <Percent className="w-5 h-5 text-[#c9a227]" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-[#c9a227]" />
                      )}
                    </div>
                    <span className="text-xl font-serif font-bold text-slate-900">
                      {formatDiscountValue(
                        coupon.discountType,
                        coupon.discountValue,
                      )}
                    </span>
                  </div>
                  {coupon.description && (
                    <p className="text-sm text-slate-600 font-sans leading-relaxed">
                      {coupon.description}
                    </p>
                  )}
                </div>

                {/* Conditions */}
                <div className="space-y-3 mb-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-y border-amber-50 py-4 font-sans">
                  {coupon.minOrderAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Minimum Spend</span>
                      <span className="text-slate-900 font-black">
                        ₹{coupon.minOrderAmount}
                      </span>
                    </div>
                  )}
                  {coupon.maxDiscountAmount && (
                    <div className="flex justify-between items-center">
                      <span>Maximum Reward</span>
                      <span className="text-slate-900 font-black">
                        ₹{coupon.maxDiscountAmount}
                      </span>
                    </div>
                  )}
                  {coupon.validUntil && isValidDate(coupon.validUntil) && (
                    <div className="flex items-center gap-2 text-[#c9a227]">
                      <Clock className="w-4 h-4" />
                      <span>Limited Time Offer</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className={`w-full py-3 rounded-xl font-black transition-all text-xs uppercase tracking-[0.15em] font-sans ${
                    copiedCode === coupon.code
                      ? "bg-green-600 text-white shadow-lg shadow-green-100"
                      : "bg-amber-50 hover:bg-[#c9a227] text-[#c9a227] hover:text-white"
                  }`}
                >
                  {copiedCode === coupon.code
                    ? "✓ SECURED"
                    : "COPY REWARD CODE"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <div className="mt-10 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-amber-900 font-sans font-medium flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              💡
            </span>
            <span>
              <strong>Privilege Tip:</strong> Simply copy your preferred code
              and apply it during checkout to receive your exclusive luxury
              reward.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
