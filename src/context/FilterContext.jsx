import { createContext, useContext, useEffect, useState } from 'react';

const FilterContext = createContext(null);

const emptyFilters = { team: [], projects: [], services: [] };

function loadFilters() {
  try {
    const saved = localStorage.getItem('navFilters');
    return saved ? JSON.parse(saved) : emptyFilters;
  } catch {
    return emptyFilters;
  }
}

// Ports NavigationFilter's filter state + the Unsplash "Live Industry Inspiration"
// panel from Javascript/filter dropdown.js into React state shared via context, so
// the Navbar's dropdown checkboxes and each page's cards/team members/services stay
// in sync without any direct DOM querying.
export function FilterProvider({ children }) {
  const [pendingFilters, setPendingFilters] = useState(loadFilters);
  const [appliedFilters, setAppliedFilters] = useState(loadFilters);
  const [openCategory, setOpenCategory] = useState(null);
  const [gallery, setGallery] = useState(null);

  useEffect(() => {
    localStorage.setItem('navFilters', JSON.stringify(appliedFilters));
  }, [appliedFilters]);

  const toggleValue = (category, value) => {
    setPendingFilters((prev) => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const applyFilters = () => {
    setAppliedFilters(pendingFilters);
    setOpenCategory(null);
  };

  const resetFilters = () => {
    setPendingFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    localStorage.removeItem('navFilters');
  };

  const fetchUnsplashImages = async (query) => {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.warn('VITE_UNSPLASH_ACCESS_KEY is not set; skipping Unsplash fetch.');
      return;
    }
    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&client_id=${accessKey}&per_page=6`;
      const res = await fetch(url);
      const data = await res.json();
      setGallery({ query, images: data.results ?? [] });
    } catch (err) {
      console.error('Unsplash API Error:', err);
    }
  };

  const closeGallery = () => setGallery(null);

  const value = {
    pendingFilters,
    appliedFilters,
    openCategory,
    setOpenCategory,
    toggleValue,
    applyFilters,
    resetFilters,
    gallery,
    fetchUnsplashImages,
    closeGallery,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within a FilterProvider');
  return ctx;
}
