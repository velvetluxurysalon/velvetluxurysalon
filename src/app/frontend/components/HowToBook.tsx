import { Search, Calendar, CircleCheck, Sparkles, ArrowRight, Play } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    number: "1",
    icon: Search,
    title: "Select Service",
    description: "Browse and choose your desired service from our extensive menu of premium treatments",
    color: "from-purple-500 to-purple-600"
  },
  {
    number: "2",
    icon: Calendar,
    title: "Pick Date & Time",
    description: "Choose your preferred appointment slot that fits your busy schedule perfectly",
    color: "from-blue-500 to-blue-600"
  },
  {
    number: "3",
    icon: CircleCheck,
    title: "Book & Relax",
    description: "Complete your booking and receive instant confirmation via email notification",
    color: "from-green-500 to-emerald-600"
  }
];

export default function HowToBook() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <Play className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Easy Booking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              How to Book
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Booking your perfect salon experience is simple and takes just a few minutes
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-1">
            <div className="h-full bg-gradient-to-r from-purple-300 via-blue-300 to-green-300 rounded-full" />
          </div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number} 
                className="relative z-10"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className={`text-center transition-all duration-500 ${hoveredStep === index ? 'transform -translate-y-2' : ''}`}>
                  {/* Icon container */}
                  <div className="relative mx-auto mb-8">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-3xl blur-xl opacity-30 transition-opacity duration-500 ${hoveredStep === index ? 'opacity-50' : ''}`} />
                    
                    <div className={`relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br ${step.color} rounded-3xl mx-auto flex items-center justify-center shadow-xl transition-all duration-500 ${hoveredStep === index ? 'scale-110 rotate-3' : ''}`}>
                      <Icon className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                    </div>
                    
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-lg flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                      <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 sm:mt-16">
          <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-semibold shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 overflow-hidden">
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            <Sparkles className="w-5 h-5 relative" />
            <span className="relative">Start Booking Now</span>
            <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}