import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Scissors, Sparkles, Droplet, PaintBucket, Heart, User, Loader } from "lucide-react";
import { getServices } from "../services/firebaseService";

// Icon mapping for service categories
const iconMap: Record<string, any> = {
  "Hair": Scissors,
  "Spa": Sparkles,
  "Nails": Droplet,
  "Facial": Heart,
  "Makeup": PaintBucket,
  "Men": User,
  "Other": Sparkles
};

const defaultImage = "https://images.unsplash.com/photo-1596728985503-d3f27eb8c74d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMHNlcnZpY2V8ZW58MXx8fHwxNzY2MDQzMjM4fDA&ixlib=rb-4.1.0&q=80&w=1080";

export default function ServicesGrid() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Group services by category
  const categories = services.reduce((acc: any, service: any) => {
    const category = service.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  const categoryList = Object.entries(categories).map(([name, items]: any) => {
    const firstWord = name.split(" ")[0];
    const IconComponent = iconMap[firstWord] || Sparkles;
    return {
      name,
      count: items.length,
      icon: IconComponent,
      image: items[0]?.image || defaultImage,
      services: items.slice(0, 4).map((s: any) => s.serviceName || s.name),
      items: items
    };
  });

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <Loader className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Comprehensive beauty and wellness solutions</p>
        </div>

        {categoryList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No services available at the moment. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryList.map((category: any) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.name} 
                  className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => (e.currentTarget.src = defaultImage)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-6 h-6" />
                        <h3 className="text-2xl">{category.name}</h3>
                      </div>
                      <p className="text-sm text-gray-200">{category.count} Services</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm text-gray-600 mb-2">Popular services:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.services.map((service: string, idx: number) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">View All Services</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
