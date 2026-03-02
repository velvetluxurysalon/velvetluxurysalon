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
  const { customerData } = useAuth();
  const [formData, setFormData] = useState({
    phone: "+91",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
      // The AuthContext will handle the redirect via useEffect
      navigate("/referrals");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
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
