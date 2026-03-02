import { useEffect, useState } from "react";
import { getGalleryImages, GalleryImage } from "../../services/contentService";

import GallerySection from "../GallerySection";

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const images = await getGalleryImages();
        setGallery(images);
      } catch (error) {
        console.error("Error loading gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  return (
    <>
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100 bg-gradient-to-br from-white via-emerald-50/20 to-white">
        <div className="max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            Visual
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            <span className="text-emerald-600">Gallery</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Explore our portfolio of beautiful transformations.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 rounded-sm aspect-[4/5] animate-pulse"
                />
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500">No gallery images yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelected(img)}
                  className="group relative bg-slate-100 rounded-sm aspect-[4/5] overflow-hidden cursor-pointer"
                >
                  <img
                    src={img.image}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
                    <p className="text-white text-[13px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-white text-[28px]"
            >
              ✕
            </button>
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full rounded-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-bold">{selected.title}</p>
              {selected.description && (
                <p className="text-gray-300 text-sm mt-1">
                  {selected.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Section with Lightbox */}
      <GallerySection />
    </>
  );
}
