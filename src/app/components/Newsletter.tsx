import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to an API
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl mb-4">
            Stay Beautiful, Stay Informed
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get exclusive offers and beauty tips delivered to your inbox
          </p>

          {subscribed ? (
            <div className="bg-green-100 text-green-700 py-4 px-6 rounded-lg inline-flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Thank you for subscribing! Check your email for a special welcome offer.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" size="lg" className="bg-purple-600 hover:bg-purple-700">
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
            <div>
              <p className="text-2xl text-purple-600 mb-1">10K+</p>
              <p className="text-sm text-gray-600">Subscribers</p>
            </div>
            <div>
              <p className="text-2xl text-purple-600 mb-1">20%</p>
              <p className="text-sm text-gray-600">Exclusive Discount</p>
            </div>
            <div>
              <p className="text-2xl text-purple-600 mb-1">Weekly</p>
              <p className="text-sm text-gray-600">Beauty Tips</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
