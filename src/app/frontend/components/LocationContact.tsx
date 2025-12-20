import { MapPin, Phone, Mail, Clock } from "lucide-react";
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
    phone: "+1 (234) 567-8900",
    email: "info@luxesalon.com",
    address: "123 Beauty Avenue, Suite 456",
    city: "New York, NY 10001",
    zipCode: "10001",
    hours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "10:00 AM - 5:00 PM"
    }
  };

  const displayContact = contactInfo || defaultContact;

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading contact information...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Visit Us</h2>
          <p className="text-xl text-gray-600">We'd love to see you at our salon</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-lg h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648718453!2d-73.98823492346679!3d40.75889497138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1702584000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Salon Location"
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Address</h3>
                  <p className="text-gray-600">
                    {displayContact.address}<br />
                    {displayContact.city}
                  </p>
                  <Button className="mt-3" variant="outline" size="sm">
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Phone</h3>
                  <a 
                    href={`tel:${displayContact.phone.replace(/[^\d+]/g, '')}`}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {displayContact.phone}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Available during business hours
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Email</h3>
                  <a 
                    href={`mailto:${displayContact.email}`}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {displayContact.email}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-3">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    {displayContact.hours && Object.entries(displayContact.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{day}:</span>
                        <span>{hours || 'Closed'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
