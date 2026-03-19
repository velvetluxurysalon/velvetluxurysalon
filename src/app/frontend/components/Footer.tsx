import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getContactInfo,
  getSocialLinks,
  getServices,
  getSiteSettings,
} from "../services/contentService";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  hours?: any;
}

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

interface Service {
  id: string;
  name: string;
  category?: string;
  price?: string;
  image?: string;
  rating?: number;
  duration?: number;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [, setPaymentMethods] = useState<string[]>([]);
  const [newsletterContent, setNewsletterContent] = useState<any>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      setLoading(true);
      const [contact, socials, svc, settings, newsletter] = await Promise.all([
        getContactInfo(),
        getSocialLinks(),
        getServices(),
        getSiteSettings(),
        (async () => {
          try {
            // @ts-ignore
            const { getNewsletterContent } =
              await import("../services/contentService");
            return await getNewsletterContent();
          } catch {
            return null;
          }
        })(),
      ]);

      if (contact) setContactInfo(contact);
      if (socials && socials.length > 0) setSocialLinks(socials);
      if (svc && svc.length > 0) setServices(svc.slice(0, 6));
      if (settings?.paymentMethods) setPaymentMethods(settings.paymentMethods);
      if (newsletter) setNewsletterContent(newsletter);
    } catch (error) {
      console.error("Error loading footer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultContact: ContactInfo = {
    phone: "9345678646",
    email: "Velvetluxurysalon@gmail.com",
    address: "Opposite to ICICI bank, Bharathi Nagar",
    city: "Kalingarayanpalayam, Bhavani, Erode Dt, Tamil Nadu - 638301",
    zipCode: "638301",
  };

  const defaultSocialLinks = [
    {
      id: "1",
      platform: "facebook",
      label: "Facebook",
      url: "https://facebook.com",
    },
    {
      id: "2",
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com",
    },
    {
      id: "3",
      platform: "twitter",
      label: "Twitter",
      url: "https://twitter.com",
    },
    {
      id: "4",
      platform: "youtube",
      label: "YouTube",
      url: "https://youtube.com",
    },
  ];

  const displayContact = contactInfo || defaultContact;
  const displaySocialLinks =
    socialLinks.length > 0 ? socialLinks : defaultSocialLinks;
  const displayServices = services.length > 0 ? services : [];

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Our Services", href: "#services" },
    { label: "Book Appointment", href: "#services" },
    { label: "Promotions", href: "#offers" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative bg-white border-t border-slate-100 text-slate-900 overflow-hidden">
      {/* Newsletter / Join Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <div className="relative bg-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full -mr-32 -mt-32 opacity-50" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                {newsletterContent?.heading || "Stay Beautiful, Stay Informed"}
              </h2>
              <p className="text-slate-400">
                {newsletterContent?.subtitle ||
                  "Get exclusive offers and beauty tips delivered to your inbox"}
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-4">
              <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
                <input
                  type="email"
                  placeholder={
                    newsletterContent?.inputPlaceholder || "Enter your email"
                  }
                  className="bg-transparent border-none focus:ring-0 text-white px-4 py-2 w-full md:w-64"
                />
                <button className="bg-white text-slate-900 px-6 py-2 rounded-xl font-medium hover:bg-slate-100 transition-colors whitespace-nowrap">
                  {newsletterContent?.buttonText || "Subscribe"}
                </button>
              </div>
              <div className="flex gap-8 justify-center md:justify-start">
                <div>
                  <p className="text-white text-xl font-bold">
                    {newsletterContent?.stats?.subscribers || "10K+"}
                  </p>
                  <p className="text-slate-500 text-xs uppercase tracking-wider">
                    {newsletterContent?.stats?.subscribersLabel ||
                      "Subscribers"}
                  </p>
                </div>
                <div>
                  <p className="text-white text-xl font-bold">
                    {newsletterContent?.stats?.discount || "20%"}
                  </p>
                  <p className="text-slate-400 text-xs uppercase tracking-wider">
                    {newsletterContent?.stats?.discountLabel ||
                      "Exclusive Discount"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/logo.png"
                alt="Velvet Luxury"
                className="h-10 w-auto object-contain"
              />
              <h3 className="text-slate-900 text-xl font-serif font-light">
                Velvet Luxury
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Your premier destination for luxury beauty and wellness services.
              Transforming beauty, one client at a time.
            </p>
            <div className="flex gap-3">
              {displaySocialLinks.map((social) => {
                const getSocialIcon = (platform: string) => {
                  switch (platform.toLowerCase()) {
                    case "facebook":
                      return <Facebook className="w-5 h-5" />;
                    case "instagram":
                      return <Instagram className="w-5 h-5" />;
                    case "twitter":
                      return <Twitter className="w-5 h-5" />;
                    case "youtube":
                      return <Youtube className="w-5 h-5" />;
                    default:
                      return null;
                  }
                };

                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-purple-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-2 group transition-colors"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500/50 rounded-full group-hover:bg-purple-500 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Popular Services
            </h4>
            <ul className="space-y-3">
              {displayServices.length > 0 ? (
                displayServices.map((service) => (
                  <li key={service.id}>
                    <a
                      href={`#service-${service.id}`}
                      className="text-sm text-gray-400 hover:text-white flex items-center gap-2 group transition-colors"
                    >
                      <span className="w-1.5 h-1.5 bg-pink-500/50 rounded-full group-hover:bg-pink-500 transition-colors" />
                      {service.name}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">Loading services...</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm text-gray-400 leading-relaxed">
                  {displayContact.address}
                  <br />
                  {displayContact.city}
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <a
                  href={`tel:${displayContact.phone}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {displayContact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <a
                  href={`mailto:${displayContact.email}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors break-all"
                >
                  {displayContact.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <p className="text-sm font-medium text-slate-900">
                  Business Hours
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Mon-Sun: {contactInfo?.hours?.monday || "8:00 AM - 9:00 PM"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 flex items-center gap-1">
            &copy; 2026 Velvet Luxury Salon
          </p>
          <p className="text-sm text-gray-400">
            Crafted By{" "}
            <a
              href="https://legendaryone.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors"
            >
              Legendary One
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Home", "Contact", "Team"].map((link, index) => (
              <a
                key={index}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-white transition-colors relative group"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
