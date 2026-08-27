import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import UnsplashGallery from './components/UnsplashGallery';
import { FilterProvider } from './context/FilterContext';
import Home from './pages/Home';
import About from './pages/About';
import Expertise from './pages/Expertise';
import Work from './pages/Work';
import Services from './pages/Services';
import Contact from './pages/Contact';
import './styles/main.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <FilterProvider>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/expertise" element={<Expertise />} />
        <Route path="/work" element={<Work />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <UnsplashGallery />
      <Footer />
      <Cursor />
    </FilterProvider>
  );
}
