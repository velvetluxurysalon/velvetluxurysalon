import { useLocation } from "react-router-dom";
import Navigation from "./frontend/components/Navigation";
import HeroSection from "./frontend/components/HeroSection";
import Services from "./frontend/components/FeaturedServices";
import WhyChooseUs from "./frontend/components/WhyChooseUs";
import TeamSection from "./frontend/components/TeamSection";
import TestimonialsSection from "./frontend/components/TestimonialsSection";
import GallerySection from "./frontend/components/GallerySection";
import SpecialOffers from "./frontend/components/SpecialOffers";
import ProductShowcase from "./frontend/components/ProductShowcase";
import HowToBook from "./frontend/components/HowToBook";
import FAQSection from "./frontend/components/FAQSection";
import BlogSection from "./frontend/components/BlogSection";
import LocationContact from "./frontend/components/LocationContact";
import CTASection from "./frontend/components/CTASection";
import Newsletter from "./frontend/components/Newsletter";
import Footer from "./frontend/components/Footer";
import BookingForm from "./frontend/components/BookingForm";
import { useState } from "react"; // Added import for useState

export default function App() {
  const location = useLocation();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedStylistId, setSelectedStylistId] = useState<string | null>(null);
  
  // Don't render frontend app on admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }
  
  // Handler to open booking form with stylist
  const handleBookStylist = (stylistId: string) => {
    setSelectedStylistId(stylistId);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      <Navigation />
      <div id="home">
        <HeroSection />
      </div>
      <div id="services">
        <Services />
      </div>
      <WhyChooseUs />
      <div id="team">
        <TeamSection onBookStylist={handleBookStylist} />
      </div>
      <TestimonialsSection />
      <div id="gallery">
        <GallerySection />
      </div>
      <div id="offers">
        <SpecialOffers />
      </div>
      <ProductShowcase />
      <HowToBook />
      <FAQSection />
      <div id="blog">
        <BlogSection />
      </div>
      <div id="contact">
        <LocationContact />
      </div>
      <CTASection />
      <Newsletter />
      <Footer />
      <BookingForm isOpen={showBookingForm} onClose={() => setShowBookingForm(false)} stylistId={selectedStylistId} />
    </div>
  );
}