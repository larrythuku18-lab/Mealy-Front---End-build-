import { Star } from "lucide-react";
import "./CurrentMealOptionCard.css";

function CurrentMealOptionCard() {
  return (
    <div className="current-option">
      <div className="content">
        <h3>Chicken with Fries</h3>
        <p>
          Grilled chicken breast accompanied by sweet potato fries and herb
          aioli.
        </p>
        <div className="ratings">
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
          <p>(52)</p>
        </div>
        <p>KSh 1,050</p>
      </div>
    </div>
  );
}

export default CurrentMealOptionCard;
