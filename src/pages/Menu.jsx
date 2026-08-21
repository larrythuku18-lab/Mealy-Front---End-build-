import DailyMealOptionCard from "../components/DailyMealOptionCard/DailyMealOptionCard";
import Navbar from "../components/Navbar/Navbar";
import OrderHistoryCard from "../components/OrderHistoryCard/OrderHistoryCard";

function Menu() {
  return (
    <>
      <Navbar />
      <div className="menu-header">
        <span className="eyebrow">Today's Selection</span>
        <h1>Monday, October 14</h1>
      </div>

      <div className="current-choice">
        <div className="current-choice-icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div className="current-choice-body">
          <span className="label">Current Choice(s)</span>
          <span className="subtotal">Subtotal: Kes. 1,500</span>
        </div>
        <button className="btn-primary btn-primary--inline">
          Confirm &amp; Place Order
        </button>
      </div>
      <DailyMealOptionCard />
      <OrderHistoryCard />
    </>
  );
}

export default Menu;
