import { Link } from 'react-router-dom';

/** "‹ Back" link at the top of the auth screens. */
export function BackLink({ to = '/', tone = 'light' }) {
  return (
    <Link to={to} className={`backlink backlink--${tone}`}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M14 5 6 12l8 7zM20 5l-8 7 8 7z" opacity=".75" />
      </svg>
      <span>Back</span>
    </Link>
  );
}

/** Two scalloped clouds pinned to the bottom of the auth screens. */
export function Clouds({ color = 'var(--red)' }) {
  return (
    <svg className="clouds" viewBox="0 0 414 90" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill={color}>
        <circle cx="80" cy="128" r="82" />
        <circle cx="10" cy="140" r="50" />
        <circle cx="350" cy="130" r="72" />
        <circle cx="415" cy="120" r="55" />
      </g>
    </svg>
  );
}
