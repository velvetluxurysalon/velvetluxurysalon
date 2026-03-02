import { useState, useEffect } from "react";
import { Star, MessageCircle, Calendar } from "lucide-react";
import { getReviews } from "../../services/firebaseService";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviews(100);
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="pt-24 pb-16 border-b border-slate-100 mb-12 bg-gradient-to-br from-transparent via-amber-50/30 to-transparent">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            Customer Feedback
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            Customer <span className="text-amber-600">Reviews</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Hear what our satisfied clients have to say about their experience
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="space-y-6 pb-12">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={review.id || index}
                className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Rating */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < (review.rating || 5)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {review.rating || 5}/5
                  </span>
                </div>

                {/* Review Content */}
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  {review.customerName || "Anonymous"}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {review.comment || review.feedback || "No comment provided"}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {review.createdAt
                        ? new Date(
                            review.createdAt.toDate?.() || review.createdAt,
                          ).toLocaleDateString()
                        : "No date"}
                    </span>
                  </div>
                  {review.service && (
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      <span>{review.service}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle
                size={48}
                className="mx-auto text-slate-300 mb-4"
              />
              <p className="text-slate-500 text-lg">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
