import { useAuth } from "../context/AuthContext";
import { Gift, Users, Share2, Sparkles, TrendingUp, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { getReferralSettings } from "../services/firebaseService";

export default function AvailablePointsSection() {
  const { customerData, isAuthenticated } = useAuth();
  const [points, setPoints] = useState(0);
  const [referredCount, setReferredCount] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [redemptionRate, setRedemptionRate] = useState(20); // Default: 20 points = ₹1

  useEffect(() => {
    if (isAuthenticated && customerData) {
      setPoints(customerData?.loyaltyPoints || 0);
      setReferredCount(customerData?.referredCustomers || 0);
      // Use phone as referral code
      setReferralCode(customerData?.phone || customerData?.referralPhone || "");
    }
  }, [customerData, isAuthenticated]);

  // Fetch redemption rate from admin settings
  useEffect(() => {
    const fetchRedemptionRate = async () => {
      try {
        const settings = await getReferralSettings();
        if (settings.redemptionRate) {
          setRedemptionRate(settings.redemptionRate);
        }
      } catch (error) {
        console.error("Error fetching redemption rate:", error);
        // Keep default value on error
      }
    };

    fetchRedemptionRate();
  }, []);

  const pointsValue = points / redemptionRate; // Dynamic conversion from admin settings

  return (
    <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-amber-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-purple-200/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-pink-200/20 to-amber-200/20 rounded-full blur-3xl -ml-36 -mb-36"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Loyalty Rewards
            </h2>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-gray-600 text-lg">
            Earn points with every visit and unlock exclusive benefits
          </p>
        </div>

        {isAuthenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Points Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-amber-100 hover:border-amber-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Gift className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Your Points
              </h3>
              <p className="text-4xl font-bold text-amber-600 mb-4">{points}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Worth₹
                    <span className="font-semibold text-green-600">
                      {pointsValue.toFixed(0)}
                    </span>
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg leading-relaxed">
                    💡 <strong>Pro Tip:</strong> Share your referral ID with
                    friends to earn bonus points!
                  </p>
                </div>
              </div>
            </div>

            {/* Referral Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100 hover:border-purple-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Share
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Your Referral ID
              </h3>
              <p className="text-2xl font-bold text-purple-600 mb-4 font-mono break-all">
                {referralCode || "Connect to view"}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    You've referred{" "}
                    <span className="font-semibold text-blue-600">
                      {referredCount}
                    </span>{" "}
                    friends
                  </span>
                </div>
                <button className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                  Share & Earn
                </button>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-pink-100 hover:border-pink-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6 text-pink-600" />
                </div>
                <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                  Exclusive
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-3">
                How It Works
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600 font-bold text-xs">
                    ✓
                  </span>
                  <span>
                    <strong>1 point</strong> per rupee spent
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600 font-bold text-xs">
                    ✓
                  </span>
                  <span>
                    <strong>Bonus points</strong> for referrals
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600 font-bold text-xs">
                    ✓
                  </span>
                  <span>
                    <strong>Redeem</strong> for discounts
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          // Not authenticated state
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-amber-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Join Our Loyalty Program
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Sign up to start earning points with every purchase and unlock
              exclusive rewards!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
                Sign Up
              </button>
              <button className="px-8 py-3 border-2 border-purple-500 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex gap-4 items-start">
            <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                💡 Referral Bonus Program
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Share your referral ID with friends and earn bonus points when
                they book their first appointment! Your referral ID is tied to
                your phone number for easy sharing.{" "}
                <strong className="text-purple-600">
                  Every successful referral earns you 100 bonus points!
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
