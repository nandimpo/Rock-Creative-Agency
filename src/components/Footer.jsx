import { NavLink } from 'react-router-dom';
import { navLinks } from '../data/navLinks';

export default function Footer() {
  return (
    <footer>
      <div>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
          Linkedin
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
      <nav>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <p>rockcreativeagency.co.za - 2025 rock agency. all rights reserved.</p>
    </footer>
  );
}
