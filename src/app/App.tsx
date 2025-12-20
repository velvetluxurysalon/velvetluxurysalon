import { useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import FeaturedServices from "./components/FeaturedServices";
import WhyChooseUs from "./components/WhyChooseUs";
import ServicesGrid from "./components/ServicesGrid";
import TeamSection from "./components/TeamSection";
import TestimonialsSection from "./components/TestimonialsSection";
import GallerySection from "./components/GallerySection";
import SpecialOffers from "./components/SpecialOffers";
import HowToBook from "./components/HowToBook";
import FAQSection from "./components/FAQSection";
import BlogSection from "./components/BlogSection";
import LocationContact from "./components/LocationContact";
import CTASection from "./components/CTASection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function App() {
  const location = useLocation();
  
  // Don't render frontend app on admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      <Navigation />
      <div id="home">
        <HeroSection />
      </div>
      <FeaturedServices />
      <WhyChooseUs />
      <div id="services">
        <ServicesGrid />
      </div>
      <div id="team">
        <TeamSection />
      </div>
      <TestimonialsSection />
      <div id="gallery">
        <GallerySection />
      </div>
      <div id="offers">
        <SpecialOffers />
      </div>
      <HowToBook />
      <FAQSection />
      <BlogSection />
      <div id="contact">
        <LocationContact />
      </div>
      <CTASection />
      <Newsletter />
      <Footer />
    </div>
  );
}