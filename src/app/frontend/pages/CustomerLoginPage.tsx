import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { loginWithPhone } from "../services/firebaseService";
import { Eye, EyeOff, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { customerData, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    phone: "+91",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(
    searchParams.get("signup") === "success",
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Redirect if already logged in or after success
  useEffect(() => {
    if (customerData) {
      navigate("/referrals");
    }
  }, [customerData, navigate]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.phone.trim() || formData.phone === "+91") {
      errors.phone = "Phone number is required";
    } else if (!/^\+91\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Phone number must be 10 digits after +91";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For phone field, only allow +91 prefix and digits
    if (name === "phone") {
      let cleanValue = value;
      // Ensure it always starts with +91
      if (!cleanValue.startsWith("+91")) {
        cleanValue = "+91";
      }
      // Only allow digits after +91
      const afterPrefix = cleanValue.substring(3);
      const onlyDigits = afterPrefix.replace(/\D/g, "").slice(0, 10);
      cleanValue = "+91" + onlyDigits;

      setFormData((prev) => ({
        ...prev,
        [name]: cleanValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await loginWithPhone(formData.phone, formData.password);
      // The AuthContext will handle the redirect via useEffect when customerData is available
      // Don't navigate here - let the context update and trigger the redirect
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();

      if (result.needsProfileCompletion) {
        // Redirect to profile completion page with only serializable data
        navigate("/google-profile-completion", {
          state: {
            email: result.email,
            displayName: result.displayName,
          },
        });
      } else {
        // User already has a complete profile, redirect to home
        navigate("/appointments");
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in failed. Please try again.");
      console.error("Google sign-in error:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c9a227]/5 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c9a227]/5 rounded-full blur-[100px] -ml-24 -mb-24" />

      <div className="max-w-md mx-auto relative">
        <Card className="shadow-2xl border-none p-4 rounded-none bg-white">
          <CardHeader className="space-y-6 text-center pb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a1a2e] mb-2">
              <Sparkles className="w-6 h-6 text-[#c9a227]" />
            </div>
            <CardTitle className="text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight">
              Welcome{" "}
              <span className="italic font-light text-[#c9a227]">Back</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Access your luxury profile
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Account created successfully! Please login to continue.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (India)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className={validationErrors.phone ? "border-red-500" : ""}
                  maxLength={13}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-600">
                    {validationErrors.phone}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Enter your 10-digit phone number (with +91 country code)
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className={
                      validationErrors.password ? "border-red-500" : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/customer/forgot-password")}
                  className="text-[10px] font-black uppercase tracking-widest text-[#c9a227] hover:text-[#1a1a2e] transition-colors"
                >
                  Forgot Access Key?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a2e] hover:bg-[#c9a227] text-white font-black py-7 rounded-none transition-all duration-500 text-[10px] uppercase tracking-[0.3em] shadow-2xl"
              >
                {loading ? "Verifying..." : "Enter Sanctuary"}
              </Button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    Or
                  </span>
                </div>
              </div>

              {/* Google Sign-in Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full bg-white border-2 border-slate-200 hover:border-slate-400 text-slate-900 font-black py-7 rounded-none transition-all duration-500 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {googleLoading ? "Signing in..." : "Sign in with Google"}
              </Button>

              {/* Signup Link */}
              <div className="text-center pt-8 border-t border-slate-50 mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  New guest?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/customer/signup")}
                    className="text-[#c9a227] hover:text-[#1a1a2e] font-black transition-colors ml-2"
                  >
                    Register Profile
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔒 Your data is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
}
