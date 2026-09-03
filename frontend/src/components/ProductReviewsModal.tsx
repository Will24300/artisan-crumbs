import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  Star,
  Camera,
  ShieldCheck,
  Sparkles,
  Upload,
  MessageSquare,
  Check,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_BASE } from "../utils/api";
import type { RootState } from "../store";

export interface ReviewItem {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  photo?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductReviewData {
  reviews: ReviewItem[];
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
}

interface ProductReviewsModalProps {
  productId: string | null;
  productName: string;
  productImage?: string;
  productPrice?: number;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export const ProductReviewsModal: React.FC<ProductReviewsModalProps> = ({
  productId,
  productName,
  productImage,
  productPrice,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProductReviewData>({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  // Write Review Form State
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Lightbox Image View
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/reviews/product/${productId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Ignore background fetch error
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (isOpen && productId) {
      fetchReviews();
      setShowForm(false);
      setComment("");
      setPhotoBase64("");
      setNewRating(5);
    }
  }, [isOpen, productId, fetchReviews]);

  // Handle Photo File Upload to Base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !authUser) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (authUser?.role === "admin") {
      toast.error("Administrators cannot post product reviews.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter your thoughts about this baked item");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/reviews/product/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: newRating,
          comment: comment.trim(),
          photo: photoBase64,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to submit review");
      }

      toast.success("Thank you! Your artisan review has been published ✨");
      setComment("");
      setPhotoBase64("");
      setShowForm(false);
      fetchReviews();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !productId) return null;

  // Filter reviews that have photos for gallery section
  const photoReviews = data.reviews.filter((r) => r.photo && r.photo.length > 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-800 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              {productImage && (
                <img
                  src={productImage}
                  alt={productName}
                  className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-sm"
                />
              )}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#D46211] bg-[#FFF4EB] dark:bg-[#D46211]/15 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Artisan Reviews & Ratings
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-stone-100 mt-1 line-clamp-1">
                  {productName}
                </h2>
                {productPrice !== undefined && (
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    ${productPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="overflow-y-auto pr-1 space-y-6 flex-1">
            {/* Aggregate Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-stone-50 dark:bg-stone-800/40 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/50">
              {/* Left Average Box */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r border-stone-200 dark:border-stone-700/60 pb-4 sm:pb-0 sm:pr-4">
                <span className="text-4xl font-extrabold font-serif text-stone-900 dark:text-stone-100">
                  {data.averageRating > 0 ? data.averageRating.toFixed(1) : "N/A"}
                </span>
                <div className="flex items-center gap-1 my-1.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(data.averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300 dark:text-stone-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {data.totalReviews} {data.totalReviews === 1 ? "Customer Review" : "Customer Reviews"}
                </p>
              </div>

              {/* Right Star Breakdown */}
              <div className="sm:col-span-7 space-y-1.5 justify-center flex flex-col">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = data.ratingBreakdown[star] || 0;
                  const pct = data.totalReviews > 0 ? (count / data.totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-6 font-semibold text-stone-600 dark:text-stone-300 flex items-center justify-end gap-0.5">
                        {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                      </span>
                      <div className="flex-1 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-[#D46211] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-7 text-right text-stone-400 text-[11px] font-mono">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Photo Gallery Wall */}
            {photoReviews.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#D46211]" /> Customer Baked Goods Photos
                  </h3>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {photoReviews.length} photo{photoReviews.length > 1 ? "s" : ""} shared
                  </span>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {photoReviews.map((rev) => (
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      key={rev._id}
                      onClick={() => setLightboxImage(rev.photo || null)}
                      className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer group border border-stone-200 dark:border-stone-700 shadow-sm"
                    >
                      <img
                        src={rev.photo}
                        alt="Customer photo"
                        className="w-full h-full object-cover group-hover:brightness-90 transition-all"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                        <Camera className="w-4 h-4" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Write Review Trigger / Form Section */}
            <div className="border-t border-stone-100 dark:border-stone-800 pt-4">
              {authUser?.role === "admin" ? (
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Logged in as Administrator. Product review submission is disabled for admin accounts.</span>
                </div>
              ) : !showForm ? (
                <div className="flex items-center justify-between bg-orange-50/50 dark:bg-[#D46211]/10 p-4 rounded-2xl border border-orange-100 dark:border-[#D46211]/20">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Tasted this creation?
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Share your rating and upload photos to inspire our baker community.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!token) {
                        toast.info("Please sign in to share your artisan review");
                      } else {
                        setShowForm(true);
                      }
                    }}
                    className="px-4 py-2 bg-[#D46211] hover:bg-[#b8520c] text-white font-bold text-xs rounded-xl shadow-md shadow-[#D46211]/20 transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Write Review
                  </button>
                </div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmitReview}
                  className="bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-3">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D46211]" /> Share Your Review
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Star Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (hoverRating || newRating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-stone-300 dark:text-stone-600"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-stone-600 dark:text-stone-300 ml-2">
                        {hoverRating || newRating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Review Text Area */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                      Your Comments
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How was the flavor, texture, crust, or presentation? We'd love your feedback!"
                      className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D46211]"
                    />
                  </div>

                  {/* Optional Photo Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                      Add a Photo of Your Baked Item (Optional)
                    </label>
                    {photoBase64 ? (
                      <div className="relative inline-block">
                        <img
                          src={photoBase64}
                          alt="Review upload preview"
                          className="w-20 h-20 rounded-xl object-cover border border-stone-300 dark:border-stone-700"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotoBase64("")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 dark:text-stone-300 border border-dashed border-stone-300 dark:border-stone-700 p-3 rounded-xl hover:bg-white dark:hover:bg-stone-900 transition-colors w-fit">
                        <Upload className="w-4 h-4 text-[#D46211]" />
                        <span>Upload photo (Max 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 bg-[#D46211] hover:bg-[#b8520c] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      {submitting ? (
                        <>Publishing...</>
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> Submit Review
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>

            {/* Reviews Feed List */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Community Feedback ({data.reviews.length})
              </h3>

              {loading ? (
                <div className="text-center py-8 text-xs text-stone-400 animate-pulse">
                  Loading artisan reviews...
                </div>
              ) : data.reviews.length === 0 ? (
                <div className="text-center py-8 bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <MessageSquare className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    No reviews yet for this creation
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Be the first artisan lover to leave a rating and photo!
                  </p>
                </div>
              ) : (
                data.reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800/80 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D46211] to-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {rev.userName ? rev.userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                              {rev.userName}
                            </span>
                            {rev.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {new Date(rev.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-stone-300 dark:text-stone-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                      {rev.comment}
                    </p>

                    {/* User photo if attached */}
                    {rev.photo && (
                      <div className="pt-1">
                        <img
                          src={rev.photo}
                          alt="Customer review photo"
                          onClick={() => setLightboxImage(rev.photo || null)}
                          className="w-24 h-24 object-cover rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={lightboxImage}
              alt="Zoomed customer photo"
              className="w-full h-full object-contain max-h-[85vh]"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
