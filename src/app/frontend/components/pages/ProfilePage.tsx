import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  LogOut,
  Heart,
  CreditCard,
  Settings,
  Award,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getCustomerSpinHistory } from "../../services/firebaseService";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { customerData, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(!isAuthenticated);
  const [spinHistory, setSpinHistory] = useState<any[]>([]);
  const [loadingSpins, setLoadingSpins] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/customer/login");
    } else {
      setLoading(false);
      loadSpinHistory();
    }
  }, [isAuthenticated, navigate, customerData?.id]);

  const loadSpinHistory = async () => {
    if (!customerData?.id) return;
    try {
      setLoadingSpins(true);
      const history = await getCustomerSpinHistory(customerData.id, 10);
      setSpinHistory(history);
    } catch (error) {
      console.error("Error loading spin history:", error);
    } finally {
      setLoadingSpins(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100 bg-gradient-to-br from-white via-emerald-50/20 to-white">
        <div className="max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            Account
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            My <span className="text-emerald-600">Profile</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Manage your account information and preferences
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="bg-white rounded-sm border border-slate-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-24 h-24 rounded-sm bg-slate-900 flex items-center justify-center text-white text-4xl font-light flex-shrink-0">
                  {customerData?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mb-2">
                    {customerData?.name || "User"}
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {customerData?.email || "No email"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate("/favorites")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Heart size={16} />
                      Favorites
                    </Button>
                    <Button
                      onClick={() => navigate("/referrals")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Award size={16} />
                      Referrals
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User size={20} className="text-violet-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {customerData?.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <Phone size={16} className="text-violet-500" />
                    {customerData?.id || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <Mail size={16} className="text-violet-500" />
                    {customerData?.email || "Not provided"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award size={20} className="text-violet-600" />
                  Loyalty Points
                </CardTitle>
                <CardDescription>Your rewards and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Total Points
                  </label>
                  <p className="text-3xl font-extrabold text-violet-600">
                    {customerData?.loyaltyPoints || 0}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-900 font-medium text-sm">
                      {customerData?.createdAt
                        ? new Date(customerData.createdAt).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Status
                    </label>
                    <p className="text-sm">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 font-semibold text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        Active
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Membership Information */}
          <Card className="border-gray-100 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard size={20} className="text-violet-600" />
                Memberships
              </CardTitle>
              <CardDescription>
                Your memberships and subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  You don't have any active memberships yet.
                </p>
                <Button
                  onClick={() => navigate("/memberships")}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-500"
                >
                  Explore Memberships
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Spin Wheel History */}
          <Card className="border-gray-100 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap size={20} className="text-amber-600" />
                Spin Wheel History
              </CardTitle>
              <CardDescription>
                Your recent lucky spins and rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSpins ? (
                <div className="text-center py-8 text-gray-500">
                  Loading spin history...
                </div>
              ) : spinHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    You haven't spun the wheel yet! Try your luck today.
                  </p>
                  <Button
                    onClick={() => navigate("/spin-wheel")}
                    className="bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    <Sparkles size={16} className="mr-2" />
                    Spin Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    {spinHistory.map((spin, index) => (
                      <div
                        key={spin.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-amber-100 bg-amber-50 hover:bg-amber-100/50 transition"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {spin.pointsWon} Points
                            </p>
                            <p className="text-xs text-gray-600">
                              {spin.timestamp instanceof Date
                                ? spin.timestamp.toLocaleDateString() +
                                  " " +
                                  spin.timestamp.toLocaleTimeString()
                                : new Date(spin.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {spin.isJackpot && (
                          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
                            JACKPOT 🎉
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => navigate("/spin-wheel")}
                    className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    <Sparkles size={16} className="mr-2" />
                    Spin Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={() => navigate("/memberships")}
              variant="outline"
              className="flex items-center justify-center gap-2 h-12 rounded-xl border-2"
            >
              <Settings size={18} />
              View Memberships
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>

          {/* Info Alert */}
          <Alert className="border-violet-200 bg-violet-50">
            <Heart className="h-4 w-4 text-violet-600" />
            <AlertDescription className="text-violet-700">
              Need help? Contact us at{" "}
              <a
                href="mailto:hello@velvetsalon.com"
                className="font-semibold hover:underline"
              >
                hello@velvetsalon.com
              </a>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </>
  );
}
