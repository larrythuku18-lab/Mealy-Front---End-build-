import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDailyOptions } from "../../contexts/DailyOptionsContext";
import FoodIllustration from "../ui/FoodIllustration";
import MealRating from "../MealRating/MealRating";
import "./DishSlideshow.css";

const AUTO_ADVANCE_MS = 5000;
const MAX_SLIDES = 8;

/** Auto-advancing promo carousel for today's published dishes. */
function DishSlideshow() {
  const { options } = useDailyOptions();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = options.slice(0, MAX_SLIDES);

  const goTo = useCallback(
    (next) => {
      const len = slides.length;
      if (len === 0) return;
      setIndex(((next % len) + len) % len);
    },
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  // Clamp at render time (rather than correcting state in an effect) in
  // case the underlying list shrinks, e.g. after a re-fetch.
  const safeIndex = index < slides.length ? index : 0;
  const slide = slides[safeIndex];

  return (
    <div
      className="dish-slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="dish-slideshow__media">
        {slide.image ? (
          <img src={slide.image} alt={slide.name} />
        ) : (
          <FoodIllustration
            name={slide.name}
            description={slide.description}
            className="dish-slideshow__illustration"
          />
        )}
        <div className="dish-slideshow__scrim" />
      </div>

      <div className="dish-slideshow__content">
        <span className="dish-slideshow__eyebrow">Featured Today</span>
        <h2 className="dish-slideshow__name">{slide.name}</h2>
        {slide.description && (
          <p className="dish-slideshow__description">{slide.description}</p>
        )}
        <div className="dish-slideshow__meta">
          <span className="dish-slideshow__price">
            KSh {slide.price.toLocaleString()}
          </span>
          <MealRating mealId={slide.id} />
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="dish-slideshow__nav dish-slideshow__nav--prev"
            onClick={() => goTo(safeIndex - 1)}
            aria-label="Previous dish"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="dish-slideshow__nav dish-slideshow__nav--next"
            onClick={() => goTo(safeIndex + 1)}
            aria-label="Next dish"
          >
            <ChevronRight size={20} />
          </button>

          <div className="dish-slideshow__dots">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`dish-slideshow__dot ${
                  i === safeIndex ? "dish-slideshow__dot--active" : ""
                }`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${s.name}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DishSlideshow;
