import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Car,
  Train,
  Phone,
  Navigation,
  Star,
  Sun,
  ExternalLink,
} from "lucide-react";
import { getContactInfo } from "../../services/contentService";
import LocationContact from "../LocationContact";

interface ContactInfoType {
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  hours?: {
    [key: string]: string;
  };
}

const defaultContact: ContactInfoType = {
  phone: "+1 (555) 123-4567",
  email: "hello@velvetsalon.com",
  address: "123 Luxury Avenue, Suite 200",
  city: "Beverly Hills, CA 90210",
  zipCode: "90210",
  hours: {
    monday: "9:00 AM – 8:00 PM",
    tuesday: "9:00 AM – 8:00 PM",
    wednesday: "9:00 AM – 8:00 PM",
    thursday: "9:00 AM – 9:00 PM",
    friday: "9:00 AM – 9:00 PM",
    saturday: "10:00 AM – 7:00 PM",
    sunday: "10:00 AM – 6:00 PM",
  },
};

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

export default function LocationPage() {
  const [contact, setContact] = useState<ContactInfoType | null>(null);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const info = await getContactInfo();
        setContact(info || defaultContact);
      } catch (error) {
        console.error("Error loading contact info:", error);
        setContact(defaultContact);
      }
    };
    loadContact();
  }, []);

  const info = contact || defaultContact;
  const hours = info.hours
    ? Object.entries(info.hours).map(([day, time]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        time,
      }))
    : [];

  return (
    <>
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100 bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            Find Us
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            <span className="text-blue-600">Location</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Visit us at our beautiful salon location in the heart of the city.
          </p>
        </div>
      </section>

      {/* Location Contact Component */}
      <LocationContact />

      <section className="py-12 md:py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-violet-100/80 to-fuchsia-100/60 rounded-2xl min-h-[280px] sm:min-h-[360px] flex items-center justify-center border border-violet-200/30">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-violet-200/50 flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} className="text-violet-500" />
              </div>
              <p className="text-[14px] font-bold text-violet-700 mb-1">
                {info.address}
              </p>
              <p className="text-[13px] text-violet-500 mb-4">{info.city}</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-700 text-[13px] font-semibold shadow hover:shadow-md transition"
              >
                <ExternalLink size={14} /> Open in Google Maps
              </a>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-violet-500" /> Address
              </h3>
              <p className="text-[14px] font-semibold text-gray-800">
                Velvet Luxury Salon
              </p>
              <p className="text-[13px] text-gray-500">{info.address}</p>
              <p className="text-[13px] text-gray-500 mb-4">{info.city}</p>
              <div className="flex gap-2">
                <a
                  href={`tel:${info.phone}`}
                  className="flex-1 py-2.5 bg-violet-50 text-violet-600 text-[12px] font-semibold rounded-xl text-center hover:bg-violet-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone size={14} /> Call
                </a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-fuchsia-50 text-fuchsia-600 text-[12px] font-semibold rounded-xl text-center hover:bg-fuchsia-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Navigation size={14} /> Navigate
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className="text-amber-300" />
                <p className="text-[13px] font-bold">4.9 / 5 Rating</p>
              </div>
              <p className="text-[12px] text-violet-100 mb-3">
                Based on 2,500+ reviews from happy clients.
              </p>
              <p className="text-[11px] text-violet-200">
                Google Maps • Yelp • Facebook
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 bg-gradient-to-br from-violet-50/60 to-fuchsia-50/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Clock size={18} className="text-violet-500" /> Opening Hours
            </h3>
            <p className="text-[12px] text-gray-400 mb-5">Walk-ins welcome</p>

            <div className="space-y-0">
              {hours.map((h, i) => {
                const isToday = h.day === today;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0 ${isToday ? "bg-violet-50/60 -mx-3 px-3 rounded-lg" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      {isToday && <Sun size={14} className="text-amber-500" />}
                      <span
                        className={`text-[13px] ${isToday ? "font-bold text-violet-700" : "text-gray-700 font-medium"}`}
                      >
                        {h.day}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold bg-violet-200 text-violet-700 px-1.5 py-0.5 rounded-md">
                          TODAY
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[13px] ${isToday ? "font-bold text-violet-600" : "text-gray-500"}`}
                    >
                      {h.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Navigation size={18} className="text-violet-500" /> Getting Here
            </h3>
            {[
              {
                icon: Car,
                title: "By Car",
                desc: "Free parking available in the underground garage.",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: Train,
                title: "By Public Transit",
                desc: "Take the Metro Purple Line to Wilshire/Rodeo station.",
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                icon: MapPin,
                title: "Landmarks",
                desc: "Located across from Rodeo Collection shopping mall.",
                color: "text-violet-600 bg-violet-50",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 shadow-sm"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
