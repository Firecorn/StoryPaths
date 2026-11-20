// The little "landscape" thumbnail used for NPC avatars and story covers.
export default function Landscape({ className = '', rounded = true }) {
  return (
    <svg
      className={`landscape ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ borderRadius: rounded ? '50%' : 0 }}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe0f5" />
          <stop offset="1" stopColor="#e3f1f7" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#sky)" />
      <g fill="#fff">
        <ellipse cx="40" cy="30" rx="16" ry="8" />
        <ellipse cx="54" cy="25" rx="11" ry="9" />
        <ellipse cx="30" cy="33" rx="9" ry="6" />
      </g>
      <path d="M0 68c20-14 45-16 100-6v38H0z" fill="#a8c845" />
      <path d="M0 80c30-10 60-8 100 0v20H0z" fill="#86a615" />
    </svg>
  );
}

export function UserAvatar({ size = 128 }) {
  return (
    <div className="user-avatar" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="38" r="17" fill="#fff" />
        <path d="M18 92c0-18 14-28 32-28s32 10 32 28z" fill="#fff" />
      </svg>
    </div>
  );
}
