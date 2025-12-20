import { Button } from "./ui/button";
import { Sparkles, Calendar, Scissors, Zap, Gem, Palette } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { getHeroContent, getServices } from "../services/contentService";
import BookingForm from "./BookingForm";

interface HeroData {
  title?: string;
  subtitle?: string;
  image?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      setLoading(true);
      const [heroContent, servicesData] = await Promise.all([
        getHeroContent(),
        getServices()
      ]);
      
      if (heroContent) {
        setHeroData(heroContent);
      }
      
      if (servicesData) {
        setServices(servicesData.slice(0, 4));
      }
    } catch (error) {
      console.error("Error loading hero data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      alert("Please login to book an appointment");
      return;
    }
    setShowBookingForm(true);
  };

  const defaultHeroData: HeroData = {
    title: "Premium Salon Services at Your Fingertips",
    subtitle: "Book appointments instantly | Expert stylists | Best services",
    image: "https://images.unsplash.com/photo-1681965823525-b684fb97e9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWxvbiUyMGludGVyaW9yfGVufDF8fHx8MTc2NjEyMjk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    ctaButtonText: "Book an Appointment",
    ctaButtonLink: "/book"
  };

  const displayData = heroData || defaultHeroData;

  const defaultServices = [
    { name: "Haircut", icon: Scissors },
    { name: "Spa", icon: Zap },
    { name: "Nails", icon: Gem },
    { name: "Makeup", icon: Palette }
  ];

  const displayServices = services.length > 0 
    ? services.map((service, idx) => ({
        name: service.name,
        icon: [Scissors, Zap, Gem, Palette][idx % 4]
      }))
    : defaultServices;

  if (loading) {
    return (
      <div className="relative h-screen w-full overflow-hidden mt-0 flex items-center justify-center bg-purple-50">
        <div className="text-purple-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden mt-0 bg-gradient-to-br from-purple-600 to-purple-900">
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Premium Salon Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl mb-6">
            {displayData.title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {displayData.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6"
              onClick={handleBooking}
            >
              <Calendar className="w-5 h-5 mr-2" />
              {displayData.ctaButtonText}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-6">
              Explore Services
            </Button>
          </div>

          {/* Floating Service Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {displayServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.name}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Icon className="w-8 h-8 mb-2 mx-auto" />
                  <p className="text-sm">{service.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </div>
      <BookingForm isOpen={showBookingForm} onClose={() => setShowBookingForm(false)} />
    </div>
  );
}