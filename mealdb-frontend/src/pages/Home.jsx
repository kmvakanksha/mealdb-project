import { useState, useEffect, useCallback } from 'react';
import SearchBar       from '../components/SearchBar.jsx';
import CategoryFilter  from '../components/CategoryFilter.jsx';
import MealCard        from '../components/MealCard.jsx';
import { searchMeals, filterByCategory, getLeastIngredients } from '../services/mealApi';
import './Home.css';

const PLACEHOLDERS = ['Arrabiata', 'Chicken', 'Pasta', 'Sushi', 'Curry'];

export default function Home() {
  const [meals,      setMeals]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [category,   setCategory]   = useState(null);
  const [query,      setQuery]      = useState('');
  const [leastMeal,  setLeastMeal]  = useState(null);
  const [leastCount, setLeastCount] = useState(null);

  // On first load — fetch the hackathon "least ingredients" feature
  useEffect(() => {
    getLeastIngredients('Arrabiata')
      .then((data) => {
        setLeastMeal(data.meal);
        setLeastCount(data.ingredientCount);
      })
      .catch(() => {});
  }, []);

  const doSearch = useCallback(async (term) => {
    if (!term) { setMeals([]); setQuery(''); return; }
    setQuery(term);
    setCategory(null);
    setLoading(true);
    setError(null);
    try {
      const data = await searchMeals(term);
      setMeals(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  const doFilter = useCallback(async (cat) => {
    setCategory(cat);
    setQuery('');
    if (!cat) { setMeals([]); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await filterByCategory(cat);
      setMeals(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load category meals.');
    } finally {
      setLoading(false);
    }
  }, []);

  const showHero = !query && !category;

  return (
    <main className="home">

      {/* ── Hero ─────────────────────────────────────────── */}
      {showHero && (
        <section className="home__hero">
          <div className="container">
            <p className="home__hero-eyebrow">Discover · Cook · Savour</p>
            <h1 className="home__hero-title">
              Every recipe<br />
              <em>you'll ever need.</em>
            </h1>
            <p className="home__hero-sub">
              Search thousands of meals from around the world.
              Save your favourites. Cook with confidence.
            </p>
          </div>
        </section>
      )}

      {/* ── Search & Filter ──────────────────────────────── */}
      <section className="home__controls container">
        <SearchBar onSearch={doSearch} loading={loading} />
        <CategoryFilter selected={category} onChange={doFilter} />
      </section>

      {/* ── Least Ingredients Feature Card ───────────────── */}
      {showHero && leastMeal && (
        <section className="container">
          <div className="home__feature">
            <div className="home__feature-badge">⚡ Simplest Recipe</div>
            <div className="home__feature-body">
              <img src={leastMeal.strMealThumb} alt={leastMeal.strMeal} />
              <div className="home__feature-info">
                <p className="home__feature-eyebrow">Fewest Ingredients Pick</p>
                <h2 className="home__feature-title">{leastMeal.strMeal}</h2>
                <p className="home__feature-meta">
                  Only <strong>{leastCount}</strong> ingredients needed ·{' '}
                  {leastMeal.strCategory} · {leastMeal.strArea}
                </p>
                <a
                  href={`/meal/${leastMeal.idMeal}`}
                  className="home__feature-btn"
                >
                  View Recipe →
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Results grid ─────────────────────────────────── */}
      <section className="home__results container">
        {/* Heading */}
        {(query || category) && (
          <div className="home__results-header">
            <h2 className="home__results-title">
              {query   && `Results for "${query}"`}
              {category && `${category} meals`}
            </h2>
            {meals.length > 0 && (
              <span className="home__results-count">{meals.length} found</span>
            )}
          </div>
        )}

        {/* States */}
        {loading && <MealGridSkeleton />}

        {error && <p className="home__error">{error}</p>}

        {!loading && !error && meals.length === 0 && (query || category) && (
          <div className="home__empty">
            <span>🍽</span>
            <p>No meals found. Try a different search.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && meals.length > 0 && (
          <div className="home__grid">
            {meals.map((meal, i) => (
              <MealCard key={meal.idMeal} meal={meal} index={i} />
            ))}
          </div>
        )}

        {/* Landing suggestions */}
        {showHero && !loading && (
          <div className="home__suggestions">
            <p className="home__suggestions-label">Popular searches</p>
            <div className="home__suggestions-pills">
              {PLACEHOLDERS.map((term) => (
                <button
                  key={term}
                  className="home__suggestion"
                  onClick={() => doSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function MealGridSkeleton() {
  return (
    <div className="home__grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="meal-card-skeleton">
          <div className="skeleton" style={{ paddingTop: '72%' }} />
          <div style={{ padding: '16px' }}>
            <div className="skeleton" style={{ height: 18, marginBottom: 8, borderRadius: 2 }} />
            <div className="skeleton" style={{ height: 12, width: '60%', borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
