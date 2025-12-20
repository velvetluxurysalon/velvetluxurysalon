import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import App from "./app/App.tsx";
import AdminApp from "./admin/src/App.admin.jsx";
import { AuthProvider } from "./app/context/AuthContext.tsx";
import "./styles/index.css";

function RootApp() {
  const location = useLocation();

  useEffect(() => {
    // Clean up admin styles when leaving admin routes
    if (!location.pathname.startsWith("/admin")) {
      const style1 = document.getElementById('admin-index-styles');
      const style2 = document.getElementById('admin-app-styles');
      if (style1) style1.remove();
      if (style2) style2.remove();
      console.log('Cleaned up admin styles on route change');
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<App />} />
    </Routes>
  );
}

function RootWrapper() {
  return (
    <AuthProvider>
      <Router>
        <RootApp />
      </Router>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(<RootWrapper />);
  