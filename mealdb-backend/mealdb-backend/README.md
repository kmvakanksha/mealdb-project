# MealDB Frontend

React frontend for the MealDB hackathon project.

## Stack
- React 18 + Vite
- React Router v6
- STOMP/SockJS for WebSocket
- CSS Modules (no Tailwind dependency)

## Setup

```bash
npm install
npm run dev        # starts on http://localhost:5173
```

Make sure the Spring Boot backend is running on port 8080.

## Build & Deploy (Vercel)

```bash
npm run build
```

Set `VITE_API_URL` in Vercel to your deployed backend URL.

## Pages

| Route           | Description                  |
|-----------------|------------------------------|
| `/`             | Home — search + category filter + least-ingredients feature |
| `/meal/:id`     | Full meal detail with ingredients & instructions |
| `/favourites`   | Saved favourites from MySQL  |

## API Endpoints used

| Method | Endpoint                          | Used in             |
|--------|-----------------------------------|---------------------|
| GET    | `/api/meals/search?name=`         | Home search         |
| GET    | `/api/meals/:id`                  | MealDetail          |
| GET    | `/api/meals/category?name=`       | CategoryFilter      |
| GET    | `/api/meals/categories`           | CategoryFilter pill list |
| GET    | `/api/meals/least-ingredients`    | Home hero feature   |
| GET    | `/api/favourites`                 | Favourites page     |
| POST   | `/api/favourites/toggle`          | Heart button        |
