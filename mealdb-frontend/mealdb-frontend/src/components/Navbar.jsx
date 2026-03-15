import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import './Navbar.css';

export default function Navbar() {
  const { favourites } = useFavourites();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">

        {/* Logo */}
        <button className="navbar__logo" onClick={() => navigate('/')}>
          <span className="navbar__logo-icon">🍽</span>
          <span className="navbar__logo-text">
            Meal<em>DB</em>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="navbar__links">
          <NavLink to="/"           className={({ isActive }) => isActive ? 'active' : ''} end>Discover</NavLink>
          <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>Categories</NavLink>
          <NavLink to="/favourites" className={({ isActive }) => isActive ? 'active' : ''}>
            Favourites
            {favourites.length > 0 && (
              <span className="navbar__badge">{favourites.length}</span>
            )}
          </NavLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`navbar__burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          <NavLink to="/"           onClick={() => setMenuOpen(false)} end>Discover</NavLink>
          <NavLink to="/categories" onClick={() => setMenuOpen(false)}>Categories</NavLink>
          <NavLink to="/favourites" onClick={() => setMenuOpen(false)}>
            Favourites {favourites.length > 0 && `(${favourites.length})`}
          </NavLink>
        </div>
      )}
    </header>
  );
}
