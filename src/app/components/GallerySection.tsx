import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getGalleryImages } from "../services/contentService";

interface GalleryImage {
  id: string;
  image?: string;
  before?: string;
  after?: string;
  service: string;
  type: string;
}

const filters = ["all", "hair", "nails", "makeup", "spa"];

export default function GallerySection() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await getGalleryImages();
      setGallery(data);
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultGallery = [
    {
      id: '1',
      before: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=400&h=400&fit=crop",
      service: "Hair Transformation",
      type: "hair"
    },
    {
      id: '2',
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop",
      service: "Nail Art",
      type: "nails"
    },
    {
      id: '3',
      image: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=400&h=400&fit=crop",
      service: "Makeup",
      type: "makeup"
    },
    {
      id: '4',
      before: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
      service: "Color Treatment",
      type: "hair"
    },
    {
      id: '5',
      image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop",
      service: "Spa Treatment",
      type: "spa"
    },
    {
      id: '6',
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=400&fit=crop",
      service: "Bridal Makeup",
      type: "makeup"
    },
    {
      id: '7',
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
      service: "Manicure",
      type: "nails"
    },
    {
      id: '8',
      image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&h=400&fit=crop",
      service: "Facial",
      type: "spa"
    }
  ];

  const displayGallery = gallery.length > 0 ? gallery : defaultGallery;
  const filteredImages = selectedFilter === "all" 
    ? displayGallery 
    : displayGallery.filter(img => img.type === selectedFilter);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Our Work Gallery</h2>
          <p className="text-xl text-gray-600">See the transformations we create</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-2 rounded-full capitalize transition-all ${
                selectedFilter === filter
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((item) => (
            <div key={item.id} className="relative group cursor-pointer">
              {item.before && item.after ? (
                // Before/After layout
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative aspect-square">
                    <img
                      src={item.before}
                      alt={`${item.service} - Before`}
                      className="w-full h-full object-cover"
                      onClick={() => setLightboxImage(item.before!)}
                    />
                    <span className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-square">
                    <img
                      src={item.after}
                      alt={`${item.service} - After`}
                      className="w-full h-full object-cover"
                      onClick={() => setLightboxImage(item.after!)}
                    />
                    <span className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">
                      After
                    </span>
                  </div>
                </div>
              ) : (
                // Single image
                <div 
                  className="relative aspect-square overflow-hidden rounded-lg"
                  onClick={() => setLightboxImage(item.image!)}
                >
                  <img
                    src={item.image}
                    alt={item.service}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-center px-4">{item.service}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center mt-12">
          <p className="text-2xl">
            <span className="text-purple-600">2,500+</span> Happy Customers and Growing!
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Gallery"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </section>
  );
}
