import { useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { isFilteredOut } from '../utils/filtering';

export default function TeamCard({ member }) {
  const { appliedFilters } = useFilters();
  const hidden = isFilteredOut(appliedFilters, { team: member.filterTeam, services: member.filterServices });
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`team-member${hidden ? ' filtered-hidden' : ''}`}
      data-filter-team={member.filterTeam}
      data-filter-services={member.filterServices}
    >
      <div
        className={`team-card${member.special ? ' special-card' : ''}${flipped ? ' flipped' : ''}`}
        onClick={() => setFlipped((current) => !current)}
      >
        <div className="team-card-flip">
          <div className="team-card-face team-card-front">
            <p className="team-card-name">{member.name}</p>
            <p className="team-card-role">{member.role}</p>
            <p className="team-card-quote">&ldquo;{member.quote}&rdquo;</p>
          </div>
          <div className="team-card-face team-card-back">
            <img src={member.image} alt={member.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
