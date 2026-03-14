import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  registerCustomer,
  applyReferralCodeDuringSignup,
} from "../services/firebaseService";
import { Eye, EyeOff, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

export default function CustomerSignupPage() {
  const navigate = useNavigate();
  const { customerData } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "+91",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    referralCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Redirect if already logged in
  useEffect(() => {
    if (customerData) {
      navigate("/");
    }
  }, [customerData, navigate]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Name is required";

    if (!formData.phone.trim() || formData.phone === "+91") {
      errors.phone = "Phone number is required";
    } else if (!/^\+91\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Phone number must be +91 followed by 10 digits";
    }

    if (!formData.email.trim()) errors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Valid email is required";
    }

    if (!formData.password) errors.password = "Password is required";
    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (
      formData.dateOfBirth &&
      !/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)
    ) {
      errors.dateOfBirth = "Invalid date format (YYYY-MM-DD)";
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

    // Clear validation error for this field
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
      // 1. Register the customer
      await registerCustomer(
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
      );

      // 2. Apply referral code if provided
      if (formData.referralCode && formData.referralCode.trim()) {
        console.log(
          "🎯 Applying referral code after signup:",
          formData.referralCode,
        );
        const referralResult = await applyReferralCodeDuringSignup(
          formData.referralCode,
          formData.phone,
          formData.name,
        );

        if (referralResult.success) {
          console.log("✅ Referral code applied successfully:", referralResult);
        } else {
          console.warn("⚠️ Referral code application failed:", referralResult);
          // Don't block signup if referral code fails
        }
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/customer/login?signup=success");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Signup error:", err);
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
              Join the{" "}
              <span className="italic font-light text-[#c9a227]">Elite</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Create your sanctuary account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Account created successfully! Redirecting to login...
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
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-600">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Phone Field */}
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

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Date of Birth Field */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={loading}
                  className={
                    validationErrors.dateOfBirth ? "border-red-500" : ""
                  }
                />
                {validationErrors.dateOfBirth && (
                  <p className="text-sm text-red-600">
                    {validationErrors.dateOfBirth}
                  </p>
                )}
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className={
                      validationErrors.confirmPassword ? "border-red-500" : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Referral Code Field */}
              <div className="space-y-2">
                <Label htmlFor="referralCode">
                  Referral Phone Number (Optional)
                </Label>
                <Input
                  id="referralCode"
                  name="referralCode"
                  type="tel"
                  placeholder="e.g., +91 9876543210"
                  value={formData.referralCode}
                  onChange={handleChange}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  Enter a friend's phone number to claim referral rewards and
                  get 10% discount
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a2e] hover:bg-[#c9a227] text-white font-black py-7 rounded-none transition-all duration-500 text-[10px] uppercase tracking-[0.3em] shadow-2xl"
              >
                {loading ? "Authenticating..." : "Establish Profile"}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-8 border-t border-slate-50 mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Already a member?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/customer/login")}
                    className="text-[#c9a227] hover:text-[#1a1a2e] font-black transition-colors ml-2"
                  >
                    Enter Sanctuary
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
