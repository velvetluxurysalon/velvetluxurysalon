import { Award, ShoppingBag, Calendar, DollarSign } from "lucide-react";
import { Card } from "./ui/card";

const highlights = [
  {
    icon: Award,
    title: "Expert Stylists",
    description: "Professional team with 10+ years experience",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: ShoppingBag,
    title: "Premium Products",
    description: "Only quality products used",
    color: "bg-pink-100 text-pink-600"
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book online, cancel anytime",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: DollarSign,
    title: "Best Prices",
    description: "Competitive rates in the market",
    color: "bg-green-100 text-green-600"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600">Experience the difference with our premium services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 rounded-full ${highlight.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
