import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navLinks, filterCategoryByLabel } from '../data/navLinks';
import { filterCategories } from '../data/filterCategories';
import { useFilters } from '../context/FilterContext';
import '../styles/filter-dropdown.css';

export default function Navbar() {
  const {
    pendingFilters,
    openCategory,
    setOpenCategory,
    toggleValue,
    applyFilters,
    resetFilters,
    fetchUnsplashImages,
  } = useFilters();

  const arrowRefs = useRef({});
  const dropdownRefs = useRef({});
  const navRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!openCategory) return;
    const arrow = arrowRefs.current[openCategory];
    const dropdown = dropdownRefs.current[openCategory];
    if (!arrow || !dropdown) return;
    const rect = arrow.getBoundingClientRect();
    setPos({
      top: rect.bottom + 10,
      left: rect.left - dropdown.offsetWidth / 2 + rect.width / 2,
    });
  }, [openCategory]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (e.target.closest('.filter-arrow-wrapper') || e.target.closest('.filter-dropdown')) return;
      setOpenCategory(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [setOpenCategory]);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="logo">
        <img src="/Images/Logo.png" alt="Rock Creative Agency" />
      </div>
      <ul className="nav-links">
        {navLinks.map((link) => {
          const category = filterCategoryByLabel[link.label];
          return (
            <li key={link.to} style={{ display: 'flex', alignItems: 'center' }}>
              <NavLink to={link.to} end={link.to === '/'} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {link.label}
              </NavLink>
              {category && (
                <span
                  className="filter-arrow-wrapper"
                  onClick={() => setOpenCategory(openCategory === category ? null : category)}
                >
                  <span
                    ref={(el) => (arrowRefs.current[category] = el)}
                    className={`filter-arrow${openCategory === category ? ' rotated' : ''}`}
                  >
                    &#9662;
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {Object.entries(filterCategories).map(([key, category]) => (
        <div
          key={key}
          ref={(el) => (dropdownRefs.current[key] = el)}
          className={`filter-dropdown${openCategory === key ? ' active' : ''}`}
          style={openCategory === key ? { top: `${pos.top}px`, left: `${pos.left}px` } : undefined}
        >
          <div className="filter-title">{category.label}</div>
          <div className="filter-options">
            {category.options.map((option) => (
              <label key={option.value}>
                <input
                  type="checkbox"
                  checked={pendingFilters[key].includes(option.value)}
                  onChange={() => toggleValue(key, option.value)}
                />
                {' ' + option.label}
              </label>
            ))}
          </div>
          <div className="filter-actions">
            <button type="button" className="filter-apply-btn" onClick={applyFilters}>
              Apply Filters
            </button>
            <button type="button" className="filter-reset-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
          <div className="filter-api-section">
            <div className="filter-category-title">🔴 Live Industry Inspiration</div>
            <p className="filter-api-subtext">Fetch real creative industry photos from Unsplash</p>
            <button
              type="button"
              className="filter-api-btn"
              onClick={() => fetchUnsplashImages(key)}
            >
              🌐 Load Creative Inspiration
            </button>
          </div>
        </div>
      ))}
    </nav>
  );
}
