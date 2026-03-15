import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Zap,
  Trophy,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  Gift,
} from "lucide-react";
import {
  recordDailySpins,
  getSpinWheelStats,
  getReferralSettings,
} from "../services/firebaseService";
import "./SpinWheel.css";

const WHEEL_SEGMENTS = [
  { label: "50 pts", points: 50, color: "#ef4444" },
  { label: "100 pts", points: 100, color: "#f97316" },
  { label: "75 pts", points: 75, color: "#eab308" },
  { label: "200 pts", points: 200, color: "#22c55e" },
  { label: "150 pts", points: 150, color: "#06b6d4" },
  { label: "125 pts", points: 125, color: "#3b82f6" },
  { label: "250 pts", points: 250, color: "#a855f7" },
  { label: "JACKPOT", points: 5000, color: "#ec4899", isJackpot: true },
];

export default function SpinWheelPage() {
  const navigate = useNavigate();
  const { customerData, isAuthenticated } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastReward, setLastReward] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info",
  );
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redemptionRate, setRedemptionRate] = useState(20); // Default: 20 points = ₹1

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/customer/login");
    }
  }, [isAuthenticated, navigate]);

  // Load spin stats and redemption rate on mount
  useEffect(() => {
    const loadData = async () => {
      if (customerData?.id) {
        try {
          const wheelStats = await getSpinWheelStats(customerData.id);
          setStats(wheelStats);
          setHasSpunToday(wheelStats.hasSpunToday || false);

          // Fetch redemption rate from admin settings
          const settings = await getReferralSettings();
          if (settings.redemptionRate) {
            setRedemptionRate(settings.redemptionRate);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [customerData]);

  const handleSpin = async () => {
    if (!customerData?.id || isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setMessage(null);

    try {
      // Random rotation between 0 and 360
      const randomSpin = Math.random() * 360;
      const newRotation = rotation + 3600 + randomSpin; // 10 full spins + random

      // Calculate which segment wins
      const segmentAngle = 360 / WHEEL_SEGMENTS.length;
      const normalizedAngle = (((360 - randomSpin) % 360) + 360) % 360;
      const winningIndex =
        Math.floor(normalizedAngle / segmentAngle) % WHEEL_SEGMENTS.length;
      const winningSegment = WHEEL_SEGMENTS[winningIndex];

      setRotation(newRotation);

      // Wait for spin animation to complete (4 seconds)
      setTimeout(async () => {
        try {
          // Record the spin and get reward
          const reward = await recordDailySpins(
            customerData.id,
            customerData.name,
            winningSegment.points,
            winningSegment.isJackpot || false,
          );

          setLastReward({
            ...winningSegment,
            actualPoints: reward.pointsAwarded,
            isJackpotWinner: reward.isJackpotWinner,
          });

          if (reward.isJackpotWinner) {
            setMessage(
              `🎉 LEGENDARY JACKPOT! You won ${reward.pointsAwarded} points! You're the chosen one! 🏆`,
            );
            setMessageType("success");
          } else if (winningSegment.isJackpot) {
            setMessage(
              `Next winner will be incredibly lucky! Current spins: ${reward.totalSpins}/10000`,
            );
            setMessageType("info");
          } else {
            setMessage(
              `✨ Congratulations! You've earned ${reward.pointsAwarded} points! Come back tomorrow! ✨`,
            );
            setMessageType("success");
          }

          setHasSpunToday(true);

          // Reload stats
          const updatedStats = await getSpinWheelStats(customerData.id);
          setStats(updatedStats);
        } catch (error: any) {
          setMessage(
            error.message || "Error recording spin. Please try again.",
          );
          setMessageType("error");
        } finally {
          setIsSpinning(false);
        }
      }, 4000);
    } catch (error) {
      console.error("Spin error:", error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
      setIsSpinning(false);
    }
  };

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#24243e] to-[#0f0c29] px-6 sm:px-10 lg:px-16 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a227] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c9a227] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl relative z-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9a227] mb-3 font-sans">
            Exclusive Rewards
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-white mb-4 leading-tight">
            The Golden Spin
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
            Experience the thrill of our premium rewards wheel. Spin once daily
            to win exclusive loyalty points! One lucky customer every 10,000
            spins hits the grand 5,000 points jackpot.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 sm:px-10 lg:px-16 bg-[#fdfbf7]">
        <div className="max-w-6xl mx-auto">
          {/* Available Points Card */}
          <div className="mb-8">
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-l-[#c9a227]">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#c9a227] uppercase tracking-widest mb-2">
                      Your Available Points
                    </p>
                    <p className="text-5xl font-serif font-black text-[#c9a227]">
                      {customerData?.loyaltyPoints || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Worth ₹
                      {(
                        (customerData?.loyaltyPoints || 0) / redemptionRate
                      ).toFixed(1)}{" "}
                      in rewards
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl shadow-md">
                    <Gift className="w-12 h-12 text-[#c9a227]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wheel Section */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl overflow-hidden bg-white spin-card">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-gradient-to-br from-[#c9a227] to-[#e8c547] rounded-lg shadow-md">
                      <Zap size={24} className="text-white" />
                    </div>
                    <span className="font-serif font-bold text-[#1a1a2e]">
                      Spin Your Fortune
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-12">
                  {/* Wheel */}
                  <div className="relative mb-12">
                    <div className="absolute inset-0 w-32 h-32 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#c9a227] via-[#e8c547] to-[#a68523] flex items-center justify-center text-white font-black text-center text-lg p-4 spin-center relative shadow-xl border-4 border-white/20">
                        <div className="relative z-10 font-serif tracking-widest">
                          SPIN
                        </div>
                      </div>
                    </div>

                    <svg
                      className="spin-wheel"
                      width="400"
                      height="400"
                      viewBox="0 0 400 400"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning
                          ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.98)"
                          : "none",
                      }}
                    >
                      {WHEEL_SEGMENTS.map((segment, index) => {
                        const angle = (index * 360) / WHEEL_SEGMENTS.length;
                        const startAngle = angle;
                        const endAngle = angle + 360 / WHEEL_SEGMENTS.length;

                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;

                        const x1 = 200 + 150 * Math.cos(startRad);
                        const y1 = 200 + 150 * Math.sin(startRad);
                        const x2 = 200 + 150 * Math.cos(endRad);
                        const y2 = 200 + 150 * Math.sin(endRad);

                        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

                        const path = `M 200 200 L ${x1} ${y1} A 150 150 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        const textAngle =
                          startAngle + 360 / WHEEL_SEGMENTS.length / 2;
                        const textRad = (textAngle * Math.PI) / 180;
                        const textX = 200 + 100 * Math.cos(textRad);
                        const textY = 200 + 100 * Math.sin(textRad);

                        return (
                          <g key={index}>
                            <path
                              d={path}
                              fill={segment.color}
                              stroke="white"
                              strokeWidth="2"
                            />
                            <text
                              x={textX}
                              y={textY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="white"
                              fontSize="14"
                              fontWeight="bold"
                              transform={`rotate(${textAngle} ${textX} ${textY})`}
                            >
                              {segment.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 text-5xl spin-pointer">
                      ▼
                    </div>
                  </div>

                  {/* Spin Button */}
                  <Button
                    onClick={handleSpin}
                    disabled={isSpinning || hasSpunToday}
                    className={`text-lg font-serif font-black py-7 px-16 rounded-2xl transition-all spin-button shadow-xl ${
                      hasSpunToday
                        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#c9a227] to-[#e8c547] hover:scale-105 active:scale-95 text-white shadow-[#c9a227]/20"
                    }`}
                  >
                    {isSpinning
                      ? "Spinning..."
                      : hasSpunToday
                        ? "Visit Us Tomorrow"
                        : "SPIN NOW!"}
                  </Button>

                  {/* Last Reward */}
                  {lastReward && (
                    <div className="mt-8 text-center w-full">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 font-sans">
                        Last Spin Result
                      </p>
                      <div className="inline-block bg-amber-50 border-2 border-amber-100 rounded-2xl px-8 py-4 shadow-sm">
                        <p className="font-serif font-black text-xl text-[#c9a227]">
                          {lastReward.label}
                        </p>
                        {lastReward.isJackpotWinner && (
                          <p className="text-sm text-amber-600 font-black mt-2 tracking-wide">
                            LEGENDARY JACKPOT WINNER!
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats & Info Section */}
            <div className="space-y-4">
              {/* Stats Card */}
              <Card
                className="border-0 shadow-2xl overflow-hidden bg-white spin-card rounded-none"
                style={{ animationDelay: "0.1s" }}
              >
                <CardHeader className="bg-[#fdfbf7] border-b border-[#c9a227]/10 pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="p-2 bg-[#c9a227] rounded-none">
                      <Trophy size={18} className="text-white" />
                    </div>
                    <span className="text-[#c9a227]">Your Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="spin-stat-item bg-[#fdfbf7] rounded-none p-5 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Total Spins
                    </p>
                    <p className="text-4xl font-serif font-black text-[#c9a227]">
                      {stats?.userTotalSpins || 0}
                    </p>
                  </div>
                  <div className="spin-stat-item bg-[#fdfbf7] rounded-none p-5 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Points Today
                    </p>
                    <p className="text-4xl font-serif font-black text-[#c9a227]">
                      {stats?.dailyPointsWon || 0}
                    </p>
                  </div>
                  <div
                    className={`spin-stat-item rounded-none p-5 border ${
                      hasSpunToday
                        ? "bg-slate-50 border-slate-200"
                        : "bg-[#1a1a2e] border-none"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mb-2 ${hasSpunToday ? "text-slate-400" : "text-[#c9a227]/60"}`}
                    >
                      Daily Spins Left
                    </p>
                    <p
                      className={`text-4xl font-serif font-black ${
                        hasSpunToday ? "text-slate-300" : "text-[#c9a227]"
                      }`}
                    >
                      {hasSpunToday ? "0" : "1"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Global Stats */}
              <Card
                className="border-0 shadow-2xl overflow-hidden bg-[#1a1a2e] spin-card rounded-none"
                style={{ animationDelay: "0.2s" }}
              >
                <CardHeader className="bg-[#1a1a2e] border-b border-white/5 pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="p-2 bg-[#c9a227] rounded-none shadow-[0_0_15px_rgba(201,162,39,0.3)]">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <span className="text-[#c9a227]">Jackpot Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-8">
                  <div>
                    <div className="flex justify-between items-baseline mb-4">
                      <p className="text-[10px] font-black text-[#c9a227]/60 uppercase tracking-widest">
                        Community Progress
                      </p>
                      <p className="text-xs font-black text-white">
                        {stats?.totalSpins || 0} / 10,000
                      </p>
                    </div>
                    <div className="w-full bg-white/5 rounded-none h-2.5 overflow-hidden border border-white/5">
                      <div
                        className="bg-[#c9a227] h-full transition-all spin-progress-bar shadow-[0_0_15px_rgba(201,162,39,0.5)]"
                        style={{
                          width: `${Math.min((stats?.totalSpins || 0) / 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {stats?.jackpotWinner && (
                    <div className="bg-white/5 border border-[#c9a227]/30 rounded-none p-5 shadow-2xl">
                      <p className="text-[10px] font-black text-[#c9a227] uppercase tracking-widest mb-2 font-sans">
                        Latest Grand Winner
                      </p>
                      <p className="font-serif font-bold text-xl text-white">
                        {stats.jackpotWinner}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Spin Status */}
              {message && (
                <Alert
                  className={`border-none shadow-2xl spin-message rounded-lg px-6 py-5 ${
                    messageType === "success"
                      ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white border-2 border-green-400"
                      : messageType === "error"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-red-400"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-2 border-blue-400"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {messageType === "success" ? (
                      <CheckCircle className="h-7 w-7 text-white flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-7 w-7 flex-shrink-0" />
                    )}
                    <AlertDescription className="font-black text-sm uppercase tracking-widest">
                      {message}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Rules */}
              <Card
                className="border-0 shadow-2xl overflow-hidden bg-white border-l-4 border-l-[#c9a227] spin-card rounded-none"
                style={{ animationDelay: "0.3s" }}
              >
                <CardHeader className="bg-[#fdfbf7] border-b border-slate-100 pb-4">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 text-slate-800">
                    <Clock size={16} className="text-[#c9a227]" />
                    Grand Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-500 space-y-4 pt-6 font-sans">
                  <div className="flex items-start gap-4">
                    <span className="text-[#c9a227] font-black text-sm">
                      01
                    </span>
                    <p className="font-medium tracking-wide uppercase text-[9px]">
                      Spin once per day for free
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-[#c9a227] font-black text-sm">
                      02
                    </span>
                    <p className="font-medium tracking-wide uppercase text-[9px]">
                      Win 50-250 loyalty points instantly
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-[#c9a227] font-black text-sm">
                      03
                    </span>
                    <p className="font-medium tracking-wide uppercase text-[9px]">
                      Every 10,000 community spins awards 5,000 points
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-[#c9a227] font-black text-sm">
                      04
                    </span>
                    <p className="font-medium tracking-wide uppercase text-[9px]">
                      Resets daily at midnight
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Development Disclaimer */}
      <section className="py-8 px-6 sm:px-10 lg:px-16 bg-amber-50/80 border-t border-b border-amber-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                ⚠️ Development Notice
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                The Spin Wheel feature is currently under development. All
                points awarded are provisional and subject to review by our
                salon receptionist. Please note that points{" "}
                <strong>may not be valid</strong> until the feature development
                is fully completed. Thank you for your patience as we refine
                this exciting new rewards feature!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
