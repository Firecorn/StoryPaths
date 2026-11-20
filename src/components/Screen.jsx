import { NavLink, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { BackIcon } from './Icons.jsx';

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
          <img src="/assets/xp.png" alt="" width={43} />
          <span> {points} XP </span>
        </div>
      </div>
      {subtitle && <div className="topbar__subtitle">{subtitle}</div>}
    </header>
  );
}

const TABS = [
  { to: '/home', label: 'Home', icon: 'home' },
  { to: '/stories', label: 'Stories', icon: 'stories' },
  { to: '/notes', label: 'Notes', icon: 'notes' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
];

export function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Main">

      {TABS.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bottomnav__item${isActive ? ' is-active' : ''}`}>
          {({ isActive }) => (
            <>
              <img src={`/assets/nav-${icon}${isActive ? '-active' : ''}.png`} alt="" width={38} height={38} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Screen({ title, subtitle, className = '', hideNav = false, children }) {
  return (
    <div className={`app${hideNav ? ' app--nonav' : ''}`}>
      <TopBar title={title} subtitle={subtitle} />
      <main className={`screen ${className}`}>{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
