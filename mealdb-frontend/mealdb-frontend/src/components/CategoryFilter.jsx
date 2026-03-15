import { useEffect, useState } from 'react';
import { getCategories } from '../services/mealApi';
import './CategoryFilter.css';

export default function CategoryFilter({ selected, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data?.categories || []))
      .catch(console.error);
  }, []);

  return (
    <div className="catfilter">
      <p className="catfilter__label">Filter by category</p>
      <div className="catfilter__scroll">
        <button
          className={`catfilter__pill ${!selected ? 'active' : ''}`}
          onClick={() => onChange(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.idCategory}
            className={`catfilter__pill ${selected === cat.strCategory ? 'active' : ''}`}
            onClick={() => onChange(cat.strCategory)}
          >
            {cat.strCategory}
          </button>
        ))}
      </div>
    </div>
  );
}
