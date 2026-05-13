export function HockeyPlayer({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hockey player skating"
      role="img"
    >
      <g
        stroke="var(--color-neon-ice-400)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      >
        <line x1="-10" y1="80" x2="55" y2="80" />
        <line x1="0" y1="115" x2="60" y2="115" />
        <line x1="-15" y1="150" x2="40" y2="150" />
      </g>

      <line
        x1="150"
        y1="88"
        x2="238"
        y2="168"
        stroke="var(--color-yellow-green-500)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="232"
        y1="172"
        x2="265"
        y2="166"
        stroke="var(--color-yellow-green-600)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      <ellipse
        cx="262"
        cy="178"
        rx="11"
        ry="4"
        fill="var(--color-magenta-bloom-950)"
      />

      <path
        d="M82 72 L142 82 L148 132 L98 132 Z"
        fill="var(--color-magenta-bloom-500)"
        stroke="var(--color-magenta-bloom-900)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text
        x="115"
        y="118"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="900"
        fontSize="30"
        fill="var(--color-yellow-green-300)"
        textAnchor="middle"
      >
        5
      </text>

      <circle
        cx="88"
        cy="50"
        r="26"
        fill="var(--color-icy-blue-100)"
        stroke="var(--color-magenta-bloom-900)"
        strokeWidth="3"
      />
      <path
        d="M66 46 Q88 28 112 48"
        fill="none"
        stroke="var(--color-magenta-bloom-500)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="78"
        y1="62"
        x2="106"
        y2="62"
        stroke="var(--color-magenta-bloom-900)"
        strokeWidth="2.5"
      />

      <path
        d="M128 88 L155 96"
        stroke="var(--color-magenta-bloom-500)"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <circle
        cx="158"
        cy="98"
        r="12"
        fill="var(--color-yellow-green-500)"
        stroke="var(--color-magenta-bloom-900)"
        strokeWidth="2.5"
      />

      <path
        d="M108 132 L78 175"
        stroke="var(--color-icy-blue-950)"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M138 132 L158 175"
        stroke="var(--color-icy-blue-950)"
        strokeWidth="15"
        strokeLinecap="round"
      />

      <ellipse
        cx="76"
        cy="182"
        rx="20"
        ry="4.5"
        fill="var(--color-neon-ice-100)"
        stroke="var(--color-magenta-bloom-900)"
        strokeWidth="2"
      />
      <ellipse
        cx="160"
        cy="182"
        rx="20"
        ry="4.5"
        fill="var(--color-neon-ice-100)"
        stroke="var(--color-magenta-bloom-900)"
        strokeWidth="2"
      />
    </svg>
  );
}
