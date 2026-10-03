export function DiagonalDivider({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg
        width="150"
        height="360"
        viewBox="0 0 150 360"
        fill="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient
            id="divider-gradient"
            x1="10"
            y1="350"
            x2="140"
            y2="10"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#c84e41" stopOpacity="0" />
            <stop offset="0.45" stopColor="#ee9560" stopOpacity="0.7" />
            <stop offset="0.55" stopColor="#f4d8c2" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f4d8c2" stopOpacity="0" />
          </linearGradient>
          <filter
            id="divider-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <line
          x1="10"
          y1="350"
          x2="140"
          y2="10"
          stroke="url(#divider-gradient)"
          strokeWidth="1.25"
          strokeLinecap="round"
          filter="url(#divider-glow)"
        />
      </svg>
    </div>
  );
}
