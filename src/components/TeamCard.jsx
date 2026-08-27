import { useFilters } from '../context/FilterContext';
import { isFilteredOut } from '../utils/filtering';

export default function TeamCard({ member }) {
  const { appliedFilters } = useFilters();
  const hidden = isFilteredOut(appliedFilters, { team: member.filterTeam, services: member.filterServices });

  return (
    <div
      className={`team-member${hidden ? ' filtered-hidden' : ''}`}
      data-filter-team={member.filterTeam}
      data-filter-services={member.filterServices}
    >
      <div className={`team-card${member.special ? ' special-card' : ''}`}>
        <img src={member.image} alt={member.name} />
      </div>
      <h3>{member.name}</h3>
      <p className="role">{member.role}</p>
      <p className="bio" dangerouslySetInnerHTML={{ __html: member.bio }} />
    </div>
  );
}
