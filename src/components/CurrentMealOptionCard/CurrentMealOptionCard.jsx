import { Star } from "lucide-react";
import "./CurrentMealOptionCard.css";

function CurrentMealOptionCard({ rating = 4.5, totalReviews = 52 }) {
  const renderStars = (val) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(val)) {
        stars.push(
          <Star
            key={i}
            size={16}
            fill="var(--color-primary)"
            stroke="var(--color-primary)"
          />
        );
      } else if (i === Math.ceil(val) && val % 1 !== 0) {
        stars.push(
          <div key={i} style={{ position: "relative", display: "inline-flex" }}>
            <Star size={16} fill="none" stroke="var(--color-surface-hover)" />
            <div style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden", display: "inline-flex" }}>
              <Star size={16} fill="var(--color-primary)" stroke="var(--color-primary)" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={16}
            fill="none"
            stroke="var(--color-surface-hover)"
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="current-option">
      <div className="content">
        <h3>Chicken with Fries</h3>
        <p>
          Grilled chicken breast accompanied by sweet potato fries and herb
          aioli.
        </p>
        <div className="ratings">
          {renderStars(rating)}
          <p>({totalReviews})</p>
        </div>
        <p>KSh 1,050</p>
      </div>
    </div>
  );
}

export default CurrentMealOptionCard;
