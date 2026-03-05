import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, Plus } from "lucide-react";
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
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
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

  const defaultQuickInfo = {
    hours: "Mon – Sun: 9 AM – 9 PM",
    location: "123 Luxury Lane, City Center",
    phone: "+1 (555) 123-4567",
  };

  const quickInfoPhone = contactInfo?.phone || defaultQuickInfo.phone;
  const quickInfoLocation = contactInfo
    ? `${contactInfo.address}, ${contactInfo.city}`
    : defaultQuickInfo.location;

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
              title: "Where Luxury Meets Beauty",
              subtitle: "Experience world-class beauty and wellness treatments",
              image:
                "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&h=800&fit=crop",
              ctaButtonText: "Reserve Your Moment",
              ctaButtonLink: "/appointments",
              order: 0,
            },
          ]}
          contactInfo={contactInfo}
        />
      )}

      {/* ── WHY CHOOSE US ── */}
      <WhyChooseUs />

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24 px-6 sm:px-10 lg:px-16 bg-[#1a1a2e] border-y border-amber-900/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c9a227] rounded-full blur-[120px]"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-[#c9a227] text-[10px] font-black uppercase tracking-[0.4em] mb-6 font-sans">
            Your Transformation Awaits
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-8 leading-tight text-white italic">
            Ready to Experience{" "}
            <span className="text-[#c9a227] not-italic">Pure Luxury?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto font-sans font-medium">
            Book your exclusive appointment today and let our master artists
            define your ultimate look.
          </p>
          <Link
            to="/appointments"
            className="inline-block px-12 py-5 bg-[#c9a227] text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/20 hover:bg-[#a68523] transition-all rounded-sm font-sans"
          >
            Schedule Consultation
          </Link>
        </div>
      </section>

      {/* ── QUICK INFO ── */}
      <section className="bg-white py-16 px-6 sm:px-10 lg:px-16 border-t border-amber-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12">
          {[
            {
              icon: Clock,
              title: "Experience Hours",
              desc:
                siteSettings?.businessHours?.monday || defaultQuickInfo.hours,
              color: "text-[#c9a227]",
              bgColor: "bg-amber-50",
            },
            {
              icon: MapPin,
              title: "Our Sanctuary",
              desc: quickInfoLocation,
              color: "text-[#c9a227]",
              bgColor: "bg-amber-50",
            },
            {
              icon: Phone,
              title: "Concierge",
              desc: quickInfoPhone,
              color: "text-[#c9a227]",
              bgColor: "bg-amber-50",
            },
          ].map((info, i) => {
            const Icon = info.icon;
            return (
              <div key={i} className="flex items-start gap-6 group">
                <div
                  className={`w-14 h-14 rounded-2xl ${info.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm`}
                >
                  <Icon size={28} className={info.color} />
                </div>
                <div>
                  <p className="text-lg font-serif font-bold text-slate-900 mb-1">
                    {info.title}
                  </p>
                  <p className="text-sm text-slate-500 font-sans font-medium leading-relaxed">
                    {info.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- FAQ: Modern Minimalist --- */}
      <section className="py-24 px-6 lg:px-16 max-w-4xl mx-auto" id="faq">
        <h2 className="text-3xl font-light text-center mb-16 font-serif italic">
          Concierge Q&A
        </h2>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-6">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-slate-800 font-medium">
                  {faq.question}
                </span>
                <span className="transition group-open:rotate-45">
                  <Plus size={20} className="text-slate-400" />
                </span>
              </summary>
              <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-2xl">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <SpecialOffers id="special-offers" />
    </>
  );
}
