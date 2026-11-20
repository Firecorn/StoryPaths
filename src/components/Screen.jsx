import { NavLink, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { BackIcon, BookIcon, HomeIcon, NotesIcon, SwordIcon, XpMushrooms } from './Icons.js';

export function TopBar({ title, subtitle }) {
  const navigate = useNavigate();
  const { points } = useGame();

  return (
    <header className="topbar">
      <div className="topbar__row">
        <button className="topbar__back" onClick={() => navigate(-1)} aria-label="Go back">
          <BackIcon width={28} height={28} />
        </button>
        <h1 className="topbar__title">{title}</h1>
        <div className="topbar__xp" aria-label={`${points} Clarity Points`}>
          <XpMushrooms width={44} height={30} />
          <span>{points} XP</span>
        </div>
      </div>
      {subtitle && <div className="topbar__subtitle">{subtitle}</div>}
    </header>
  );
}

const TABS = [
  { to: '/home', label: 'Home', Icon: HomeIcon },
  { to: '/stories', label: 'Stories', Icon: BookIcon },
  { to: '/notes', label: 'Notes', Icon: NotesIcon },
  { to: '/profile', label: 'Profile', Icon: SwordIcon },
];

export function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Main">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bottomnav__item${isActive ? ' is-active' : ''}`}>
          <Icon width={38} height={38} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

/** Standard in-app screen: top bar + scrolling content + bottom tabs. */
export default function Screen({ title, subtitle, className = '', children }) {
  return (
    <div className="app">
      <TopBar title={title} subtitle={subtitle} />
      <main className={`screen ${className}`}>{children}</main>
      <BottomNav />
    </div>
  );
}
