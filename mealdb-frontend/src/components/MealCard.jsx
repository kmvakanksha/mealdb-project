import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import './MealCard.css';

export default function MealCard({ meal, index = 0 }) {
  const navigate = useNavigate();
  const { isFavourite, toggle } = useFavourites();
  const [toggling, setToggling] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const fav = isFavourite(meal.idMeal);

  async function handleToggle(e) {
    e.stopPropagation();
    setToggling(true);
    await toggle(meal);
    setToggling(false);
  }

  return (
    <article
      className="meal-card fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => navigate(`/meal/${meal.idMeal}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/meal/${meal.idMeal}`)}
    >
      {/* Image */}
      <div className="meal-card__img-wrap">
        {!imgLoaded && <div className="skeleton meal-card__skeleton" />}
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className={`meal-card__img ${imgLoaded ? 'loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        {/* Category pill */}
        {meal.strCategory && (
          <span className="meal-card__cat">{meal.strCategory}</span>
        )}
        {/* Favourite button */}
        <button
          className={`meal-card__fav ${fav ? 'active' : ''} ${toggling ? 'toggling' : ''}`}
          onClick={handleToggle}
          aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
        >
          {fav ? '♥' : '♡'}
        </button>
      </div>

      {/* Info */}
      <div className="meal-card__body">
        <h3 className="meal-card__title">{meal.strMeal}</h3>
        {meal.strArea && (
          <p className="meal-card__area">{meal.strArea} cuisine</p>
        )}
        <span className="meal-card__cta">View recipe →</span>
      </div>
    </article>
  );
}
