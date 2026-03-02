import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Phone, Plus } from "lucide-react";
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
  const [services, setServices] = useState<Service[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

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

  const defaultHero = {
    title: "Where Luxury Meets Beauty",
    subtitle: "Experience world-class beauty and wellness treatments",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&h=800&fit=crop",
  };

  const defaultStats = {
    experience: "15+",
    happyClients: "5,000+",
    stylists: "25+",
    treatments: "50+",
  };

  const defaultQuickInfo = {
    hours: "Mon – Sun: 9 AM – 9 PM",
    location: "123 Luxury Lane, City Center",
    phone: "+1 (555) 123-4567",
  };

  const hero = heroContent || defaultHero;
  const stats = siteSettings?.stats || defaultStats;
  const quickInfoPhone = contactInfo?.phone || defaultQuickInfo.phone;
  const quickInfoLocation = contactInfo
    ? `${contactInfo.address}, ${contactInfo.city}`
    : defaultQuickInfo.location;
  const quickInfoHours = contactInfo?.hours?.monday
    ? `Mon - Sun: ${contactInfo.hours.monday}`
    : defaultQuickInfo.hours;

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6 lg:px-16 min-h-[90vh] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 26, 46, 0.85) 0%, rgba(26, 26, 46, 0.75) 50%, rgba(201, 162, 39, 0.15) 100%), url('https://images.unsplash.com/photo-1552591092-a248c67e0d0c?w=1600&h=900&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#c9a227] rounded-full blur-3xl opacity-20 animate-pulse z-0"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl opacity-10 z-0"></div>

        {/* Content */}
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Top Info Bar - Hidden on mobile */}
          <div className="hidden lg:flex items-center justify-center gap-8 mb-12 text-[9px] font-light text-white/60 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full hover:border-[#c9a227]/50 transition">
              <Clock size={14} className="text-[#c9a227]" />
              <span>{quickInfoHours}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full hover:border-[#c9a227]/50 transition">
              <MapPin size={14} className="text-[#c9a227]" />
              <span>{quickInfoLocation}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full hover:border-[#c9a227]/50 transition">
              <Phone size={14} className="text-[#c9a227]" />
              <span>{quickInfoPhone}</span>
            </div>
          </div>

          {/* Brand Tag */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#c9a227]"></div>
            <span className="text-[#c9a227] text-[10px] font-black uppercase tracking-[0.3em] font-sans">
              Velvet Luxury Salon
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#c9a227]"></div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold tracking-tight text-white mb-6 leading-[1.15] drop-shadow-lg">
            {hero.title.split(" ").map((word, i) =>
              word.toLowerCase() === "luxury" ||
              word.toLowerCase() === "beauty" ? (
                <span
                  key={i}
                  className="text-[#c9a227] italic font-serif font-light block md:inline"
                >
                  {word}{" "}
                </span>
              ) : (
                <span key={i}>{word} </span>
              ),
            )}
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 my-10">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a227]"></div>
            <div className="w-2 h-2 bg-[#c9a227] rounded-full"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a227]"></div>
          </div>

          {/* Subtitle */}
          <p className="text-white/90 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-6 font-light">
            {hero.subtitle}
          </p>

          {/* Secondary Tagline */}
          <p className="text-[#c9a227]/80 text-sm lg:text-base max-w-2xl mx-auto mb-12 font-sans font-light tracking-wide">
            Book appointments instantly • Expert artists • Luxury experiences
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/contact"
              className="group relative px-10 py-5 bg-[#c9a227] text-white text-xs font-black uppercase tracking-widest rounded-sm overflow-hidden shadow-2xl shadow-amber-900/40 hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4b247] to-[#b8941f] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2">
                Reserve Your Moment
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>

            <Link
              to="/services"
              className="group px-10 py-5 border-2 border-[#c9a227] text-[#c9a227] text-xs font-black uppercase tracking-widest rounded-sm hover:bg-[#c9a227]/10 backdrop-blur transition-all duration-300 hover:shadow-xl shadow-amber-900/20"
            >
              <span className="flex items-center gap-2">
                The Collection
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white py-12 border-b border-amber-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              {
                num: stats.experience,
                label: "Years of Artistry",
                color: "text-[#c9a227]",
              },
              {
                num: stats.happyClients,
                label: "Delighted Guests",
                color: "text-[#c9a227]",
              },
              {
                num: stats.stylists,
                label: "Master Artists",
                color: "text-[#c9a227]",
              },
              {
                num: stats.treatments,
                label: "Luxury Rituals",
                color: "text-[#c9a227]",
              },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <p
                  className={`text-4xl lg:text-5xl font-serif font-bold mb-3 ${s.color} group-hover:scale-110 transition-transform duration-500`}
                >
                  {s.num}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-sans">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES ── */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#c9a227] mb-4 font-sans">
              Curated Selection
            </p>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight">
              Premium <span className="italic font-light">Rituals</span>
            </h2>
            <div className="h-1 w-20 bg-amber-100 mx-auto mt-6"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-56 bg-slate-200 rounded-sm animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((s) => (
                <Link
                  to="/services"
                  key={s.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl border border-amber-50 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden">
                    {s.image && (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="px-3 py-1.5 bg-white/95 backdrop-blur text-[10px] font-black text-slate-900 rounded-lg shadow-sm font-sans uppercase tracking-widest">
                        From {s.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-[#c9a227] transition-colors leading-tight">
                      {s.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 font-sans font-medium mb-4">
                      {s.description}
                    </p>
                    <div className="flex items-center text-[#c9a227] text-[10px] font-black uppercase tracking-widest gap-2">
                      Experience{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/services"
              className="inline-flex items-center gap-4 px-12 py-5 border-2 border-[#c9a227] text-[#c9a227] text-[11px] font-black uppercase tracking-[0.25em] hover:bg-amber-50 transition-all rounded-sm font-sans shadow-lg shadow-amber-50"
            >
              The Full Collection <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

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
            to="/contact"
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
