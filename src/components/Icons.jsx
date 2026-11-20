// Inline SVG icons. They inherit colour via `currentColor`.
// Swap any of these for your exported Canva artwork if you want the exact doodle style.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const BackIcon = (p) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="M15 4 7 12l8 8" />
  </svg>
);

export const ChevronRight = (p) => (
  <svg {...base} strokeWidth={2} {...p}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const XpMushrooms = (p) => (
  <svg viewBox="0 0 52 34" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M3 17C3 8 11 2 20 2s16 6 16 15c0 1-1 2-2 2H5c-1 0-2-1-2-2Z" />
    <path d="M14 19c0 5-1 9-2 12h16c-1-3-2-7-2-12" />
    <circle cx="14" cy="10" r="2" />
    <circle cx="25" cy="8" r="1.5" />
    <path d="M37 22c3-5 9-6 13-3 1 1 0 3-1 3h-6" />
    <path d="M42 22c0 3 0 5-1 8" />
  </svg>
);

export const HomeIcon = (p) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z" />
  </svg>
);

export const BookIcon = (p) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M8 3v18" stroke="var(--nav)" />
  </svg>
);

export const NotesIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M2 5c3-1 6-1 10 1 4-2 7-2 10-1v14c-3-1-6-1-10 1-4-2-7-2-10-1Z" />
    <path d="M12 6v14M5 9c1.5-.3 3-.2 4.5.4M5 13c1.5-.3 3-.2 4.5.4" />
  </svg>
);

export const SwordIcon = (p) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="m20 3 1 1-.8 6-8.2 8.2-3.2-3.2L17 5z" />
    <path d="m9 15-5 5M6 12.5l5.5 5.5M4 20l2-2" fill="none" />
  </svg>
);

export const SearchIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const FilterIcon = (p) => (
  <svg {...base} strokeWidth={1.4} {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
    <circle cx="16" cy="6" r="2" fill="var(--cream-soft)" />
    <circle cx="8" cy="12" r="2" fill="var(--cream-soft)" />
    <circle cx="14" cy="18" r="2" fill="var(--cream-soft)" />
  </svg>
);

export const SendIcon = (p) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M21 3 3 10.5l7 3 3 7z" />
    <path d="m21 3-11 10.5" />
  </svg>
);

export const ArrowCircleLeft = (p) => (
  <svg {...base} strokeWidth={1.4} {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M13.5 8.5 10 12l3.5 3.5M10 12h5" />
  </svg>
);

export const ArrowCircleRight = (p) => (
  <svg {...base} strokeWidth={1.4} {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M10.5 8.5 14 12l-3.5 3.5M14 12H9" />
  </svg>
);

/* Filled glyphs used inside the settings-list circles */
export const PersonIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7z" />
  </svg>
);
export const QuestionIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M9 9a3 3 0 1 1 4.6 2.5c-1 .7-1.6 1.2-1.6 2.5h-2c0-2 1-2.9 2.1-3.7A1.2 1.2 0 0 0 12 8a1 1 0 0 0-1 1zM11 16h2v2h-2z" />
  </svg>
);
export const BugIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <ellipse cx="12" cy="14" rx="5" ry="6.5" />
    <circle cx="12" cy="6" r="2.5" />
    <path d="M3 10l4 2M21 10l-4 2M3 17h4M21 17h-4M5 22l3-3M19 22l-3-3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);
export const AlertIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M11 7h2v6h-2zM11 15h2v2h-2z" fill="var(--butter)" />
  </svg>
);
export const LockIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <rect x="5" y="10" width="14" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);
export const StarIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);
export const ShareIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <circle cx="6" cy="12" r="2.8" />
    <circle cx="18" cy="6" r="2.8" />
    <circle cx="18" cy="18" r="2.8" />
    <path d="m8 11 8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
export const LogoutIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M4 3h9v4h-2V5H6v14h5v-2h2v4H4z" />
    <path d="M14 8l4 4-4 4v-3H9v-2h5z" />
  </svg>
);
export const TrashIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M9 3h6l1 2h4v2H4V5h4zM6 9h12l-1 12H7z" />
    <path d="M10 11v8M14 11v8" stroke="var(--butter)" strokeWidth="1.4" />
  </svg>
);
