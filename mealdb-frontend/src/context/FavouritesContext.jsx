import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFavourites, toggleFavourite } from '../services/mealApi';

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);   // array of Favourite objects
  const [loading, setLoading]       = useState(true);

  // Load all favourites from MySQL on mount
  useEffect(() => {
    getFavourites()
      .then(setFavourites)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Check if a mealId is in the local favourites list (no extra API call needed)
  const isFavourite = useCallback(
    (mealId) => favourites.some((f) => f.mealId === mealId),
    [favourites]
  );

  // Toggle and immediately reflect in UI (optimistic update)
  const toggle = useCallback(async (meal) => {
    const payload = {
      mealId:    meal.idMeal,
      mealName:  meal.strMeal,
      mealThumb: meal.strMealThumb,
      category:  meal.strCategory,
      area:      meal.strArea,
    };

    try {
      const { action } = await toggleFavourite(payload);
      if (action === 'added') {
        setFavourites((prev) => [...prev, { ...payload, id: Date.now() }]);
      } else {
        setFavourites((prev) => prev.filter((f) => f.mealId !== meal.idMeal));
      }
      return action;
    } catch (err) {
      console.error('Toggle favourite failed', err);
    }
  }, []);

  return (
    <FavouritesContext.Provider value={{ favourites, loading, isFavourite, toggle, setFavourites }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used inside FavouritesProvider');
  return ctx;
};
