import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import {
  apiAddFavorite,
  apiRemoveFavorite,
  apiListFavorites,
} from "../api";

const STORAGE_KEY = "mealy_favorites";

const FavoritesContext = createContext(null);

/** Best-effort normalization of an entry returned by the favorites endpoint. */
function normalizeEntry(entry = {}) {
  const raw = entry.meal_option ?? entry.mealOption ?? entry;
  const id = Number(entry.meal_option_id ?? entry.mealOptionId ?? raw.id ?? raw.id);
  return {
    id,
    name: entry.name ?? raw.name,
    price: entry.price ?? raw.price,
    image: entry.image ?? raw.image,
    description: entry.description ?? raw.description,
  };
}

function readStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(readStorage);

  const persist = useCallback((next) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable — favorites still work for this session
    }
  }, []);

  const ids = items.map((f) => f.id);

  const isFavorite = useCallback(
    (id) => ids.some((favId) => Number(favId) === Number(id)),
    [ids]
  );

  const removeFavorite = useCallback(
    (id) => {
      persist(items.filter((f) => Number(f.id) !== Number(id)));
      // Best-effort backend delete; ignore failures (local storage remains source of truth)
      apiRemoveFavorite(id).catch(() => {});
    },
    [items, persist]
  );

  const toggleFavorite = useCallback(
    (option) => {
      const snapshot = {
        id: option.id,
        name: option.name,
        price: option.price,
        image: option.image,
        description: option.description,
      };

      if (isFavorite(option.id)) {
        removeFavorite(option.id);
      } else {
        persist([...items, snapshot]);
        // Best-effort backend add; ignore failures (local storage remains source of truth)
        apiAddFavorite(option.id).catch(() => {});
      }
    },
    [items, isFavorite, removeFavorite, persist]
  );

  /** Pull favorites from the backend once when a user signs in, merging with local. */
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    apiListFavorites()
      .then((data) => {
        if (cancelled) return;
        const serverList = data.favorites ?? data.items ?? [];
        const serverItems = serverList
          .map(normalizeEntry)
          .filter((f) => f.id && f.name);
        const merged = [...items];
        serverItems.forEach((serverItem) => {
          const idx = merged.findIndex(
            (f) => Number(f.id) === Number(serverItem.id)
          );
          if (idx === -1) {
            merged.push(serverItem);
          } else {
            merged[idx] = { ...merged[idx], ...serverItem };
          }
        });
        persist(merged);
      })
      .catch(() => {
        // Backend has no favorites support yet — keep using local storage
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    items,
    ids,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
