import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getGalleryImages } from "../services/contentService";

interface GalleryImage {
  id: string;
  image: string;
  title: string;
  description?: string;
}

export default function GallerySection() {
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
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

  if (loading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (gallery.length === 0) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Work Gallery</h2>
          <p className="text-xl text-gray-600">Gallery coming soon. Check back later!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Work Gallery</h2>
          <p className="text-xl text-gray-600">See the transformations we create</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div key={item.id} className="relative group cursor-pointer">
              <div 
                className="relative aspect-square overflow-hidden rounded-lg"
                onClick={() => setLightboxImage(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
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
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center gap-4 max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-2">{lightboxImage.title}</h3>
              {lightboxImage.description && (
                <p className="text-gray-300 text-lg">{lightboxImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
