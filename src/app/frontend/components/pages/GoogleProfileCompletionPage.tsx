import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, ArrowRight } from "lucide-react";
import { auth } from "../../../../firebaseConfig";

export default function GoogleProfileCompletionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeGoogleProfile } = useAuth();

  const [phone, setPhone] = useState("+91");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const displayName = location.state?.displayName || "User";
  const email = location.state?.email || "";

  // Handle phone input - ensure +91 prefix and only digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove any non-digit characters except the leading "+"
    const digitsOnly = value.replace(/[^\d+]/g, "");

    // Ensure it starts with +91
    let formatted = digitsOnly.startsWith("+91")
      ? digitsOnly
      : "+91" + digitsOnly.replace(/^\+?91?/, "");

    // Limit to +91 + 10 digits
    if (formatted.length > 13) {
      formatted = formatted.slice(0, 13);
    }

    // If it's just +91, keep it; otherwise ensure we have the prefix
    if (formatted.length < 3) {
      formatted = "+91";
    }

    setPhone(formatted);
  };

  // Get the current user's UID from Firebase auth
  useEffect(() => {
    if (auth.currentUser?.uid) {
      setIsValid(true);
    } else {
      // No authenticated user, redirect to login
      navigate("/customer/login");
    }
  }, [navigate]);

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Invalid Session
          </h1>
          <p className="text-slate-600 mb-8">Please try signing in again.</p>
          <button
            onClick={() => navigate("/customer/login")}
            className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim() || phone === "+91") {
      setError("Phone number is required");
      return;
    }

    // Validate phone format: +91 + 10 digits
    if (!/^\+91\d{10}$/.test(phone)) {
      setError("Phone number must be 10 digits after +91");
      return;
    }

    if (!dob) {
      setError("Date of birth is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const uid = auth.currentUser?.uid;
      if (!uid) {
        setError("Session expired. Please sign in again.");
        return;
      }

      await completeGoogleProfile(uid, phone, dob);

      // Redirect to home or appointments page
      navigate("/appointments");
    } catch (err: any) {
      setError(err.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Complete Your Profile
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Welcome, <span className="font-medium">{displayName}</span>! Please
            provide a few more details to complete your account.
          </p>

          {error && (
            <div className="mb-6 flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+919123456789"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                This will be used as your customer ID for bookings
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Completing..." : "Complete Profile"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            By completing your profile, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}
