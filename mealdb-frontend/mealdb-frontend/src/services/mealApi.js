// All communication with the Spring Boot backend lives here.
// In dev, Vite proxies /api → http://localhost:8080
// In prod, set VITE_API_URL in your Vercel environment variables.

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (res.status === 204) return [];               // no content
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json();
}

async function del(path) {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
}

// ── Meal endpoints ───────────────────────────────────────────
export const searchMeals       = (name)     => get(`/meals/search?name=${encodeURIComponent(name)}`);
export const getMealById       = (id)       => get(`/meals/${id}`);
export const filterByCategory  = (cat)      => get(`/meals/category?name=${encodeURIComponent(cat)}`);
export const getCategories     = ()         => get('/meals/categories');
export const getLeastIngredients = (s = 'Arrabiata') => get(`/meals/least-ingredients?s=${encodeURIComponent(s)}`);

// ── Favourite endpoints ──────────────────────────────────────
export const getFavourites     = ()         => get('/favourites');
export const addFavourite      = (meal)     => post('/favourites', meal);
export const removeFavourite   = (mealId)   => del(`/favourites/${mealId}`);
export const toggleFavourite   = (meal)     => post('/favourites/toggle', meal);
export const checkFavourite    = (mealId)   => get(`/favourites/check/${mealId}`);
