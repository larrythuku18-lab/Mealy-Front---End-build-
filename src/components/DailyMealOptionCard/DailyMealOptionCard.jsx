import "./DailyMealOptionCard.css";

function DailyMealOptionCard({ meal, onAddToOrder }) {
  return (
    <div className="meal-card">
      <div className="meal-card-image">
        <img src={meal.image} alt={meal.name} />
        {!meal.available && <div className="meal-card-overlay">Unavailable</div>}
      </div>
      <div className="meal-card-body">
        <div className="meal-card-info">
          <h3 className="meal-card-name">{meal.name}</h3>
          <p className="meal-card-desc">{meal.description}</p>
          <span className="meal-card-category">{meal.category}</span>
        </div>
        <div className="meal-card-footer">
          <span className="meal-card-price">KSh {meal.price.toFixed(2)}</span>
          {meal.available && (
            <button className="btn-primary btn-primary--inline" onClick={() => onAddToOrder(meal)}>
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyMealOptionCard;
