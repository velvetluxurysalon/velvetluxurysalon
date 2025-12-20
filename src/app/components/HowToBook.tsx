import { Search, Calendar, CircleCheck } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Search,
    title: "Select Service",
    description: "Browse and choose your desired service from our extensive menu",
    color: "bg-purple-100 text-purple-600"
  },
  {
    number: "2",
    icon: Calendar,
    title: "Pick Date & Time",
    description: "Choose your preferred appointment slot that fits your schedule",
    color: "bg-blue-100 text-blue-600"
  },
  {
    number: "3",
    icon: CircleCheck,
    title: "Book & Relax",
    description: "Complete your booking and receive instant confirmation via email",
    color: "bg-green-100 text-green-600"
  }
];

export default function HowToBook() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">How to Book</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Booking your perfect salon experience is simple and takes just a few minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className={`${step.color} w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center`}>
                    <Icon className="w-12 h-12" />
                  </div>
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center transform translate-x-1/2 -translate-y-1/4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:shadow-lg transition-all transform hover:scale-105">
            Start Booking Now
          </button>
        </div>
      </div>
    </section>
  );
}