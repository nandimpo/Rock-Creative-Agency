import { useFilters } from '../context/FilterContext';

export default function UnsplashGallery() {
  const { gallery, closeGallery } = useFilters();
  if (!gallery) return null;

  return (
    <section className="unsplash-gallery" style={{ opacity: 1 }}>
      <div className="unsplash-header">
        <h2 className="unsplash-heading">{gallery.query.toUpperCase()} INSPIRATION</h2>
      </div>
      <div className="unsplash-images">
        {gallery.images.map((img) => (
          <img key={img.id} src={img.urls.regular} alt={img.alt_description || 'Creative inspiration'} />
        ))}
      </div>
      <button type="button" className="unsplash-close-btn" onClick={closeGallery}>
        Close Inspiration
      </button>
    </section>
  );
}
