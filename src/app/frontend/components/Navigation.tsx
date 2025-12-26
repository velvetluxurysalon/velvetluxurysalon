import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthPage from "./AuthPage";
import BookingForm from "./BookingForm";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { logout, isAuthenticated, showLoginModal, setShowLoginModal } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl text-purple-600">Velvet Luxury Salon</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </a>
            <a href="#services" className="text-gray-700 hover:text-purple-600 transition-colors">
              Services
            </a>
            <a href="#team" className="text-gray-700 hover:text-purple-600 transition-colors">
              Our Team
            </a>
            <a href="#gallery" className="text-gray-700 hover:text-purple-600 transition-colors">
              Gallery
            </a>
            <a href="#offers" className="text-gray-700 hover:text-purple-600 transition-colors">
              Offers
            </a>
            <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">
              Contact
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="tel:9345678646"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>9345678646</span>
            </a>
            
            {isAuthenticated ? (
              <Button 
                variant="outline"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuth(true)}
                >
                  Login
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  size="sm"
                  onClick={() => setShowAuth(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setShowBookingForm(true)}
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <a 
              href="#home" 
              className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#services" 
              className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a 
              href="#team" 
              className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Team
            </a>
            <a 
              href="#gallery" 
              className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </a>
            <a 
              href="#offers" 
              className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Offers
            </a>
            <a 
              href="#contact" 
              className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <div className="pt-4 border-t">
              <a 
                href="tel:9345678646"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors mb-3"
              >
                <Phone className="w-4 h-4" />
                <span>9345678646</span>
              </a>
              
              {isAuthenticated ? (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="w-full mb-3"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAuth(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full mb-2"
                  >
                    Login
                  </Button>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 mb-3"
                    size="sm"
                    onClick={() => {
                      setShowAuth(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
              
             
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setShowBookingForm(true);
                  setIsMenuOpen(false);
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal (Login/Signup) */}
      <AuthPage 
        open={showAuth || showLoginModal} 
        onClose={() => {
          setShowAuth(false);
          setShowLoginModal(false);
        }} 
      />

      {/* Booking Form Modal */}
      <BookingForm isOpen={showBookingForm} onClose={() => setShowBookingForm(false)} />
    </nav>
  );
}
