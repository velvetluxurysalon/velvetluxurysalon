import { MapPin, Phone, Mail, Clock, Navigation, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { getContactInfo } from "../services/contentService";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

export default function LocationContact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      setLoading(true);
      const data = await getContactInfo();
      if (data) {
        setContactInfo(data);
      }
    } catch (error) {
      console.error("Error loading contact info:", error);
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
    hours: {
      monday: "8:00 AM - 9:00 PM",
      tuesday: "8:00 AM - 9:00 PM",
      wednesday: "8:00 AM - 9:00 PM",
      thursday: "8:00 AM - 9:00 PM",
      friday: "8:00 AM - 9:00 PM",
      saturday: "8:00 AM - 9:00 PM",
      sunday: "8:00 AM - 9:00 PM"
    }
  };

  const displayContact = contactInfo || defaultContact;

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,0,255,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-purple-600 animate-pulse">Loading contact information...</p>
          </div>
        </div>
      </section>
    );
  }

  const contactCards = [
    {
      icon: MapPin,
      iconBg: "from-purple-500 to-purple-600",
      title: "Our Location",
      content: (
        <>
          <p className="text-gray-600 leading-relaxed">
            {displayContact.address}<br />
            {displayContact.city}
          </p>
          <Button 
            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 group"
            size="sm"
          >
            <Navigation className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
            Get Directions
          </Button>
        </>
      )
    },
    {
      icon: Phone,
      iconBg: "from-blue-500 to-blue-600",
      title: "Call Us",
      content: (
        <>
          <a 
            href={`tel:${displayContact.phone.replace(/[^\d+]/g, '')}`}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            {displayContact.phone}
          </a>
          <p className="text-sm text-gray-500 mt-2">
            Available during business hours
          </p>
        </>
      )
    },
    {
      icon: Mail,
      iconBg: "from-pink-500 to-pink-600",
      title: "Email Us",
      content: (
        <>
          <a 
            href={`mailto:${displayContact.email}`}
            className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group"
          >
            {displayContact.email}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <p className="text-sm text-gray-500 mt-2">
            We'll respond within 24 hours
          </p>
        </>
      )
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Find Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Visit Our Salon
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to welcome you to our luxurious space for a transformative experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 sm:h-96 lg:h-full min-h-[400px] border-4 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3910.6333369150375!2d77.67398899999999!3d11.434137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDI2JzAyLjkiTiA3N8KwNDAnMjYuNCJF!5e0!3m2!1sen!2sin!4v1766737929962!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-5 sm:space-y-6">
            {contactCards.map((card, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-purple-200 relative overflow-hidden"
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-start gap-4 sm:gap-5 relative">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${card.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <card.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                    {card.content}
                  </div>
                </div>
                
                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}

            {/* Business Hours Card */}
            <div className="group bg-gradient-to-br from-slate-900 via-purple-900/90 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,0,255,0.2),transparent_50%)]" />
              
              <div className="flex items-start gap-4 sm:gap-5 relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Business Hours</h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Open Now</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 sm:gap-y-2 text-sm">
                    {displayContact.hours && Object.entries(displayContact.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center py-1.5 sm:py-1 border-b border-white/10 last:border-0">
                        <span className="text-gray-400 capitalize text-sm">{day.slice(0, 3)}</span>
                        <span className="text-white font-medium text-sm">{hours || 'Closed'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Decorative sparkle */}
              <Sparkles className="absolute top-4 right-4 w-6 h-6 text-purple-400/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
