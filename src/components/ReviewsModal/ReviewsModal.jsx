import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, X } from "lucide-react";
import { apiCreateReview, apiGetReviews } from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./ReviewsModal.css";

function Stars({ value = 0, size = 14 }) {
  const filled = Math.round(value);
  return (
    <span className="review-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= filled ? "review-star--filled" : "review-star--empty"}
          fill={i <= filled ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Normalize a review regardless of the backend's field names. */
function normalizeReview(r = {}) {
  return {
    rating: Number(r.rating) || 0,
    comment: r.comment || r.review || "",
    author:
      r.user_name ??
      r.customer_name ??
      r.customer?.name ??
      r.user?.name ??
      "Customer",
    date: r.created_at ?? r.date ?? r.createdAt ?? null,
  };
}

function ReviewsModal({ mealOption, onClose }) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [thanks, setThanks] = useState(false);

  const mealId = mealOption?.id;

  const loadReviews = useCallback(async () => {
    if (mealId == null) return;
    setStatus("loading");
    try {
      const data = await apiGetReviews(mealId);
      setReviews((data.reviews || []).map(normalizeReview));
      setStatus("succeeded");
    } catch {
      setStatus("failed");
    }
  }, [mealId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReviews();
  }, [loadReviews]);

  if (mealId == null) return null;

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiCreateReview({
        meal_option_id: mealId,
        rating,
        comment: comment.trim(),
      });
      setComment("");
      setRating(0);
      setThanks(true);
      setTimeout(() => setThanks(false), 3000);
      await loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviews-overlay" onClick={onClose}>
      <div className="reviews-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reviews-modal__header">
          <div className="reviews-modal__title">
            <h3>{mealOption.name}</h3>
            {reviews.length > 0 && (
              <span className="reviews-modal__summary">
                <Stars value={average} size={13} />
                {average.toFixed(1)} ({reviews.length} review
                {reviews.length > 1 ? "s" : ""})
              </span>
            )}
          </div>
          <button
            className="reviews-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="reviews-modal__body">
          {status === "loading" && (
            <p className="reviews-modal__note">Loading reviews...</p>
          )}
          {status === "failed" && (
            <p className="reviews-modal__note">Could not load reviews.</p>
          )}
          {status === "succeeded" && reviews.length === 0 && (
            <p className="reviews-modal__note">
              No reviews yet — be the first to review {mealOption.name}!
            </p>
          )}
          {status === "succeeded" && reviews.length > 0 && (
            <ul className="reviews-list">
              {reviews.map((review, i) => (
                <li key={i} className="review-item">
                  <div className="review-item__top">
                    <Stars value={review.rating} size={12} />
                    <span className="review-item__author">{review.author}</span>
                    {review.date && (
                      <span className="review-item__date">
                        {formatDate(review.date)}
                      </span>
                    )}
                  </div>
                  {review.comment && (
                    <p className="review-item__comment">{review.comment}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {thanks && (
            <p className="reviews-modal__thanks">Thanks for your review!</p>
          )}

          {isAuthenticated ? (
            <form className="review-form" onSubmit={handleSubmit}>
              <span className="review-form__label">Your rating</span>
              <div className="review-form__stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    className={i <= rating ? "is-selected" : ""}
                    onClick={() => setRating(i)}
                    aria-label={`${i} star${i > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={22}
                      fill={i <= rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
              <textarea
                className="review-form__comment"
                placeholder={`How was ${mealOption.name}?`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              {error && <p className="reviews-modal__error">{error}</p>}
              <button
                type="submit"
                className="review-form__submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className="reviews-modal__note">
              <Link to="/login">Log in</Link> to leave a review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewsModal;