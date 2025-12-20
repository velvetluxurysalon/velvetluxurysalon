import { useState, useEffect } from "react";
import { Star, Loader, X } from "lucide-react";
import { Card } from "./ui/card";
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
    reviewText: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews(10); // Fetch top 10 reviews
        setReviews(data);
        
        // Check if current user has already posted
        if (isAuthenticated && user?.uid) {
          const userReview = data.find((review: any) => review.customerId === user.uid);
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
  const testimonials = reviews.map((review: any) => ({
    id: review.id,
    name: review.customerName || "Anonymous",
    service: review.serviceName || "Service",
    rating: review.rating || 5,
    review: review.reviewText || "",
    date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recent",
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.customerName || 'customer'}`
  }));

  const handleSubmitReview = async () => {
    if (!formData.reviewText.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please write a review' });
      return;
    }

    if (!user?.uid) {
      setSubmitMessage({ type: 'error', text: 'User not authenticated' });
      return;
    }

    try {
      setSubmitting(true);
      const customerName = user.displayName || user.email?.split('@')[0] || 'Customer';
      await submitReview(user.uid, customerName, user.email || '', "", formData.rating, formData.reviewText);
      
      setSubmitMessage({ type: 'success', text: 'Thank you! Your review has been posted.' });
      setFormData({ rating: 5, reviewText: "" });
      setShowReviewForm(false);
      setHasPosted(true);
      
      // Reload reviews
      const updatedReviews = await getReviews(10);
      setReviews(updatedReviews);
      
      setTimeout(() => setSubmitMessage(null), 3000);
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to post review. Please try again.' });
      setTimeout(() => setSubmitMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-8 md:py-12 lg:py-20 px-2 sm:px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">What Our Clients Say</h2>
          <p className="text-xs sm:text-base md:text-xl text-gray-600">Real experiences from real customers</p>
        </div>

        {/* Post Review Button for Logged-in Users */}
        {isAuthenticated && !hasPosted && !showReviewForm && (
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <Button 
              onClick={() => setShowReviewForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-6 text-xs sm:text-sm md:text-base"
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
              Share Your Experience
            </Button>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && isAuthenticated && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <Card className="w-full max-w-sm p-3 sm:p-4 md:p-6 bg-white max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Share Your Review</h3>
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {submitMessage && (
                <div className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {submitMessage.text}
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Rating *</label>
                  <div className="flex gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${
                            star <= formData.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Your Review *</label>
                  <textarea
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    placeholder="Share your experience with us..."
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none text-xs sm:text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 sm:gap-3 pt-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm py-2 sm:py-3"
                  >
                    {submitting ? 'Posting...' : 'Post Review'}
                  </Button>
                  <Button
                    onClick={() => setShowReviewForm(false)}
                    variant="outline"
                    className="flex-1 text-xs sm:text-sm py-2 sm:py-3"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Already Posted Message */}
        {isAuthenticated && hasPosted && (
          <div className="text-center mb-6 sm:mb-8 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-xs sm:text-sm">✓ Thank you for your review!</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 text-xs sm:text-base md:text-lg">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            <ul className="space-y-6">
              {testimonials.map((testimonial) => (
                <li
                  key={testimonial.id}
                  className="border-b border-purple-100 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold leading-snug">{testimonial.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{testimonial.service}</p>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">{testimonial.date}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {[...Array(testimonial.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-700 mt-3 leading-relaxed">"{testimonial.review}"</p>
                </li>
              ))}
            </ul>

            <div className="text-center mt-6 sm:mt-8">
              <div className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-purple-100 rounded-full">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm md:text-lg">
                  {(reviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)}/5 {' '}
                  Average Rating from {reviews.length}+ Reviews
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
