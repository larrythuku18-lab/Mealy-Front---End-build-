import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { apiGetReviews } from "../../api";

// Module-level cache so rating lookups don't refetch on every remount
// (e.g. when switching FullMenu categories).
const cache = new Map();

function MealRating({ mealId }) {
  const [data, setData] = useState(() => cache.get(mealId) || null);

  useEffect(() => {
    if (data) return;
    let cancelled = false;

    apiGetReviews(mealId)
      .then((res) => {
        const reviews = (res.reviews || []).filter(
          (r) => Number(r.rating) > 0
        );
        const entry = {
          average: reviews.length
            ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
              reviews.length
            : 0,
          count: reviews.length,
        };
        // Only cache non-empty results so new reviews show up on later visits
        if (entry.count > 0) cache.set(mealId, entry);
        if (!cancelled) setData(entry);
      })
      .catch(() => {
        // No reviews / backend unavailable — render nothing
      });

    return () => {
      cancelled = true;
    };
  }, [mealId, data]);

  if (!data || data.count === 0) return null;

  return (
    <span
      className="meal-rating meal-rating--reviews"
      title={`${data.average.toFixed(1)} stars from ${data.count} review${data.count > 1 ? "s" : ""}`}
    >
      <Star size={12} strokeWidth={2.5} />
      <p>
        {data.average.toFixed(1)} ({data.count})
      </p>
    </span>
  );
}

export default MealRating;