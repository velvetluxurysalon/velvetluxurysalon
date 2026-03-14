import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  getReferrerReferrals,
  getReferralStats,
} from "../services/firebaseService";
import {
  Copy,
  Share2,
  Gift,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ReferralSystemPage() {
  const navigate = useNavigate();
  const { customerData, isAuthenticated } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/customer/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    loadReferralData();
  }, [customerData]);

  const loadReferralData = async () => {
    if (!customerData?.phone) return;

    setLoading(true);
    try {
      const [referralsData, statsData] = await Promise.all([
        getReferrerReferrals(customerData.phone),
        getReferralStats(customerData.phone),
      ]);

      setReferrals(referralsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Failed to load referral data");
      console.error("Error loading referral data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareCode = (code: string) => {
    const shareText = `Join Velvet Luxury Salon using my referral code: ${code}\nGet 10% discount and 300 bonus loyalty points!\nhttps://velvetluxurysalon.com`;

    if (navigator.share) {
      navigator
        .share({
          title: "Velvet Luxury Salon Referral",
          text: shareText,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      setSuccess("Share text copied to clipboard!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12 px-4 text-center">
        <p className="text-gray-600">Loading referral data...</p>
      </div>
    );
  }

  const referralCode = customerData?.phone || "";

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-[#c9a227] to-[#e8c547] bg-clip-text text-transparent mb-2">
            Referral Program
          </h1>
          <p className="text-gray-600 font-sans">
            Earn rewards by sharing your phone number as a referral code with
            friends
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm hover:translate-y-[-2px] transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                    Total Referrals
                  </p>
                  <p className="text-3xl font-bold text-[#c9a227]">
                    {stats?.totalReferrals || 0}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Users className="h-8 w-8 text-[#c9a227]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm hover:translate-y-[-2px] transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                    Successful
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats?.successfulReferrals || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm hover:translate-y-[-2px] transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                    Rewards Earned
                  </p>
                  <p className="text-3xl font-bold text-amber-600">
                    {stats?.totalRewardsEarned || 0}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Gift className="h-8 w-8 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Referral Code Card */}
        <Card className="border-0 shadow-lg mb-8 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎁</span> Your Referral Code
            </CardTitle>
            <CardDescription>
              Share this code with friends to earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border-2 border-amber-200">
                <Label className="text-gray-600 text-xs uppercase tracking-widest font-sans">
                  Phone Number (Referral Code)
                </Label>
                <div className="flex items-center gap-2 mt-4">
                  <code className="flex-1 bg-amber-50 p-4 rounded-lg font-mono text-lg font-bold text-[#c9a227]">
                    {referralCode}
                  </code>
                  <button
                    onClick={() => handleCopyCode(referralCode)}
                    className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    <Copy
                      size={24}
                      className={
                        copiedCode === referralCode
                          ? "text-green-600"
                          : "text-[#c9a227]"
                      }
                    />
                  </button>
                </div>
                {copiedCode === referralCode && (
                  <p className="text-sm text-green-600 mt-2">✓ Copied!</p>
                )}
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-[#c9a227]" />
                    <span>
                      <strong>10% discount</strong> for new customers
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-[#c9a227]" />
                    <span>
                      <strong>300 loyalty points</strong> for new customers
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-[#c9a227]" />
                    <span>
                      <strong>500 loyalty points</strong> for you per successful
                      referral
                    </span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => handleShareCode(referralCode)}
                className="w-full bg-gradient-to-r from-[#c9a227] to-[#e8c547] hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all h-auto"
              >
                <Share2 size={18} className="mr-2" />
                Share Referral Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>
              Track your successful referrals and rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  No referrals yet. Share your code to start earning rewards!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <Card
                    key={referral.id}
                    className="border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {referral.newCustomerName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {referral.newCustomerPhone}
                          </p>
                          {referral.createdAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Referred:{" "}
                              {new Date(
                                referral.createdAt.seconds
                                  ? referral.createdAt.seconds * 1000
                                  : referral.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end mb-2">
                            <Gift className="h-4 w-4 text-[#c9a227]" />
                            <span className="font-bold text-[#c9a227]">
                              +{referral.referrerRewardPoints} pts
                            </span>
                          </div>
                          <div
                            className={`text-xs font-semibold px-3 py-1 rounded ${
                              referral.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {referral.status.charAt(0).toUpperCase() +
                              referral.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* How it Works Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>How the Referral Program Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#c9a227] text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Share Your Phone Number
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your phone number is your referral code. Copy and share it
                    with friends
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#c9a227] text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Friend Signs Up
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your friend creates a new account and enters your phone
                    number as their referral code
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#c9a227] text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Earn Rewards</h4>
                  <p className="text-sm text-gray-600">
                    You both get loyalty points immediately and your friend gets
                    10% off their first service
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
