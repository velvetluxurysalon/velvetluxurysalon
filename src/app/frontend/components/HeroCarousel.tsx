import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide } from "../services/contentService";

interface HeroCarouselProps {
  slides: HeroSlide[];
  contactInfo?: {
    phone: string;
    address: string;
    city: string;
    hours?: { monday: string };
  } | null;
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [, setDirection] = useState<"next" | "prev">("next");

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || slides.length === 0) return;

    const timer = setInterval(() => {
      setDirection("next");
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [isAutoPlay, slides.length]);

  const handlePrev = () => {
    setDirection("prev");
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAutoPlay(true), 3000);
  };

  const handleNext = () => {
    setDirection("next");
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAutoPlay(true), 3000);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? "next" : "prev");
    setIsAutoPlay(false);
    setCurrentSlide(index);
    setTimeout(() => setIsAutoPlay(true), 3000);
  };

  if (slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];
  const sortedLayers = currentSlideData.layers
    ? [...currentSlideData.layers].sort((a, b) => a.order - b.order)
    : [];

  return (
    <section
      className="relative group overflow-hidden w-full flex items-end justify-center bg-[#1a1a2e]"
      style={{
        height: "calc(var(--hero-height, 100svh) - 64px)",
      }}
    >
      <style>{`
        :root {
          --hero-height: 100svh;
        }
        @media (max-width: 640px) {
          :root {
            --hero-height: 75svh;
          }
        }
      `}</style>
      {/* Multi-Layer Background */}
      <div className="absolute inset-0">
        {sortedLayers.map((layer, layerIndex) => (
          <div
            key={layer.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{
              zIndex: layerIndex,
              opacity: layer.opacity,
            }}
          >
            {layer.type === "image" && (
              <div
                style={{
                  backgroundImage: `url('${layer.content}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed",
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
            {layer.type === "video" && (
              <video
                src={layer.content}
                autoPlay
                muted
                loop
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
            {layer.type === "color" && (
              <div
                style={{
                  backgroundColor: layer.content,
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </div>
        ))}

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(26, 26, 46, 0.5) 50%, rgba(201, 162, 39, 0.05) 100%)",
            zIndex: sortedLayers.length + 1,
          }}
        />

        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 right-20 w-64 h-64 bg-[#c9a227] rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/4 left-20 w-80 h-80 bg-amber-400 rounded-full blur-3xl opacity-5"></div>
      </div>

      {/* Content - At Bottom with Simple Layout */}
      <div className="relative z-50 w-full px-4 sm:px-6 lg:px-16 pb-20 sm:pb-24 text-center">
        {/* Brand Tag */}
        <div className="inline-flex items-center gap-2 mx-auto mb-4 sm:mb-8">
          <div className="h-px w-6 bg-[#c9a227]"></div>
          <span className="text-[#c9a227] text-[10px] sm:text-xs font-black uppercase tracking-widest font-sans">
            Velvet Luxury
          </span>
          <div className="h-px w-6 bg-[#c9a227]"></div>
        </div>

        {/* Main Heading */}
        <h1
          key={currentSlideData.id}
          className={`transition-all duration-1000 ease-out font-serif font-bold tracking-tight text-white drop-shadow-lg leading-tight mb-2 sm:mb-4
            text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`}
        >
          {currentSlideData.heading || currentSlideData.title}
        </h1>

        {/* Decorative Accent */}
        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
          <div className="h-px w-8 sm:w-12 bg-[#c9a227]/60"></div>
          <div className="w-1.5 h-1.5 bg-[#c9a227] rounded-full"></div>
          <div className="h-px w-8 sm:w-12 bg-[#c9a227]/60"></div>
        </div>

        {/* Subheading */}
        <p
          key={`${currentSlideData.id}-sub`}
          className={`transition-all duration-1000 ease-out text-white/85 text-xs sm:text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8`}
        >
          {currentSlideData.subheading || currentSlideData.subtitle}
        </p>
      </div>

      {/* Slide Controls - Fixed at bottom */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-50 flex items-center justify-center gap-2 sm:gap-4">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="group relative p-2 sm:p-3 rounded-full border border-white/30 hover:border-[#c9a227] text-white hover:text-[#c9a227] transition-all duration-300 hover:bg-white/10 backdrop-blur"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-1.5 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "w-8 sm:w-12 bg-[#c9a227]"
                  : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="group relative p-2 sm:p-3 rounded-full border border-white/30 hover:border-[#c9a227] text-white hover:text-[#c9a227] transition-all duration-300 hover:bg-white/10 backdrop-blur"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
}
