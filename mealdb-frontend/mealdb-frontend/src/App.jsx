import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavouritesProvider } from './context/FavouritesContext';
import { connectWebSocket }   from './services/websocket';
import Navbar      from './components/Navbar.jsx';
import Toast       from './components/Toast.jsx';
import Home        from './pages/Home.jsx';
import MealDetail  from './pages/MealDetail.jsx';
import Favourites  from './pages/Favourites.jsx';

export default function App() {
  const [toast, setToast] = useState(null);

  // Connect WebSocket and listen for favourite broadcasts
  useEffect(() => {
    let client;
    try {
      client = connectWebSocket((msg) => setToast(msg));
    } catch {
      // WebSocket optional — app works without it
    }
    return () => { try { client?.deactivate(); } catch {} };
  }, []);

  return (
    <BrowserRouter>
      <FavouritesProvider>
        <Navbar />

        <Routes>
          <Route path="/"          element={<Home />}       />
          <Route path="/meal/:id"  element={<MealDetail />} />
          <Route path="/favourites" element={<Favourites />} />
          {/* Catch-all → home */}
          <Route path="*"          element={<Home />}       />
        </Routes>

        {/* WebSocket toast notification */}
        {toast && (
          <Toast message={toast} onDismiss={() => setToast(null)} />
        )}
      </FavouritesProvider>
    </BrowserRouter>
  );
}
