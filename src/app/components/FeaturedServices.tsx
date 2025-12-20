import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Star } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import { getFeaturedServices } from "../services/contentService";

interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  featured: boolean;
}

export default function FeaturedServices() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading featured services:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultServices = [
    {
      id: '1',
      name: "Premium Haircut & Styling",
      description: "Expert haircuts tailored to your face shape and style preferences",
      price: "$45 - $85",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1659036354224-48dd0a9a6b86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGluZyUyMHNhbG9ufGVufDF8fHx8MTc2NjA0MzIzOHww&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true
    },
    {
      id: '2',
      name: "Relaxing Spa Treatment",
      description: "Full body massage and aromatherapy for complete relaxation",
      price: "$120 - $180",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1696841212541-449ca29397cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBtYXNzYWdlfGVufDF8fHx8MTc2NjE2MDIxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true
    },
    {
      id: '3',
      name: "Manicure & Pedicure",
      description: "Premium nail care with gel polish options",
      price: "$35 - $60",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1659391542239-9648f307c0b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5pY3VyZSUyMG5haWxzfGVufDF8fHx8MTc2NjEzMjY5MHww&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true
    },
    {
      id: '4',
      name: "Facial Treatment",
      description: "Deep cleansing and rejuvenating facial treatments",
      price: "$80 - $150",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNpYWwlMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzY2MTM0MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

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
          autoplay: true
        }
      }
    ]
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading featured services...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Featured Services</h2>
          <p className="text-lg md:text-xl text-gray-600">Our most popular treatments</p>
        </div>

        <Slider {...settings} className="featured-services-slider">
          {displayServices.map((service) => (
            <div key={service.id} className="px-2 md:px-3">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                <div className="relative h-48 md:h-64">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white px-2 md:px-3 py-1 rounded-full flex items-center gap-1 text-sm md:text-base">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    <span>{service.rating}</span>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-purple-600 font-semibold text-sm md:text-base">{service.price}</span>
                    <Button className="text-sm md:text-base px-3 md:px-4 py-2">Book Now</Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
