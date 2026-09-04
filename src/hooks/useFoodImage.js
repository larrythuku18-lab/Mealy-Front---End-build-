import { useState, useEffect, useRef } from "react";
import { fetchFoodImage } from "../utils/pexelsImages";

/**
 * React hook for fetching a real food image from Pexels.
 *
 * Returns { imageUrl, loading } where imageUrl is the photo URL or null.
 *
 * Usage:
 *   const { imageUrl, loading } = useFoodImage(meal.name, meal.description);
 */
export default function useFoodImage(name, description, enabled = true) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(() => enabled && !!name);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!enabled || !name) {
      // Avoid synchronous setState by scheduling it
      const id = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(id);
    }

    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current();
    }

    let cancelled = false;
    abortRef.current = () => {
      cancelled = true;
    };

    fetchFoodImage(name, description).then((url) => {
      if (!cancelled) {
        setImageUrl(url);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [name, description, enabled]);

  return { imageUrl, loading };
}
