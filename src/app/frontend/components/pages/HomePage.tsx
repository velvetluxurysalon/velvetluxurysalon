import { useEffect, useState } from "react";
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
import HeroCarousel from "../HeroCarousel";
import TestimonialsSection from "../TestimonialsSection";
import WhyChooseUs from "../WhyChooseUs";
import ExploreServices from "../ExploreServices";
import SpecialOffers from "../SpecialOffers";

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
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [, setServices] = useState<Service[]>([]);
  const [, setSiteSettings] = useState<SiteSettings | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [, setFaqs] = useState<FAQ[]>([]);
  const [, setLoading] = useState(true);

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

  return (
    <>
      {/* ── HERO CAROUSEL ── */}
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

      {/* ── EXPLORE SERVICES ── */}
      <ExploreServices />

      {/* ── WHY CHOOSE US ── */}
      <WhyChooseUs />

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      <SpecialOffers id="special-offers" />
    </>
  );
}
