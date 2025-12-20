import { useLocation, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import FeaturedServices from "./components/FeaturedServices";
import WhyChooseUs from "./components/WhyChooseUs";
import ServicesGrid from "./components/ServicesGrid";
import TeamSection from "./components/TeamSection";
import TestimonialsSection from "./components/TestimonialsSection";
import GallerySection from "./components/GallerySection";
import SpecialOffers from "./components/SpecialOffers";
import HowToBook from "./components/HowToBook";
import FAQSection from "./components/FAQSection";
import BlogSection from "./components/BlogSection";
import LocationContact from "./components/LocationContact";
import CTASection from "./components/CTASection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

// Admin imports
import "../admin/src/admin-panel.css";
import Login from "../admin/src/pages/Login";
import Dashboard from "../admin/src/pages/Dashboard";
import Reception from "../admin/src/pages/Reception";
import Services from "../admin/src/pages/Services";
import Customers from "../admin/src/pages/Customers";
import Billing from "../admin/src/pages/Billing";
import VisitDetail from "../admin/src/pages/VisitDetail";
import Staff from "../admin/src/pages/Staff";
import Products from "../admin/src/pages/Products";
import Loyalty from "../admin/src/pages/Loyalty";
import Attendance from "../admin/src/pages/Attendance";
import Appointments from "../admin/src/pages/Appointments";
import HeroContent from "../admin/src/pages/HeroContent";
import ContactContent from "../admin/src/pages/ContactContent";
import TeamContent from "../admin/src/pages/TeamContent";
import GalleryContent from "../admin/src/pages/GalleryContent";
import TestimonialsContent from "../admin/src/pages/TestimonialsContent";
import FAQsContent from "../admin/src/pages/FAQsContent";
import BlogContent from "../admin/src/pages/BlogContent";
import OffersContent from "../admin/src/pages/OffersContent";
import { Scissors, LogOut, Users, ClipboardList, BarChart3, Package, UserCog, Menu, X, Calendar, Gift, Star, Clock, FileText, Phone } from "lucide-react";

// Protected Route Wrapper
const ProtectedRoute = ({ children, user, loading }) => {
  if (loading) return (
    <div className="admin-panel loading-overlay">
      <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
    </div>
  );
  return user ? children : <Navigate to="/admin/login" />;
};

const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    { path: "/admin/services", icon: Scissors, label: "Services" },
    { path: "/admin", icon: ClipboardList, label: "Reception" },
    { path: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/admin/products", icon: Package, label: "Inventory" },
    { path: "/admin/staff", icon: UserCog, label: "Staff" },
    { path: "/admin/customers", icon: Users, label: "Customers" },
    { path: "/admin/appointments", icon: Calendar, label: "Appointments" },
    { path: "/admin/loyalty", icon: Gift, label: "Loyalty" },
    { path: "/admin/attendance", icon: Clock, label: "Attendance" },
    { path: "/admin/hero", icon: FileText, label: "Hero Section" },
    { path: "/admin/team", icon: Users, label: "Team Members" },
    { path: "/admin/gallery", icon: FileText, label: "Gallery" },
    { path: "/admin/testimonials", icon: Star, label: "Testimonials" },
    { path: "/admin/faqs", icon: FileText, label: "FAQs" },
    { path: "/admin/blog", icon: FileText, label: "Blog Posts" },
    { path: "/admin/offers", icon: Gift, label: "Special Offers" },
    { path: "/admin/contact", icon: Phone, label: "Contact Info" },
  ];

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="flex items-center gap-3">
          <div className="sidebar-logo">S</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>Velvet Luxury Salon</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Premium Beauty</div>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mobile-menu-btn"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">S</div>
          <div>
            <div className="sidebar-title">Velvet Luxury Salon</div>
            <div className="sidebar-subtitle">Premium Beauty</div>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem", padding: "0.75rem", background: "var(--muted)", borderRadius: "var(--radius-sm)" }}>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>Kalingarayanpalayam, Bhavani</p>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>Erode District, Tamil Nadu - 638301</p>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)" }}>📞 9667722611</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main Menu</div>
            {navItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => item.submenu && setExpandedMenu(expandedMenu === item.path ? null : item.path)}
                >
                  <item.icon size={20} className="nav-icon" />
                  <span>{item.label}</span>
                  {item.submenu && (
                    <span style={{ marginLeft: "auto", fontSize: "0.75rem" }}>
                      {expandedMenu === item.path ? "▼" : "▶"}
                    </span>
                  )}
                </Link>
                {item.submenu && expandedMenu === item.path && (
                  <div className="submenu">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        className="submenu-link"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{
              color: "var(--danger)",
              border: "none",
              background: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <LogOut size={20} className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Reception />} />
          <Route path="/visits/:id" element={<VisitDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/hero" element={<HeroContent />} />
          <Route path="/contact" element={<ContactContent />} />
          <Route path="/team" element={<TeamContent />} />
          <Route path="/gallery" element={<GalleryContent />} />
          <Route path="/testimonials" element={<TestimonialsContent />} />
          <Route path="/faqs" element={<FAQsContent />} />
          <Route path="/blog" element={<BlogContent />} />
          <Route path="/offers" element={<OffersContent />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

// Frontend App Component
function FrontendApp() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      <Navigation />
      <div id="home">
        <HeroSection />
      </div>
      <FeaturedServices />
      <WhyChooseUs />
      <div id="services">
        <ServicesGrid />
      </div>
      <div id="team">
        <TeamSection />
      </div>
      <TestimonialsSection />
      <div id="gallery">
        <GallerySection />
      </div>
      <div id="offers">
        <SpecialOffers />
      </div>
      <HowToBook />
      <FAQSection />
      <BlogSection />
      <div id="contact">
        <LocationContact />
      </div>
      <CTASection />
      <Newsletter />
      <Footer />
    </div>
  );
}

// Main App Component with Routing
export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Only listen for auth if on admin routes
    if (isAdminRoute) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [isAdminRoute]);

  if (isAdminRoute) {
    if (location.pathname === "/admin/login") {
      return <Login />;
    }

    if (loading) {
      return (
        <div className="admin-panel loading-overlay">
          <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
        </div>
      );
    }

    return (
      <div className="admin-panel">
        <ProtectedRoute user={user} loading={loading}>
          <DashboardLayout />
        </ProtectedRoute>
      </div>
    );
  }

  return <FrontendApp />;
}