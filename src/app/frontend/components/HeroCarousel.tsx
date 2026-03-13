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
        height: "clamp(300px, 100svh - 64px, 100svh)",
        minHeight: "300px",
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          section {
            height: clamp(300px, 75svh - 64px, 75svh) !important;
          }
          .hero-bg-image {
            background-attachment: scroll !important;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          section {
            height: clamp(400px, 90svh - 64px, 90svh) !important;
          }
        }
        @media (min-width: 1025px) {
          section {
            height: clamp(500px, 100svh - 64px, 100svh) !important;
          }
          .hero-bg-image {
            background-attachment: fixed;
          }
        }
      `}</style>
      {/* Multi-Layer Background */}
      <div className="absolute inset-0 w-full h-full">
        {sortedLayers.map((layer, layerIndex) => (
          <div
            key={layer.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out w-full h-full ${
              currentSlide === 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{
              zIndex: layerIndex,
              opacity: layer.opacity,
            }}
          >
            {layer.type === "image" && (
              <div
                className="hero-bg-image w-full h-full"
                style={{
                  backgroundImage: `url('${layer.content}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
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
                className="w-full h-full object-cover"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
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
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(26, 26, 46, 0.5) 50%, rgba(201, 162, 39, 0.05) 100%)",
            zIndex: sortedLayers.length + 1,
          }}
        />

        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 right-4 sm:right-20 w-40 sm:w-64 h-40 sm:h-64 bg-[#c9a227] rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/4 left-4 sm:left-20 w-48 sm:w-80 h-48 sm:h-80 bg-amber-400 rounded-full blur-3xl opacity-5"></div>
      </div>

      {/* Content - At Bottom with Simple Layout */}
      <div className="relative z-50 w-full px-3 sm:px-6 lg:px-16 pb-12 sm:pb-20 lg:pb-24 text-center max-w-full">
        {/* Main Heading */}
        <h1
          key={currentSlideData.id}
          className={`transition-all duration-1000 ease-out font-serif font-bold tracking-tight text-white drop-shadow-lg leading-tight mb-2 sm:mb-3 lg:mb-4 w-full
            text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl break-words`}
        >
          {currentSlideData.heading || currentSlideData.title}
        </h1>

        {/* Decorative Accent */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
          <div className="h-px w-6 sm:w-8 lg:w-12 bg-[#c9a227]/60"></div>
          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-[#c9a227] rounded-full flex-shrink-0"></div>
          <div className="h-px w-6 sm:w-8 lg:w-12 bg-[#c9a227]/60"></div>
        </div>

        {/* Subheading */}
        <p
          key={`${currentSlideData.id}-sub`}
          className={`transition-all duration-1000 ease-out text-white/85 text-xs sm:text-sm md:text-base lg:text-lg font-light max-w-xs sm:max-w-xl lg:max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 lg:mb-8 line-clamp-3 sm:line-clamp-4 md:line-clamp-none`}
        >
          {currentSlideData.subheading || currentSlideData.subtitle}
        </p>
      </div>

      {/* Slide Controls - Fixed at bottom */}
      <div className="absolute bottom-2 sm:bottom-4 lg:bottom-8 left-0 right-0 z-50 flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-4 px-2">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="group relative p-1.5 sm:p-2 lg:p-3 rounded-full border border-white/30 hover:border-[#c9a227] text-white hover:text-[#c9a227] transition-all duration-300 hover:bg-white/10 backdrop-blur flex-shrink-0"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-1 sm:gap-1.5 lg:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 sm:h-1.5 lg:h-2 rounded-full transition-all duration-500 flex-shrink-0 ${
                index === currentSlide
                  ? "w-6 sm:w-8 lg:w-12 bg-[#c9a227]"
                  : "w-1 sm:w-1.5 lg:w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="group relative p-1.5 sm:p-2 lg:p-3 rounded-full border border-white/30 hover:border-[#c9a227] text-white hover:text-[#c9a227] transition-all duration-300 hover:bg-white/10 backdrop-blur flex-shrink-0"
          aria-label="Next slide"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
        </button>
      </div>
    </section>
  );
}
