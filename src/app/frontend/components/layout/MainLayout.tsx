import { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Scissors,
  ImageIcon,
  Users,
  MapPin,
  Mail,
  Heart,
  Phone,
  Menu,
  X,
  Search,
  ChevronRight,
  Calendar,
  BookOpen,
  Crown,
  Star,
  Sparkles,
  LogIn,
  UserPlus,
  Gift,
  LogOut,
  Zap,
  Package,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Footer from "../Footer";
import OfferScroller from "../OfferScroller";

interface MainLayoutProps {
  children: React.ReactNode;
}

const baseNavItems = [
  { icon: Home, label: "Home", href: "/", id: "home" },
  { icon: Scissors, label: "Services", href: "/services", id: "services" },
  { icon: ImageIcon, label: "Gallery", href: "/gallery", id: "gallery" },
  { icon: Package, label: "Products", href: "/products", id: "products" },
  { icon: Users, label: "Profile", href: "/profile", id: "profile" },
  { icon: BookOpen, label: "Blog", href: "/blog", id: "blog" },
  {
    icon: Crown,
    label: "Memberships",
    href: "/memberships",
    id: "memberships",
  },
  { icon: MapPin, label: "Location", href: "/location", id: "location" },
  { icon: Mail, label: "Contact", href: "/contact", id: "contact" },
  { icon: Heart, label: "Favorites", href: "/favorites", id: "favorites" },
  { icon: HelpCircle, label: "Q&A", href: "/#faq", id: "faq" },
  {
    icon: Sparkles,
    label: "Special Offers",
    href: "/#special-offers",
    id: "special-offers",
  },
];

const receptionistNavItems = [
  { icon: ImageIcon, label: "Gallery", href: "/gallery", id: "gallery" },
  { icon: Star, label: "Reviews", href: "/reviews", id: "reviews" },
  {
    icon: Sparkles,
    label: "Special Offers",
    href: "/special-offers",
    id: "special-offers",
  },
];

const bottomBaseNavItems = [
  { icon: Home, label: "Home", href: "/", id: "home" },
  { icon: Scissors, label: "Services", href: "/services", id: "services" },
  { icon: Calendar, label: "Book", href: "/appointments", id: "appointments" },
  { icon: Package, label: "Products", href: "/products", id: "products" },
  { icon: Users, label: "Profile", href: "/profile", id: "profile" },
];

function getActiveId(pathname: string, sideNavItems: any[]): string {
  if (pathname === "/") return "home";
  const match = sideNavItems.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href),
  );
  return match?.id ?? "home";
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isReceptionist, customerData, logout } = useAuth();
  const navigate = useNavigate();
  const mainContentRef = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine which nav items to show based on user role and auth status
  let sideNavItems = isReceptionist ? receptionistNavItems : baseNavItems;

  // Add referrals link if customer is logged in (exclude receptionists)
  if (customerData && !isReceptionist) {
    sideNavItems = [
      ...sideNavItems,
      {
        icon: Gift,
        label: "My Referrals",
        href: "/referrals",
        id: "referrals",
      },
      {
        icon: Zap,
        label: "Spin Wheel",
        href: "/spin",
        id: "spin",
      },
    ];
  }
  const bottomNavItems = isReceptionist
    ? [
        { icon: Home, label: "Home", href: "/", id: "home" },
        { icon: ImageIcon, label: "Gallery", href: "/gallery", id: "gallery" },
        { icon: Star, label: "Reviews", href: "/reviews", id: "reviews" },
        {
          icon: Sparkles,
          label: "Offers",
          href: "/special-offers",
          id: "special-offers",
        },
      ]
    : bottomBaseNavItems;

  const activeId = getActiveId(location.pathname, sideNavItems);

  // Close drawer on route change and scroll to top
  useEffect(() => {
    setDrawerOpen(false);
    // Scroll entire window to top
    window.scrollTo(0, 0);
    // Also scroll main content area if available
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  // Prevent body scroll when drawer open (mobile)
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA]">
      {/* ═══════════ TOP APP BAR ═══════════ */}
      <header className="sticky top-0 z-50 bg-black border-b border-slate-800 h-16">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left — hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-700 active:bg-slate-600 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              {drawerOpen ? (
                <X size={22} className="text-white" />
              ) : (
                <Menu size={22} className="text-white" />
              )}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/velvet_logo.png"
                alt="Velvet Luxury Salon"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Center — desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {sideNavItems.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  activeId === item.id
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right — search + call + auth */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-white" />
            </button>

            {/* Customer Auth Menu */}
            {customerData ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                  title={customerData.name}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-medium">
                    {customerData.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-white">
                    {customerData.name?.split(" ")[0] || "User"}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-sm border border-slate-100 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">
                        {customerData.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {customerData.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate("/referrals");
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Gift size={16} />
                        Referral Program
                      </button>
                      <button
                        onClick={() => {
                          navigate("/spin");
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Zap size={16} />
                        Daily Spin Wheel
                      </button>
                      <button
                        onClick={() => {
                          navigate("/memberships");
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Crown size={16} />
                        My Memberships
                      </button>
                      <button
                        onClick={() => {
                          navigate("/favorites");
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Heart size={16} />
                        Favorites
                      </button>
                    </div>
                    <div className="py-2 border-t border-slate-100">
                      <button
                        onClick={async () => {
                          await logout();
                          setProfileMenuOpen(false);
                          navigate("/");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/customer/login")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-white hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  <LogIn size={16} />
                  <span className="hidden md:inline">Login</span>
                </button>
                <button
                  onClick={() => navigate("/customer/signup")}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  <UserPlus size={16} />
                  <span className="hidden md:inline">Sign Up</span>
                </button>
              </div>
            )}

            <a
              href="tel:+15551234567"
              className="hidden sm:flex items-center gap-2 ml-1 px-4 py-2 rounded-lg bg-amber-600 text-white text-[13px] font-medium hover:bg-amber-700 transition-colors"
            >
              <Phone size={14} />
              <span className="hidden md:inline">Call Now</span>
            </a>
          </div>
        </div>

        {/* Expandable search */}
        {searchOpen && (
          <div className="px-4 pb-3 lg:px-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                autoFocus
                type="text"
                placeholder="Search services, treatments…"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
              />
            </div>
          </div>
        )}
      </header>

      {/* ═══════════ BODY WRAPPER ═══════════ */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 lg:hidden ${
            drawerOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* ═══════════ SIDE DRAWER ═══════════ */}
        <aside
          className={`
            fixed top-16 left-0 bottom-0 w-[272px] bg-white border-r border-slate-100
            z-[60] flex flex-col overflow-y-auto
            transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            lg:static lg:w-[272px] lg:flex-shrink-0 lg:border-r lg:overflow-y-auto lg:h-auto
            ${drawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
            lg:translate-x-0 lg:shadow-none
          `}
        >
          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {sideNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all group ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-slate-700"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight
                    size={16}
                    className={`transition-opacity ${
                      isActive
                        ? "opacity-60 text-slate-500"
                        : "opacity-0 group-hover:opacity-100 text-slate-300"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Drawer bottom */}
          <div className="px-3 pb-4 space-y-3 border-t border-slate-100 pt-4 mt-auto">
            <button
              onClick={() => {
                navigate("/appointments");
                setDrawerOpen(false);
              }}
              className="block w-full text-center px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Book Appointment
            </button>

            {/* Mobile Auth Buttons */}
            {!customerData && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate("/customer/login");
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  <LogIn size={16} />
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/customer/signup");
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  <UserPlus size={16} />
                  Sign Up
                </button>
              </div>
            )}

            {customerData && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate("/referrals");
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  <Gift size={16} />
                  Referrals
                </button>
                <button
                  onClick={() => {
                    navigate("/spin");
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  <Zap size={16} />
                  Spin Wheel
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    setDrawerOpen(false);
                    navigate("/");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}

            <div className="px-1 space-y-1.5">
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">
                  Email
                </p>
                <a
                  href="mailto:Velvetluxurysalon@gmail.com"
                  className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Mail size={12} /> Velvetluxurysalon@gmail.com
                </a>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">
                  WhatsApp
                </p>
                <a
                  href="https://wa.me/919345678646"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Phone size={12} /> 9345678646
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* ═══════════ MAIN CONTENT ═══════════ */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto pb-[76px] lg:pb-0"
        >
          <OfferScroller />
          <div className="w-full">{children}</div>
          <Footer />
        </main>
      </div>

      {/* ═══════════ BOTTOM NAV BAR — mobile & tablet ═══════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-slate-800 z-50">
        <div className="flex items-center justify-around h-[68px] max-w-lg mx-auto px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;

            // Handle appointments button specially with center position
            if (item.id === "appointments") {
              return (
                <button
                  key={item.id}
                  onClick={() => navigate("/appointments")}
                  className={`flex flex-col items-center justify-center transition-all relative -mt-5`}
                >
                  <div className="w-[52px] h-[52px] rounded-full bg-[#c9a227] flex items-center justify-center shadow-sm ring-4 ring-black">
                    <Icon size={22} className="text-white" />
                  </div>
                  <span className="text-[10px] mt-1 font-medium text-white">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.7} />
                <span
                  className={`text-[10px] mt-1 font-medium ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
