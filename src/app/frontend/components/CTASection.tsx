import { Button } from "./ui/button";
import { Calendar, Phone } from "lucide-react";

export default function CTASection() {
  const handleBooking = () => {
    // Scroll to booking section
    const bookingSection = document.getElementById("services");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-6xl mb-6">
          Ready to Pamper Yourself?
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-purple-100">
          Experience luxury beauty services that transform and rejuvenate
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={handleBooking}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg cursor-pointer"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Your Appointment Today
          </Button>
          
          <a 
            href="tel:9345678646"
            className="inline-flex items-center justify-center px-8 py-6 text-lg border-2 border-white text-white rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Us: 93456 78646
          </a>
        </div>

        <p className="mt-8 text-purple-100">
          Walk-ins welcome • Same-day appointments available
        </p>
      </div>
    </section>
  );
}
