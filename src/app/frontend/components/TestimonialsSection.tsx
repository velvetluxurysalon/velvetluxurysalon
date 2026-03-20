import { useState, useEffect } from "react";
import { Star, Loader, X, Send } from "lucide-react";
import { getReviews, submitReview } from "../services/firebaseService";
import { useAuth } from "../context/AuthContext";

const FALLBACK_REVIEWS = [
  {
    id: "f1",
    name: "Priya Sharma",
    service: "Hair Treatment",
    rating: 5,
    review:
      "Absolutely loved my experience at Velvet! The stylists are professional and the results exceeded my expectations.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
  {
    id: "f2",
    name: "Rahul Mehta",
    service: "Men's Grooming",
    rating: 5,
    review:
      "Best salon in the city! Clean, elegant ambiance and skilled professionals. Highly recommend the premium grooming package.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
  },
  {
    id: "f3",
    name: "Ananya Kapoor",
    service: "Bridal Package",
    rating: 5,
    review:
      "Made my wedding day perfect. The bridal team was attentive, creative, and brought my vision to life beautifully.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
  },
];

export default function TestimonialsSection() {
  const [firebaseReviews, setFirebaseReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, reviewText: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews(10);
        setFirebaseReviews(data);
        if (isAuthenticated && user?.uid) {
          setHasPosted(!!data.find((r: any) => r.customerId === user.uid));
        }
      } catch {
        // silently fall back to hardcoded reviews
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [isAuthenticated, user]);

  const handleSubmitReview = async () => {
    if (!formData.reviewText.trim()) {
      setSubmitMessage({ type: "error", text: "Please write a review" });
      return;
    }
    if (!user?.uid) return;
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
      const updated = await getReviews(10);
      setFirebaseReviews(updated);
      setTimeout(() => setSubmitMessage(null), 3000);
    } catch {
      setSubmitMessage({
        type: "error",
        text: "Failed to post review. Please try again.",
      });
      setTimeout(() => setSubmitMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const mappedFirebase = firebaseReviews.map((r: any) => ({
    id: r.id,
    name: r.customerName || "Anonymous",
    service: r.serviceName || "Service",
    rating: r.rating || 5,
    review: r.reviewText || "",
    image:
      r.customerAvatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.customerName || "user"}`,
  }));
  const displayReviews =
    mappedFirebase.length > 0 ? mappedFirebase : FALLBACK_REVIEWS;

  return (
    <div className="w-full bg-gray-50 px-4 py-8 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">
              Reviews
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              What Our Clients Say
            </h2>
          </div>
          {isAuthenticated && !hasPosted && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Review
            </button>
          )}
          {isAuthenticated && hasPosted && (
            <span className="text-xs text-green-600 font-medium">
              ✓ Reviewed
            </span>
          )}
        </div>

        {/* Submit message */}
        {submitMessage && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${submitMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {submitMessage.text}
          </div>
        )}

        {/* Review cards — horizontal scroll on mobile */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
            {displayReviews.map((t) => (
              <div
                key={t.id}
                className="min-w-[260px] snap-start flex-shrink-0 md:min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-100"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {t.service}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  "{t.review}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Average rating bar */}
        {displayReviews.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-4 bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-sm font-bold text-gray-900">
              {(
                displayReviews.reduce((s, r) => s + r.rating, 0) /
                displayReviews.length
              ).toFixed(1)}
              /5
            </p>
            <span className="text-gray-300">|</span>
            <p className="text-sm text-gray-600">
              {displayReviews.length}+ happy clients
            </p>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  Share Your Review
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Rating
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setFormData({ ...formData, rating: s })}
                      >
                        <Star
                          className={`w-8 h-8 ${s <= formData.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Your Review
                  </p>
                  <textarea
                    value={formData.reviewText}
                    onChange={(e) =>
                      setFormData({ ...formData, reviewText: e.target.value })
                    }
                    placeholder="Share your experience..."
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    {submitting ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      "Post Review"
                    )}
                  </button>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
