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

export const PersonIcon = (p) => (
  <image src="/assets/profile.png" width="24" height="24" {...p} />
);
export const QuestionIcon = (p) => (
  <img src="/assets/question.png" width="24" height="24" alt="" {...p} />
);
export const BugIcon = (p) => (
  <img src="/assets/bug.png" width="24" height="24" alt="" {...p} />
);
export const AlertIcon = (p) => (
  <img src="/assets/alert.png" width="24" height="24" alt="" {...p} />
);
export const LockIcon = (p) => (
  <img src="/assets/lock.png" width="24" height="24" alt="" {...p} />
);
export const StarIcon = (p) => (
  <img src="/assets/star.png" width="24" height="24" alt="" {...p} />
);
export const ShareIcon = (p) => (
  <img src="/assets/share.png" width="24" height="24" alt="" {...p} />
);
export const LogoutIcon = (p) => (
  <img src="/assets/logout.png" width="24" height="24" alt="" {...p} />
);
export const TrashIcon = (p) => (
  <img src="/assets/trash.png" width="24" height="24" alt="" {...p} />
);


