import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./app/App.tsx";
import { AuthProvider } from "./app/context/AuthContext.tsx";
import "./styles/index.css";

function RootWrapper() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(<RootWrapper />);
  