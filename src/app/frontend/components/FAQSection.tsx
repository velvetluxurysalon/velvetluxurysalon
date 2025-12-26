import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useState, useEffect } from "react";
import { getFAQs, getFAQMetadata } from "../services/contentService";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQMetadata {
  title: string;
  description: string;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [metadata, setMetadata] = useState<FAQMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const [faqsData, metadataData] = await Promise.all([
        getFAQs(),
        getFAQMetadata()
      ]);
      setFaqs(faqsData);
      setMetadata(metadataData);
    } catch (error) {
      console.error("Error loading FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultFaqs = [
    {
      id: '1',
      question: "How do I book an appointment?",
      answer: "You can book an appointment directly through our website by clicking the 'Book an Appointment' button. Select your desired service, choose a date and time, and complete the booking form. You'll receive an instant confirmation via email.",
      category: "Booking"
    },
    {
      id: '2',
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time without any charges. Please contact us or use your booking confirmation link to make changes.",
      category: "Booking"
    },
    {
      id: '3',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, cash, and digital payment methods like Apple Pay and Google Pay. Payment is typically made after your service.",
      category: "Payment"
    },
    {
      id: '4',
      question: "Do you offer packages or memberships?",
      answer: "Yes! We offer various packages including spa packages, bridal packages, and monthly membership plans that provide significant savings. Check our Special Offers section for current promotions and package deals.",
      category: "Services"
    },
    {
      id: '5',
      question: "What's your cancellation policy?",
      answer: "We require 24 hours notice for cancellations. Cancellations made within 24 hours of the appointment may be subject to a 50% cancellation fee. No-shows will be charged the full service amount.",
      category: "Booking"
    },
    {
      id: '6',
      question: "Are your products cruelty-free?",
      answer: "Yes, we prioritize using high-quality, cruelty-free, and environmentally friendly products. We're happy to discuss product ingredients and alternatives if you have specific concerns or allergies.",
      category: "Products"
    },
    {
      id: '7',
      question: "Do I need to bring anything to my appointment?",
      answer: "Just bring yourself! We provide everything you need including robes, towels, and all necessary products. For spa treatments, we recommend arriving 10 minutes early to relax and fill out any necessary forms.",
      category: "Services"
    },
    {
      id: '8',
      question: "Can I request a specific stylist or therapist?",
      answer: "Absolutely! When booking, you can select your preferred team member. If they're not available at your desired time, we'll suggest alternative times or recommend another specialist with similar expertise.",
      category: "Services"
    }
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-purple-600">Loading FAQs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">{metadata?.title || 'Frequently Asked Questions'}</h2>
          <p className="text-xl text-gray-600">{metadata?.description || 'Everything you need to know about our services'}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {displayFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-lg px-6 border"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <span>{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center p-8 bg-purple-50 rounded-xl">
          <h3 className="text-2xl mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Our friendly team is here to help! Give us a call or send us an email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:9345678646" 
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Call Us: 93456 78646
            </a>
            <a 
              href="mailto:Velvetluxurysalon@gmail.com" 
              className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
