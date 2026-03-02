import { useState, useEffect } from "react";
import { X, ZoomIn, Camera, Sparkles } from "lucide-react";
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
  const [activeFilter, setActiveFilter] = useState("all");

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
      <section className="py-24 px-4 bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#c9a227]/30 border-t-[#c9a227] rounded-full animate-spin" />
            <p className="text-[#c9a227] font-medium animate-pulse font-sans">
              Developing your experience...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (gallery.length === 0) {
    return (
      <section className="py-24 px-4 bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto text-center">
          <Camera className="w-16 h-16 text-slate-200 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 text-slate-900 tracking-tight">
            Our{" "}
            <span className="italic font-light text-[#c9a227]">Gallery</span>
          </h2>
          <p className="text-lg text-slate-500 font-sans italic">
            A collection of masterpieces is currently being curated.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 bg-[#fdfbf7] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#c9a227]/5 rounded-full blur-[100px] -translate-x-1/2" />
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-[#c9a227]/5 rounded-full blur-[100px] translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white border border-[#c9a227]/20 rounded-none mb-8">
            <Camera className="w-4 h-4 text-[#c8a227]" />
            <span className="text-[10px] font-black text-[#c9a227] uppercase tracking-[0.25em]">
              Signature Gallery
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 text-slate-900 tracking-tight">
            Artistry{" "}
            <span className="italic font-light text-[#c9a227]">Unveiled</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed">
            Witness the transformations that define our commitment to elegance
            and precision.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {gallery.map((item, index) => (
            <div
              key={item.id}
              className="group relative cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-none shadow-sm hover:shadow-2xl transition-all duration-700"
                onClick={() => setLightboxImage(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Content on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 p-8">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mb-6 transform scale-0 group-hover:scale-100 transition-transform duration-700">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-serif text-xl font-bold text-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    {item.title}
                  </p>
                  <p className="text-[#c9a227] text-[10px] font-black uppercase tracking-widest mt-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                    View Masterpiece
                  </p>
                </div>

                {/* Sophisticated border effect */}
                <div className="absolute inset-4 border border-white/0 group-hover:border-white/20 transition-all duration-700 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center gap-3 px-10 py-8 bg-[#1a1a2e] rounded-none shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#c9a227]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-8 h-8 text-[#c9a227] animate-pulse" />
            <div className="text-white relative z-10 text-left ml-4">
              <p className="text-4xl font-serif font-black flex items-center gap-2">
                2,500<span className="text-[#c9a227]">+</span>
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]/80 mt-1">
                Distinguished Guests Served
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[85vh] relative animate-scale-in">
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            {lightboxImage.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <p className="text-white text-xl font-semibold">
                  {lightboxImage.title}
                </p>
                {lightboxImage.description && (
                  <p className="text-gray-300 mt-2">
                    {lightboxImage.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </section>
  );
}
