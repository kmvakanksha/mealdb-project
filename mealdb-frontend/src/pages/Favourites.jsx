import { useNavigate } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import './Favourites.css';

export default function Favourites() {
  const { favourites, loading, toggle } = useFavourites();
  const navigate = useNavigate();

  if (loading) return (
    <div className="favpage container">
      <div className="skeleton" style={{ height: 40, width: 240, marginBottom: 32, borderRadius: 2 }} />
      <div className="favpage__grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="fav-item-skeleton">
            <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 4 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 18, marginBottom: 8, borderRadius: 2 }} />
              <div className="skeleton" style={{ height: 12, width: '50%', borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="favpage container">

      {/* Header */}
      <div className="favpage__header">
        <div>
          <p className="favpage__eyebrow">Your collection</p>
          <h1 className="favpage__title">Favourites</h1>
        </div>
        {favourites.length > 0 && (
          <span className="favpage__count">{favourites.length} saved</span>
        )}
      </div>

      {/* Empty state */}
      {favourites.length === 0 && (
        <div className="favpage__empty">
          <span className="favpage__empty-icon">♡</span>
          <h2>Nothing saved yet</h2>
          <p>Discover meals and tap the heart to save your favourites here.</p>
          <button
            className="favpage__discover-btn"
            onClick={() => navigate('/')}
          >
            Discover Meals
          </button>
        </div>
      )}

      {/* List */}
      {favourites.length > 0 && (
        <ul className="favpage__list">
          {favourites.map((fav, i) => (
            <li
              key={fav.id || fav.mealId}
              className="favpage__item fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Thumbnail */}
              <div
                className="favpage__thumb"
                onClick={() => navigate(`/meal/${fav.mealId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/meal/${fav.mealId}`)}
              >
                <img src={fav.mealThumb} alt={fav.mealName} loading="lazy" />
              </div>

              {/* Info */}
              <div
                className="favpage__info"
                onClick={() => navigate(`/meal/${fav.mealId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/meal/${fav.mealId}`)}
              >
                <h3 className="favpage__meal-name">{fav.mealName}</h3>
                <div className="favpage__meta">
                  {fav.category && <span>{fav.category}</span>}
                  {fav.area     && <span>{fav.area}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="favpage__actions">
                <button
                  className="favpage__view-btn"
                  onClick={() => navigate(`/meal/${fav.mealId}`)}
                >
                  View →
                </button>
                <button
                  className="favpage__remove-btn"
                  onClick={() => toggle({ idMeal: fav.mealId, strMeal: fav.mealName, strMealThumb: fav.mealThumb, strCategory: fav.category, strArea: fav.area })}
                  aria-label="Remove from favourites"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
