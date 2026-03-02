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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  createReferralCode,
  getCustomerReferralCodes,
  getReferrerReferrals,
  getReferralStats,
} from "../services/firebaseService";
import {
  Copy,
  Share2,
  Gift,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ReferralSystemPage() {
  const navigate = useNavigate();
  const { customerData, isAuthenticated } = useAuth();
  const [referralCodes, setReferralCodes] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);
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
    if (!customerData?.id) return;

    setLoading(true);
    try {
      const [codes, referralsData, statsData] = await Promise.all([
        getCustomerReferralCodes(customerData.id),
        getReferrerReferrals(customerData.id),
        getReferralStats(customerData.id),
      ]);

      setReferralCodes(codes);
      setReferrals(referralsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Failed to load referral data");
      console.error("Error loading referral data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!customerData?.id) return;

    setGeneratingCode(true);
    setError(null);
    setSuccess(null);

    try {
      await createReferralCode(
        customerData.id,
        customerData.name,
        10, // 10% discount
        5, // max 5 uses
        500, // 500 points for referrer
        300, // 300 points for new customer
      );

      setSuccess("Referral code generated successfully!");
      await loadReferralData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to generate referral code");
      console.error("Error creating referral code:", err);
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareCode = (code: string) => {
    const shareText = `Join Velvet Luxury Salon using my referral code: ${code}\nGet 10% discount and 300 bonus loyalty points!\n`;

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

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-[#c9a227] to-[#e8c547] bg-clip-text text-transparent mb-2">
            Referral Program
          </h1>
          <p className="text-gray-600 font-sans">
            Earn rewards by sharing your referral code with friends
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm hover:translate-y-[-2px] transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                    Active Codes
                  </p>
                  <p className="text-3xl font-bold text-[#c9a227]">
                    {stats?.activeReferralCodes || 0}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-[#c9a227]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="codes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="codes">Your Referral Codes</TabsTrigger>
            <TabsTrigger value="referrals">Referral History</TabsTrigger>
          </TabsList>

          {/* Referral Codes Tab */}
          <TabsContent value="codes" className="space-y-6">
            {/* Generate New Code Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Generate Referral Code</CardTitle>
                <CardDescription>
                  Create a new referral code to share with friends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                          <strong>500 loyalty points</strong> for you per
                          referral
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleGenerateCode}
                    disabled={generatingCode || referralCodes.length >= 5}
                    className="w-full bg-gradient-to-r from-[#c9a227] to-[#e8c547] hover:opacity-90 text-white font-semibold py-2 rounded-lg transition-all"
                  >
                    {generatingCode ? "Generating..." : "Generate New Code"}
                  </Button>

                  {referralCodes.length >= 5 && (
                    <p className="text-sm text-amber-600">
                      You can have a maximum of 5 active referral codes at a
                      time
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Existing Codes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Active Codes
              </h3>
              {referralCodes.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6 text-center text-gray-600">
                    No referral codes generated yet. Create one above!
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {referralCodes.map((codeData) => (
                    <Card
                      key={codeData.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-600 text-xs uppercase tracking-widest font-sans">
                              Referral Code
                            </Label>
                            <div className="flex items-center gap-2 mt-2">
                              <code className="flex-1 bg-amber-50 p-3 rounded-lg font-mono text-sm font-bold text-[#c9a227]">
                                {codeData.code}
                              </code>
                              <button
                                onClick={() => handleCopyCode(codeData.code)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Copy code"
                              >
                                <Copy
                                  size={20}
                                  className={
                                    copiedCode === codeData.code
                                      ? "text-green-600"
                                      : "text-gray-600"
                                  }
                                />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600">Uses</p>
                              <p className="font-bold text-gray-900">
                                {codeData.currentUses}/{codeData.maxUses}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Status</p>
                              <p
                                className={`font-bold ${
                                  codeData.status === "active"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {codeData.status.charAt(0).toUpperCase() +
                                  codeData.status.slice(1)}
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleShareCode(codeData.code)}
                            variant="outline"
                            className="w-full"
                          >
                            <Share2 size={16} className="mr-2" />
                            Share Code
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Referral History Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Referral History
            </h3>
            {referrals.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center text-gray-600">
                  No referrals yet. Share your code to start earning rewards!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <Card
                    key={referral.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow"
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
                          <p className="text-sm text-gray-500 mt-2">
                            Code:{" "}
                            <code className="bg-gray-100 px-2 py-1 rounded">
                              {referral.referralCode}
                            </code>
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end mb-2">
                            <Gift className="h-4 w-4 text-purple-600" />
                            <span className="font-bold text-purple-600">
                              +{referral.referrerRewardPoints} pts
                            </span>
                          </div>
                          <div
                            className={`text-xs font-semibold px-2 py-1 rounded ${
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

                      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                        {referral.createdAt && (
                          <p>
                            Created:{" "}
                            {new Date(
                              referral.createdAt.seconds
                                ? referral.createdAt.seconds * 1000
                                : referral.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* How it Works Section */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle>How the Referral Program Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-600 text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Generate Your Code
                  </h4>
                  <p className="text-sm text-gray-600">
                    Click "Generate New Code" to create a unique referral code
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-600 text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Share With Friends
                  </h4>
                  <p className="text-sm text-gray-600">
                    Share your code with friends via messaging, email, or social
                    media
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-600 text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Friend Signs Up
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your friend creates a new account and enters your referral
                    code
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-600 text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Earn Rewards</h4>
                  <p className="text-sm text-gray-600">
                    You both get loyalty points immediately and your friend gets
                    10% off their first visit
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
