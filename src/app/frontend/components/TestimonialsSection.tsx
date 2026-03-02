import { useState, useEffect } from "react";
import { Star, Loader, X, Quote, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { getReviews, submitReview } from "../services/firebaseService";
import { useAuth } from "../context/AuthContext";

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    reviewText: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews(10); // Fetch top 10 reviews
        setReviews(data);

        // Check if current user has already posted
        if (isAuthenticated && user?.uid) {
          const userReview = data.find(
            (review: any) => review.customerId === user.uid,
          );
          setHasPosted(!!userReview);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [isAuthenticated, user]);

  // Transform reviews for display
  const testimonials = reviews.map((review: any) => {
    // Use Firebase customer avatar if available, otherwise generate from name
    let avatarUrl = review.customerAvatar;
    if (!avatarUrl) {
      avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.customerName || "customer"}`;
    }

    return {
      id: review.id,
      name: review.customerName || "Anonymous",
      service: review.serviceName || "Service",
      rating: review.rating || 5,
      review: review.reviewText || "",
      date: review.createdAt
        ? new Date(review.createdAt).toLocaleDateString()
        : "Recent",
      image: avatarUrl,
    };
  });

  const handleSubmitReview = async () => {
    if (!formData.reviewText.trim()) {
      setSubmitMessage({ type: "error", text: "Please write a review" });
      return;
    }

    if (!user?.uid) {
      setSubmitMessage({ type: "error", text: "User not authenticated" });
      return;
    }

    try {
      setSubmitting(true);
      const customerName =
        user.displayName || user.email?.split("@")[0] || "Customer";
      await submitReview(
        user.uid,
        customerName,
        user.email || "",
        "",
        formData.rating,
        formData.reviewText,
      );

      setSubmitMessage({
        type: "success",
        text: "Thank you! Your review has been posted.",
      });
      setFormData({ rating: 5, reviewText: "" });
      setShowReviewForm(false);
      setHasPosted(true);

      // Reload reviews
      const updatedReviews = await getReviews(10);
      setReviews(updatedReviews);

      setTimeout(() => setSubmitMessage(null), 3000);
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Failed to post review. Please try again.",
      });
      setTimeout(() => setSubmitMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white via-purple-50/50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />

      {/* Decorative quotes */}
      <div className="absolute top-20 left-10 opacity-5">
        <Quote className="w-32 h-32 text-purple-600" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-5 rotate-180">
        <Quote className="w-32 h-32 text-purple-600" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
            <MessageCircle className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">
              Client Testimonials
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-4 sm:mb-6 text-slate-900 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Real experiences from real customers who trust us with their beauty
            journey
          </p>
        </div>

        {/* Post Review Button for Logged-in Users */}
        {isAuthenticated && !hasPosted && !showReviewForm && (
          <div className="text-center mb-8 sm:mb-10">
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Share Your Experience
            </Button>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && isAuthenticated && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-serif font-light text-slate-900">
                      Share Your Review
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      We value your feedback
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {submitMessage && (
                  <div
                    className={`mb-4 p-4 rounded-lg text-sm ${submitMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                  >
                    {submitMessage.text}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3">
                      Your Rating *
                    </label>
                    <div className="flex gap-2 p-4 bg-slate-50 rounded-lg justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setFormData({ ...formData, rating: star })
                          }
                          className="transition-all duration-200 hover:scale-125"
                        >
                          <Star
                            className={`w-10 h-10 ${
                              star <= formData.rating
                                ? "fill-slate-400 text-slate-400 drop-shadow-md"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3">
                      Your Review *
                    </label>
                    <textarea
                      value={formData.reviewText}
                      onChange={(e) =>
                        setFormData({ ...formData, reviewText: e.target.value })
                      }
                      placeholder="Share your experience with us..."
                      className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 resize-none text-sm transition-all duration-200"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium"
                    >
                      {submitting ? (
                        <Loader className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        "Post Review"
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowReviewForm(false)}
                      variant="outline"
                      className="flex-1 py-3 rounded-lg border border-slate-200"
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Already Posted Message */}
        {isAuthenticated && hasPosted && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-slate-700 font-medium">
                Thank you for sharing your experience!
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            <p className="text-slate-600 animate-pulse">Loading reviews...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          <>
            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="group bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-500 border border-slate-100 hover:border-slate-200 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Quote decoration */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-16 h-16 text-slate-400" />
                  </div>

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-slate-100 group-hover:ring-slate-200 transition-all"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-slate-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-600 font-medium">
                        {testimonial.service}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {testimonial.date}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-5 h-5 ${idx < testimonial.rating ? "fill-slate-400 text-slate-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-slate-600 leading-relaxed relative z-10">
                    "{testimonial.review}"
                  </p>

                  {/* Bottom decoration */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              ))}
            </div>

            {/* Stats bar */}
            <div className="mt-12 sm:mt-16">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-slate-400 text-slate-400"
                      />
                    ))}
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="text-3xl sm:text-4xl font-light text-slate-900">
                      {(
                        reviews.reduce(
                          (sum: number, r: any) => sum + (r.rating || 5),
                          0,
                        ) / reviews.length
                      ).toFixed(1)}
                    </span>
                    <span className="text-slate-600 text-lg ml-2">
                      out of 5
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-slate-200" />
                  <div className="text-slate-900 text-center sm:text-left">
                    <span className="text-2xl font-light">
                      {reviews.length}+
                    </span>
                    <span className="text-slate-600 ml-2">Happy Clients</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
