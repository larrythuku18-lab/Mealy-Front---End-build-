import Navbar from "../components/Navbar/Navbar";
import { Heart } from "lucide-react";
import "./Favorites.css";

function Favorites() {
  // TODO: integrate with backend / context to load real favorites
  const favorites = [];

  return (
    <div className="page">
      <Navbar />
      <main className="favorites-page">
        <div className="favorites-container">
          <div className="favorites-header">
            <h1>My Favorites</h1>
            <p>Meals you've saved for later</p>
          </div>

          {favorites.length > 0 ? (
            <div className="favorites-list">
              {favorites.map((meal) => (
                <div key={meal.id} className="favorite-card">
                  <img src={meal.image} alt={meal.name} className="favorite-card-img" />
                  <div className="favorite-card-info">
                    <span className="favorite-card-name">{meal.name}</span>
                    <span className="favorite-card-price">
                      KSh {meal.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="favorites-empty">
              <div className="favorites-empty-icon">
                <Heart size={32} />
              </div>
              <h3>No favorites yet</h3>
              <p>Tap the heart icon on any meal to save it here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Favorites;
