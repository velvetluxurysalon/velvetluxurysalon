import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./frontend/components/layout/MainLayout";
import HomePage from "./frontend/components/pages/HomePage";
import ServicesPage from "./frontend/components/pages/ServicesPage";
import GalleryPage from "./frontend/components/pages/GalleryPage";
import ProductsPage from "./frontend/components/pages/ProductsPage";
import ProfilePage from "./frontend/components/pages/ProfilePage";
import ContactPage from "./frontend/components/pages/ContactPage";
import LocationPage from "./frontend/components/pages/LocationPage";
import FavoritesPage from "./frontend/components/pages/FavoritesPage";
import MembershipPage from "./frontend/components/pages/MembershipPage";
import BlogPage from "./frontend/components/pages/BlogPage";
import ReviewsPage from "./frontend/components/pages/ReviewsPage";
import SpecialOffersPage from "./frontend/components/pages/SpecialOffersPage";
import AppointmentsPage from "./frontend/components/pages/AppointmentsPage";
import GoogleProfileCompletionPage from "./frontend/components/pages/GoogleProfileCompletionPage";
import CustomerLoginPage from "./frontend/pages/CustomerLoginPage";
import CustomerSignupPage from "./frontend/pages/CustomerSignupPage";
import ReferralSystemPage from "./frontend/pages/ReferralSystemPage";
import SpinWheelPage from "./frontend/pages/SpinWheelPage";
import { Toaster } from "./frontend/components/ui/sonner";
import { useAuth } from "./frontend/context/AuthContext";

// Protected route component for receptionist-only pages
function ReceptionistRoute({ children }: { children: React.ReactNode }) {
  const { isReceptionist, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isReceptionist) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Main Site Routes with Layout - including login/signup now */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/customer/login" element={<CustomerLoginPage />} />
                <Route
                  path="/customer/signup"
                  element={<CustomerSignupPage />}
                />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/location" element={<LocationPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/memberships" element={<MembershipPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/referrals" element={<ReferralSystemPage />} />
                <Route path="/spin" element={<SpinWheelPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route
                  path="/google-profile-completion"
                  element={<GoogleProfileCompletionPage />}
                />

                {/* Receptionist-only routes */}
                <Route
                  path="/reviews"
                  element={
                    <ReceptionistRoute>
                      <ReviewsPage />
                    </ReceptionistRoute>
                  }
                />
                <Route
                  path="/special-offers"
                  element={
                    <ReceptionistRoute>
                      <SpecialOffersPage />
                    </ReceptionistRoute>
                  }
                />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}
