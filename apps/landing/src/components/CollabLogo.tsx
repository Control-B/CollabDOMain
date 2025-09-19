export default function CollabLogo({
  className = 'w-8 h-8',
  title = 'Dispatchar',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <div className={`flex items-center ${className}`} aria-label={title} title={title}>
      {/* SVG chat bubble with typing dots and a tiny truck motif */}
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        role="img"
      >
        {/* Bubble background */}
        <defs>
          <linearGradient id="bubbleGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          d="M8 10c0-3.314 2.686-6 6-6h20c3.314 0 6 2.686 6 6v12c0 3.314-2.686 6-6 6H20l-8 8v-8h-2c-3.314 0-6-2.686-6-6V10z"
          fill="url(#bubbleGradient)"
          fillOpacity="0.9"
        />

        {/* Typing dots */}
        <circle cx="18" cy="16" r="2.2" fill="#fff" className="animate-pulse" />
        <circle
          cx="24"
          cy="16"
          r="2.2"
          fill="#fff"
          className="animate-pulse"
          style={{ animationDelay: '120ms' }}
        />
        <circle
          cx="30"
          cy="16"
          r="2.2"
          fill="#fff"
          className="animate-pulse"
          style={{ animationDelay: '240ms' }}
        />

        {/* Tiny truck silhouette to suggest trucking + realtime chat */}
        <g transform="translate(14,24)">
          <rect x="0" y="3" width="14" height="6" rx="1" fill="#0ea5e9" />
          <rect x="10" y="1" width="6" height="5" rx="1" fill="#22c55e" />
          <circle cx="4" cy="10.5" r="2.2" fill="#111827" />
          <circle cx="12" cy="10.5" r="2.2" fill="#111827" />
          <rect x="1" y="5" width="8" height="2" fill="#93c5fd" />
        </g>
      </svg>
    </div>
  );
}
