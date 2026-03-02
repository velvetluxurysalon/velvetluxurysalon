import { useState, useEffect } from "react";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import HowToBook from "../HowToBook";
import {
  getServices,
  getContactInfo,
  type Service,
  type ContactInfo,
} from "../../services/contentService";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [svc, contact] = await Promise.all([
          getServices(),
          getContactInfo(),
        ]);
        setServices(svc);
        setContactInfo(contact);
      } catch (error) {
        console.error("Error loading contact page data:", error);
      }
    };
    loadData();
  }, []);

  const defaultContact = {
    phone: "+1 (555) 123-4567",
    email: "hello@velvetsalon.com",
    address: "123 Luxury Avenue, Suite 200",
    city: "Beverly Hills, CA 90210",
    zipCode: "90210",
  };

  const displayContact = contactInfo || defaultContact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
  };

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <>
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100 bg-gradient-to-br from-white via-amber-50/20 to-white">
        <div className="max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            Get In Touch
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            <span className="text-amber-600">Contact</span> Us
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Ready to book or have questions? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* How to Book */}
      <HowToBook />

      <div className="py-12 md:py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-xl font-medium text-slate-900 mb-2">
                Send a Message
              </h2>
              <p className="text-[13px] text-slate-500 mb-6">
                Fill out the form and we'll respond within 24 hours.
              </p>

              {submitted && (
                <div className="mb-5 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm text-emerald-700 text-[13px] font-medium">
                  <CheckCircle size={18} /> Message sent successfully! We'll get
                  back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Victoria Sterling"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                      Phone
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                      Service Interest
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => update("service", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition bg-white"
                    >
                      <option value="">Select a service...</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us about your needs..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-200/60 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-gray-900 mb-4">
                Quick Contact
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Phone,
                    label: "Call Us",
                    value: displayContact.phone,
                    color: "text-violet-600 bg-violet-50",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: displayContact.email,
                    color: "text-pink-600 bg-pink-50",
                  },
                  {
                    icon: MessageCircle,
                    label: "WhatsApp",
                    value: displayContact.phone,
                    color: "text-emerald-600 bg-emerald-50",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase">
                          {item.label}
                        </p>
                        <p className="text-[13px] font-semibold text-gray-800">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-gray-900 mb-4">
                Visit Us
              </h3>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">
                    {displayContact.address}
                  </p>
                  <p className="text-[12px] text-gray-500">
                    {displayContact.city}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">
                    Check opening hours for details
                  </p>
                  <p className="text-[12px] text-gray-500">
                    See location page for full schedule
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl h-44 flex items-center justify-center border border-violet-200/40">
              <div className="text-center">
                <MapPin size={28} className="text-violet-400 mx-auto mb-2" />
                <p className="text-[12px] font-semibold text-violet-500">
                  Map Integration
                </p>
                <p className="text-[11px] text-violet-400">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
