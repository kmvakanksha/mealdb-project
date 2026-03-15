import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMealById } from '../services/mealApi';
import { useFavourites } from '../context/FavouritesContext';
import './MealDetail.css';

export default function MealDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { isFavourite, toggle } = useFavourites();

  const [meal,     setMeal]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMealById(id)
      .then(setMeal)
      .catch(() => setError('Meal not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (error || !meal) return (
    <div className="detail-error container">
      <p>{error || 'Meal not found.'}</p>
      <button onClick={() => navigate(-1)}>← Go back</button>
    </div>
  );

  // Extract non-blank ingredients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing  = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push({ ingredient: ing.trim(), measure: meas?.trim() || '' });
    }
  }

  const fav = isFavourite(meal.idMeal);

  async function handleToggle() {
    setToggling(true);
    await toggle(meal);
    setToggling(false);
  }

  return (
    <main className="detail">

      {/* Back */}
      <div className="detail__back container">
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="detail__layout container">

        {/* LEFT — image + meta */}
        <aside className="detail__aside fade-up">
          <div className="detail__img-wrap">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
          </div>

          {/* Tags */}
          <div className="detail__tags">
            {meal.strCategory && <span className="detail__tag">{meal.strCategory}</span>}
            {meal.strArea     && <span className="detail__tag">{meal.strArea}</span>}
            {meal.strTags && meal.strTags.split(',').map((t) => (
              <span key={t} className="detail__tag detail__tag--muted">{t.trim()}</span>
            ))}
          </div>

          {/* Actions */}
          <button
            className={`detail__fav-btn ${fav ? 'active' : ''}`}
            onClick={handleToggle}
            disabled={toggling}
          >
            {fav ? '♥ Saved to Favourites' : '♡ Save to Favourites'}
          </button>

          {meal.strYoutube && (
            <a
              className="detail__yt-btn"
              href={meal.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ Watch on YouTube
            </a>
          )}
        </aside>

        {/* RIGHT — details */}
        <div className="detail__main fade-up" style={{ animationDelay: '80ms' }}>
          <h1 className="detail__title">{meal.strMeal}</h1>

          {/* Ingredients */}
          <section className="detail__section">
            <h2 className="detail__section-title">
              Ingredients
              <span className="detail__ingr-count">{ingredients.length}</span>
            </h2>
            <ul className="detail__ingredients">
              {ingredients.map(({ ingredient, measure }, i) => (
                <li key={i} className="detail__ingredient">
                  <img
                    src={`https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredient)}-Small.png`}
                    alt={ingredient}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="detail__ingredient-name">{ingredient}</span>
                  {measure && (
                    <span className="detail__ingredient-measure">{measure}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="detail__section">
            <h2 className="detail__section-title">Instructions</h2>
            <div className="detail__instructions">
              {meal.strInstructions
                .split(/\r?\n/)
                .filter((p) => p.trim())
                .map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function DetailSkeleton() {
  return (
    <div className="detail container" style={{ paddingTop: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 48 }}>
        <div>
          <div className="skeleton" style={{ paddingTop: '100%', borderRadius: 4 }} />
        </div>
        <div>
          <div className="skeleton" style={{ height: 48, marginBottom: 24, borderRadius: 2 }} />
          <div className="skeleton" style={{ height: 20, marginBottom: 12, borderRadius: 2 }} />
          <div className="skeleton" style={{ height: 20, width: '70%', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}
