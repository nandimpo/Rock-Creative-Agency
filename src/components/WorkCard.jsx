import { useFilters } from '../context/FilterContext';
import { isFilteredOut } from '../utils/filtering';

export default function WorkCard({ project, isOpen, onToggle, onClose }) {
  const { appliedFilters } = useFilters();
  const hidden = isFilteredOut(appliedFilters, {
    projects: project.filterProjects,
    services: project.filterServices,
  });

  return (
    <div
      className={`portfolio-card${hidden ? ' filtered-hidden' : ''}`}
      data-filter-projects={project.filterProjects}
      data-filter-services={project.filterServices}
    >
      <img src={project.image} alt={project.title} className="card-image" />
      <div className="card-content">
        <h2>{project.title}</h2>
        <p>{project.subtitle}</p>
        <button type="button" className="see-more-btn" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          See More →
        </button>
      </div>
      <div className={`card-details${isOpen ? '' : ' hidden'}`}>
        <div className="details-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          ×
        </div>
        <h3>{project.title}</h3>
        <p className="details-category">{project.detailsCategory}</p>
        <p className="details-description">{project.detailsDescription}</p>
        <div className="details-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
