import Navbar from "../components/Navbar/Navbar";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import FoodIllustration from "../components/ui/FoodIllustration";
import "./Favorites.css";

function Favorites() {
  const { items: favorites, removeFavorite } = useFavorites();

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
                  {meal.image ? (
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="favorite-card-img"
                    />
                  ) : (
                    <FoodIllustration
                      name={meal.name}
                      description={meal.description}
                      className="favorite-card-img"
                    />
                  )}
                  <div className="favorite-card-info">
                    <div className="favorite-card-text">
                      <span className="favorite-card-name">{meal.name}</span>
                      {meal.price != null && (
                        <span className="favorite-card-price">
                          KSh {Number(meal.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="favorite-remove"
                      aria-label={`Remove ${meal.name} from favorites`}
                      title="Remove from favorites"
                      onClick={() => removeFavorite(meal.id)}
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
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
