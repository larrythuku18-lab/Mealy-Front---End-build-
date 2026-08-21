import "./DailyMealOptionCard.css";

function DailyMealOptionCard() {
  return (
    <section className="daily-options">
      <h2>Daily Options</h2>
      <div className="daily-options-grid">
        <article className="daily-option selected">
          <div className="image-placeholder"></div>
          <div>
            <p className="meal-name">Beef with Rice</p>
            <p className="meal-description">
              Tender beef slices served over brown jasmin rice with steamed
              broccoli.
            </p>
          </div>
          <div className="quantity-stepper">
            <span className="meal-price">Kes. 1,050</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button type="button" aria-label="Decrease quantity">
                −
              </button>
              <span>2</span>
              <button type="button" aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>
        </article>

        <article className="daily-option">
          <div className="image-placeholder"></div>
          <div>
            <p className="meal-name">Chicken with Fries</p>
            <p className="meal-description">
              Grilled chicken breast accompanied by sweet potato fries and herb
              aioli.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <span className="meal-price">Kes. 1,050</span>
            <button type="button" className="add-meal-btn">
              Add Meal
            </button>
          </div>
        </article>

        <article className="daily-option">
          <div className="image-placeholder"></div>
          <div>
            <p className="meal-name">Veggie Pasta</p>
            <p className="meal-description">
              Whole wheat penne with fresh cherry tomatoes, basil, and light
              parmesan.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <span className="meal-price">Kes. 1,200</span>
            <button type="button" className="add-meal-btn">
              Add Meal
            </button>
          </div>
        </article>

        <article className="daily-option">
          <div className="image-placeholder"></div>
          <div>
            <p className="meal-name">Salmon Teriyaki</p>
            <p className="meal-description">
              Salmon fillet glazed with teriyaki sauce, served with roasted bok
              choy.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <span className="meal-price">Kes. 2,000</span>
            <button type="button" className="add-meal-btn">
              Add Meal
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

export default DailyMealOptionCard;
