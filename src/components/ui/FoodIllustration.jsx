import { useState } from "react";
import useFoodImage from "../../hooks/useFoodImage";
import SvgFoodIllustration from "./SvgFoodIllustration";
import "./FoodIllustration.css";

/**
 * FoodIllustration – Fetches and displays a real food photograph from the
 * Pexels API based on the meal's name and description.
 *
 * Shows a loading skeleton while fetching, and falls back to a generated
 * SVG illustration (SvgFoodIllustration) if no API key is configured or
 * the fetch/image load fails — a drawn scene reads much better than a
 * plain colored letter.
 */

function LoadingSkeleton({ className }) {
  return (
    <div className={`food-img-skeleton ${className || ""}`}>
      <div className="food-img-skeleton__shimmer" />
    </div>
  );
}

function LoadedImage({ src, alt, description, className }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <SvgFoodIllustration name={alt} description={description} className={className} />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`food-img-real ${className || ""}`}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

export default function FoodIllustration({ name, description, className }) {
  const { imageUrl, loading } = useFoodImage(name, description);

  if (loading) {
    return <LoadingSkeleton className={className} />;
  }

  if (imageUrl) {
    return (
      <LoadedImage
        src={imageUrl}
        alt={name || "Food"}
        description={description}
        className={className}
      />
    );
  }

  return <SvgFoodIllustration name={name} description={description} className={className} />;
}
