import { useState, useRef } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  function handleClear() {
    setValue('');
    onSearch('');
    inputRef.current?.focus();
  }

  return (
    <form className="searchbar" onSubmit={handleSubmit} role="search">
      <div className="searchbar__inner">
        <span className="searchbar__icon">
          {loading ? <span className="searchbar__spinner" /> : '🔍'}
        </span>
        <input
          ref={inputRef}
          className="searchbar__input"
          type="search"
          placeholder="Search any meal… pasta, sushi, curry"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Search meals"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="searchbar__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >✕</button>
        )}
        <button
          type="submit"
          className="searchbar__btn"
          disabled={!value.trim() || loading}
        >
          Search
        </button>
      </div>
    </form>
  );
}
