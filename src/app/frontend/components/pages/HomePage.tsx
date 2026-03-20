import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Share2, Award, ArrowRight, X } from "lucide-react";
import {
  getServices,
  getHeroContent,
  Service,
  HeroContent,
  getSiteSettings,
  getContactInfo,
  getFAQs,
  FAQ,
} from "../../services/contentService";
import { useAuth } from "../../context/AuthContext";
import HeroCarousel from "../HeroCarousel";
import TestimonialsSection from "../TestimonialsSection";

interface SiteSettings {
  stats?: {
    experience: string;
    happyClients: string;
    stylists: string;
    treatments: string;
  };
  businessHours?: {
    [key: string]: string;
  };
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  hours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [, setServices] = useState<Service[]>([]);
  const [, setSiteSettings] = useState<SiteSettings | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [, setFaqs] = useState<FAQ[]>([]);
  const [, setLoading] = useState(true);
  const [showSpinWheel, setShowSpinWheel] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hero, svc, settings, contact, faqList] = await Promise.all([
          getHeroContent(),
          getServices().then((s) => s.slice(0, 4)),
          getSiteSettings(),
          getContactInfo(),
          getFAQs(),
        ]);
        setHeroContent(hero);
        setServices(svc);
        setSiteSettings(settings);
        setContactInfo(contact);
        setFaqs(faqList);
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const serviceCategories = [
    { name: "Men", image: "/assets/men.jpeg" },
    { name: "Women", image: "/assets/women.jpeg" },
    { name: "Unisex", image: "/assets/unisex.jpeg" },
  ];

  const rewardCards = [
    {
      icon: <Gift className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-100",
      title: "Your Points",
      value: "0 pts",
      sub: "Worth ₹0 in discounts",
    },
    {
      icon: <Share2 className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-100",
      title: "Referral ID",
      value: user?.phone || "-",
      sub: "Invite friends & earn rewards",
    },
    {
      icon: <Award className="w-5 h-5 text-pink-600" />,
      bg: "bg-pink-100",
      title: "Membership",
      value: "Silver",
      sub: "Unlock exclusive benefits",
    },
  ];

  const handleCloseSpinWheel = () => {
    setShowSpinWheel(false);
    console.log("Spin wheel closed, isAuthenticated:", isAuthenticated);
    // Show login prompt if not authenticated
    if (!isAuthenticated) {
      console.log("User not authenticated, showing login popup");
      setTimeout(() => {
        console.log("Setting login prompt to true");
        setShowLoginPrompt(true);
      }, 300);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* ── HERO CAROUSEL ── */}
      <div className="w-full">
        {heroContent?.slides && heroContent.slides.length > 0 ? (
          <HeroCarousel slides={heroContent.slides} contactInfo={contactInfo} />
        ) : (
          <HeroCarousel
            slides={[
              {
                id: "default-1",
                heading: "Where Luxury Meets Beauty",
                subheading:
                  "Experience world-class beauty and wellness treatments",
                layers: [
                  {
                    id: "layer-default-1",
                    type: "image",
                    content:
                      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&h=800&fit=crop",
                    opacity: 1,
                    order: 0,
                  },
                ],
                ctaButtonText: "Reserve Your Moment",
                ctaButtonLink: "/appointments",
                order: 0,
              },
            ]}
            contactInfo={contactInfo}
          />
        )}
      </div>

      {/* ── LOYALTY REWARDS ── */}
      <div className="w-full bg-amber-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Your Loyalty Rewards
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Earn points with every visit
            </p>
          </div>
          {/* Horizontal scrollable cards on mobile, grid on desktop */}
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
            {rewardCards.map((card) => (
              <div
                key={card.title}
                className="min-w-[200px] snap-start flex-shrink-0 md:min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
                  {card.icon}
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  {card.title}
                </p>
                {card.title === "Referral ID" && !isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-gray-600">
                      Log in to see your referral ID
                    </p>
                    <button
                      onClick={() => navigate("/login")}
                      className="text-xs font-semibold px-3 py-1.5 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                    >
                      Log In
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-base font-bold text-gray-900 mb-1">
                      {card.value}
                    </p>
                    <p className="text-xs text-gray-400">{card.sub}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXPLORE SERVICES ── */}
      <div className="w-full bg-white px-4 py-8 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">
              Our Collections
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              Explore Our Services
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Premium beauty & wellness for every individual
            </p>
          </div>
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
            {serviceCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() =>
                  navigate(`/services?category=${cat.name.toLowerCase()}`)
                }
                className="relative w-full h-40 md:h-56 overflow-hidden rounded-xl cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <span className="text-white text-lg font-bold">
                    {cat.name}
                  </span>
                  <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div className="w-full border-t border-gray-100">
        <TestimonialsSection />
      </div>

      {/* ── SPIN WHEEL POPUP ── */}
      {showSpinWheel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCloseSpinWheel}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎡 Spin to Win!
              </h3>
              <p className="text-gray-600 mb-6">
                Try your luck and win amazing rewards and discounts
              </p>
              <button
                onClick={() => navigate("/spin-wheel")}
                className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-colors text-lg"
              >
                Spin Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGIN PROMPT POPUP ── */}
      {showLoginPrompt && !isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Velvet Luxury
              </h3>
              <p className="text-gray-600 mb-6">
                Log in to unlock exclusive rewards, referrals, and special
                offers
              </p>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/login");
                }}
                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors mb-3"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/signup");
                }}
                className="w-full border-2 border-gray-900 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
