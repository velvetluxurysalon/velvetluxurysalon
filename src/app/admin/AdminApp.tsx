import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './admin-panel.css';
import { auth } from '../../firebaseConfig';
// @ts-ignore
import Login from './pages/Login';
// @ts-ignore
import Dashboard from './pages/Dashboard';
// @ts-ignore
import Reception from './pages/Reception';
// @ts-ignore
import Services from './pages/Services';
// @ts-ignore
import Customers from './pages/Customers';
// @ts-ignore
import Billing from './pages/Billing';
// @ts-ignore
import VisitDetail from './pages/VisitDetail';
// @ts-ignore
import Staff from './pages/Staff';
// @ts-ignore
import Products from './pages/Products';
// @ts-ignore
import Loyalty from './pages/Loyalty';
// @ts-ignore
import Attendance from './pages/Attendance';
// @ts-ignore
import Appointments from './pages/Appointments';
// @ts-ignore
import HeroContent from './pages/HeroContent';
// @ts-ignore
import ContactContent from './pages/ContactContent';
// @ts-ignore
import GalleryContent from './pages/GalleryContent';
// @ts-ignore
import ReviewsManagement from './pages/ReviewsManagement';
// @ts-ignore
import FAQsContent from './pages/FAQsContent';
// @ts-ignore
import OffersContent from './pages/OffersContent';
// @ts-ignore
import NewsletterContent from './pages/NewsletterContent';
import { Scissors, LogOut, Users, ClipboardList, BarChart3, Package, UserCog, Menu, X, Calendar, Gift, Star, Clock, FileText, Phone, Mail } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  user: any;
  loading: boolean;
}

// Protected Route Wrapper
const ProtectedRoute = ({ children, user, loading }: ProtectedRouteProps) => {
  if (loading) return (
    <div className="admin-panel loading-overlay">
      <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/admin/login" />;
};

interface NavItem {
  path: string;
  icon: any;
  label: string;
  submenu?: { path: string; label: string }[];
}

const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems: NavItem[] = [
    { path: '/admin', icon: ClipboardList, label: 'Reception' },
    { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/services', icon: Scissors, label: 'Services' },
    { path: '/admin/staff', icon: UserCog, label: 'Staff' },
    { path: '/admin/products', icon: Package, label: 'Inventory' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/admin/attendance', icon: Clock, label: 'Attendance' },
    { path: '/admin/loyalty', icon: Gift, label: 'Loyalty' },
    { path: '/admin/hero', icon: FileText, label: 'Hero Section' },
    { path: '/admin/gallery', icon: FileText, label: 'Gallery' },
    { path: '/admin/reviews', icon: Star, label: 'Reviews' },
    { path: '/admin/faqs', icon: FileText, label: 'FAQs' },
    { path: '/admin/offers', icon: Gift, label: 'Special Offers' },
    { path: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
    { path: '/admin/contact', icon: Phone, label: 'Contact Info' },
  ];

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      {/* Header */}
      <div className="mobile-header">
        <div className="header-left">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="header-title-section">
            <h1 className="header-page-title">Velvet Luxury Salon - Premium Beauty</h1>
          </div>
        </div>
        <div className="sidebar-logo">S</div>
      </div>

      {/* Main Layout Container */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar Overlay */}
        <div
          className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Mobile Close Button */}
        <div className="sidebar-mobile-close" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.5rem' }}>
          <button
            className="mobile-menu-btn"
            style={{ display: 'flex' }}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main Menu</div>
            {navItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => {
                    if (window.innerWidth <= 1024) setIsSidebarOpen(false);
                    if (item.submenu) setExpandedMenu(expandedMenu === item.path ? null : item.path);
                  }}
                >
                  <item.icon size={20} className="nav-icon" />
                  <span>{item.label}</span>
                  {item.submenu && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>
                      {expandedMenu === item.path ? '▼' : '▶'}
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

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)', lineHeight: '1.4' }}>Kalingarayanpalayam, Bhavani</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)', lineHeight: '1.4' }}>Erode District, Tamil Nadu - 638301</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', fontWeight: 500, color: 'var(--foreground)' }}>📞 9667722611</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="nav-link" 
            style={{ 
              color: 'var(--danger)', 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer', 
              width: '100%' 
            }}
          >
            <LogOut size={20} className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
        </aside>

        {/* Main Content */}
        <div className="content-wrapper">
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
              <Route path="/gallery" element={<GalleryContent />} />
              <Route path="/reviews" element={<ReviewsManagement />} />
              <Route path="/faqs" element={<FAQsContent />} />
              <Route path="/offers" element={<OffersContent />} />
              <Route path="/newsletter" element={<NewsletterContent />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

function AdminApp() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="admin-panel loading-overlay">
        <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default AdminApp;
