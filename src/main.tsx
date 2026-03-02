import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./app/App.tsx";
import { AuthProvider } from "./app/frontend/context/AuthContext.tsx";
import "./app/styles/index.css";

function RootWrapper() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

createRoot(document.getElementById("root")!).render(<RootWrapper />);
