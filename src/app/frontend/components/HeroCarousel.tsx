import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    // Resume auto-play after user interaction
    setTimeout(() => setIsAutoPlay(true), 3000);
  };

  const handleNext = () => {
    setDirection("next");
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    // Resume auto-play after user interaction
    setTimeout(() => setIsAutoPlay(true), 3000);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? "next" : "prev");
    setIsAutoPlay(false);
    setCurrentSlide(index);
    // Resume auto-play after user interaction
    setTimeout(() => setIsAutoPlay(true), 3000);
  };

  if (slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative group overflow-hidden h-screen flex items-center justify-center bg-[#1a1a2e]">
      {/* Background Image with Overlay */}
      <>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(26, 26, 46, 0.7) 50%, rgba(201, 162, 39, 0.05) 100%), url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
        ))}

        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 right-20 w-64 h-64 bg-[#c9a227] rounded-full blur-3xl opacity-10 z-0"></div>
        <div className="absolute bottom-1/4 left-20 w-80 h-80 bg-amber-400 rounded-full blur-3xl opacity-5 z-0"></div>
      </>

      {/* Content - Clean & Simple */}
      <div className="max-w-4xl mx-auto relative z-10 text-center px-4 sm:px-6 lg:px-16 space-y-6">
        {/* Brand Tag */}
        <div className="inline-flex items-center gap-2 mx-auto">
          <div className="h-px w-6 bg-[#c9a227]"></div>
          <span className="text-[#c9a227] text-xs font-black uppercase tracking-widest font-sans">
            Velvet Luxury
          </span>
          <div className="h-px w-6 bg-[#c9a227]"></div>
        </div>

        {/* Main Headline - Clean */}
        <div className="space-y-4">
          <h1
            key={currentSlideData.id}
            className={`transition-all duration-1000 ease-out font-serif font-bold tracking-tight text-white drop-shadow-lg leading-tight
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
              ${currentSlide === slides.indexOf(currentSlideData) ? "opacity-100" : "opacity-0"}`}
          >
            {currentSlideData.title.split(" ").map((word, i) => {
              const lowerWord = word.toLowerCase();
              if (
                lowerWord === "luxury" ||
                lowerWord === "beauty" ||
                lowerWord === "wellness" ||
                lowerWord === "elegance"
              ) {
                return (
                  <span key={i} className="text-[#c9a227] italic font-light">
                    {word}{" "}
                  </span>
                );
              }
              return <span key={i}>{word} </span>;
            })}
          </h1>
        </div>

        {/* Decorative Accent */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-[#c9a227]/60"></div>
          <div className="w-1.5 h-1.5 bg-[#c9a227] rounded-full"></div>
          <div className="h-px w-12 bg-[#c9a227]/60"></div>
        </div>

        {/* Subtitle - Clean */}
        <p
          key={`${currentSlideData.id}-sub`}
          className={`transition-all duration-1000 ease-out text-white/85 text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed
            ${currentSlide === slides.indexOf(currentSlideData) ? "opacity-100" : "opacity-0"}`}
        >
          {currentSlideData.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link
            to={currentSlideData.ctaButtonLink || "/appointments"}
            className="group relative px-10 py-5 bg-[#c9a227] text-white text-xs font-black uppercase tracking-widest rounded-sm overflow-hidden shadow-2xl shadow-amber-900/40 hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4b247] to-[#b8941f] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              {currentSlideData.ctaButtonText || "Reserve Your Moment"}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>

          <Link
            to="/services"
            className="group px-10 py-5 border-2 border-[#c9a227] text-[#c9a227] text-xs font-black uppercase tracking-widest rounded-sm hover:bg-[#c9a227]/10 backdrop-blur transition-all duration-300 hover:shadow-xl shadow-amber-900/20"
          >
            <span className="flex items-center gap-2">
              The Collection
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>
        </div>

        {/* Slide Indicators and Navigation */}
        <div className="flex items-center justify-center gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="group relative z-20 p-3 rounded-full border-2 border-white/30 hover:border-[#c9a227] text-white hover:text-[#c9a227] transition-all duration-300 hover:bg-white/10 backdrop-blur"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? "w-12 bg-[#c9a227]"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="group relative z-20 p-3 rounded-full border-2 border-white/30 hover:border-[#c9a227] text-white hover:text-[#c9a227] transition-all duration-300 hover:bg-white/10 backdrop-blur"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Slide Counter */}
        <div className="mt-8 text-white/60 text-sm font-sans font-light tracking-wider">
          <span className="text-[#c9a227] font-semibold">
            {currentSlide + 1}
          </span>
          {" / "}
          <span>{slides.length}</span>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="hidden" aria-hidden="true">
        {/* This div is just for accessibility - allows keyboard nav */}
      </div>
    </section>
  );
}
