import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Star } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import { getFeaturedServices } from "../services/contentService";
import BookingForm from "./BookingForm";

interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
}

export default function Services() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (services.length === 0 && !loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-lg">No services available. Please check back soon.</p>
        </div>
      </section>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          arrows: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
          autoplay: true,
          swipeToSlide: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          autoplay: true,
          swipeToSlide: true,
          dots: true
        }
      }
    ]
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">Our Services</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">Premium beauty and wellness treatments</p>
          </div>

          <div className="pb-8 sm:pb-10">
            <Slider {...settings} className="services-slider">
              {services.map((service) => (
                <div key={service.id} className="px-1 sm:px-2 md:px-3">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col mx-1">
                  <div className="relative h-40 sm:h-44 md:h-48 lg:h-64 bg-gray-200 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs sm:text-sm font-medium">{service.rating}</span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex-grow flex flex-col">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-1 sm:mb-2 line-clamp-1">{service.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 flex-grow">{service.description}</p>
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      <span className="text-purple-600 font-bold text-sm sm:text-base">₹{service.price}</span>
                      <Button size="sm" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2" onClick={() => setIsBookingOpen(true)}>Book Now</Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
            </Slider>
          </div>
        </div>
      </section>
      <BookingForm isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
