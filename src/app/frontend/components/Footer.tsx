import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white text-xl mb-4">Velvet Luxury Salon</h3>
            <p className="text-sm mb-4">
              Your premier destination for luxury beauty and wellness services. 
              Transforming beauty, one client at a time.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Our Services</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Book Appointment</a></li>
              <li><a href="#offers" className="hover:text-purple-400 transition-colors">Promotions</a></li>
              <li><a href="#blog" className="hover:text-purple-400 transition-colors">Blog</a></li>
              <li><a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white mb-4">Popular Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Hair Styling</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Hair Coloring</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Spa Treatments</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Nail Services</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Facial Treatments</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Makeup Services</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Opposite to ICICI bank, Bharathi Nagar<br />Kalingarayanpalayam, Bhavani<br />Erode Dt, Tamil Nadu - 638301</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:9345678646" className="hover:text-purple-400 transition-colors">
                  9345678646
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:Velvetluxurysalon@gmail.com" className="hover:text-purple-400 transition-colors">
                  Velvetluxurysalon@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-sm mb-2">Business Hours:</p>
              <p className="text-xs text-gray-400">Mon-Sun: 8:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-sm text-center mb-3">We Accept:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-gray-800 rounded text-sm">Visa</div>
            <div className="px-4 py-2 bg-gray-800 rounded text-sm">Mastercard</div>
            <div className="px-4 py-2 bg-gray-800 rounded text-sm">American Express</div>
            <div className="px-4 py-2 bg-gray-800 rounded text-sm">Apple Pay</div>
            <div className="px-4 py-2 bg-gray-800 rounded text-sm">Google Pay</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; 2025 Velvet Luxury Salon. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#home" className="hover:text-purple-400 transition-colors">Home</a>
            <a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a>
            <a href="#team" className="hover:text-purple-400 transition-colors">Team</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
