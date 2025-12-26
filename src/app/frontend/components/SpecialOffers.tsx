import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Tag, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { getSpecialOffers } from "../services/contentService";

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: string;
  image: string;
  validTo: string;
  active: boolean;
}

export default function SpecialOffers() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await getSpecialOffers();
      const activeOffers = data.filter(offer => offer.active).slice(0, 4);
      setOffers(activeOffers);
    } catch (error) {
      console.error("Error loading offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // Scroll to services or booking
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const defaultOffers = [
    {
      id: '1',
      title: "New Client Special",
      description: "First visit discount on all services",
      discount: 20,
      discountType: "percentage",
      image: "https://images.unsplash.com/photo-1521897578313-2ffb6ba1bf9c?w=400&h=300&fit=crop",
      validTo: "Dec 31, 2025",
      active: true
    },
    {
      id: '2',
      title: "Spa Package Deal",
      description: "Book 3 spa treatments and save",
      discount: 30,
      discountType: "percentage",
      image: "https://images.unsplash.com/photo-1544161515-81aae3011afa?w=400&h=300&fit=crop",
      validTo: "Jan 15, 2026",
      active: true
    },
    {
      id: '3',
      title: "Bridal Package",
      description: "Complete bridal beauty package",
      discount: 25,
      discountType: "percentage",
      image: "https://images.unsplash.com/photo-1596215898149-2e96b2c41470?w=400&h=300&fit=crop",
      validTo: "Dec 31, 2025",
      active: true
    },
    {
      id: '4',
      title: "Referral Bonus",
      description: "Refer a friend and both save",
      discount: 25,
      discountType: "fixed",
      image: "https://images.unsplash.com/photo-1498038432885-adb8e8ee7898?w=400&h=300&fit=crop",
      validTo: "Ongoing",
      active: true
    }
  ];

  const displayOffers = offers.length > 0 ? offers : defaultOffers;

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading special offers...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <Tag className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-600">Limited Time Offers</span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-4">Special Promotions</h2>
          <p className="text-xl text-gray-600">Exclusive deals for our valued clients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayOffers.map((offer) => (
            <Card 
              key={offer.id} 
              className="overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white p-6">
                <div className="text-center">
                  <p className="text-4xl mb-2">
                    {offer.discount}{offer.discountType === 'percentage' ? '%' : '₹'}
                  </p>
                  <p className="text-sm opacity-90">{offer.title}</p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">{offer.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Valid until: {offer.validTo}</span>
                </div>

                <Button 
                  onClick={handleBookNow}
                  className="w-full cursor-pointer"
                >
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
