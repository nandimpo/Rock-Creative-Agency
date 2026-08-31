import { useFilters } from '../context/FilterContext';
import { isFilteredOut } from '../utils/filtering';

export default function ServiceCard({ service, index, onDiscover }) {
  const { appliedFilters } = useFilters();
  const hidden = isFilteredOut(appliedFilters, { services: service.filterServices });

  return (
    <div
      className={`service-item${hidden ? ' filtered-hidden' : ''}`}
      data-filter-services={service.filterServices}
    >
      <div className="service-content">
        <span className="service-number">{service.number}</span>
        <h2 className="service-title">{service.title}</h2>
        <p className="service-description">{service.description}</p>
        <button
          type="button"
          className="discover-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDiscover(index);
          }}
        >
          DISCOVER MORE
        </button>
      </div>
      <div className="service-image-container">
        <img src={service.image} alt={service.title} className="service-image" />
      </div>
    </div>
  );
}
