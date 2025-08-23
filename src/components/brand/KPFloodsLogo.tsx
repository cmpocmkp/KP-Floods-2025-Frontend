export default function KPFloodsLogo({ className = "h-9 w-auto", title = "KP Floods 2025" }) {
  return (
    <svg viewBox="0 0 280 64" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id="kpGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1DA1F2" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        {/* Wave gradient */}
        <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Droplet */}
      <g transform="translate(6,12)">
        <path d="M18 0c5 8 14 14 14 24a14 14 0 1 1-28 0C4 14 13 8 18 0z" fill="url(#kpGradient)"/>
        <path d="M6 24c3 4 9 6 12 6s9-2 12-6" fill="none" stroke="white" strokeOpacity=".8" strokeWidth="2" />
        <path d="M8 28c3 3 8 4 10 4s7-1 10-4" fill="none" stroke="white" strokeOpacity=".5" strokeWidth="2" />
      </g>

      {/* Text in one line */}
      <text x="56" y="34" fontFamily="Inter, ui-sans-serif" fontWeight="700" fontSize="24">
        <tspan fill="#0f172a">KP Floods</tspan>
        <tspan fill="url(#kpGradient)" dx="8">2025</tspan>
      </text>

      {/* Waves */}
      <g transform="translate(0, 44)">
        <path d="M0 8c40-16 80-16 120 0s80 16 120 0 40-16 40-16v24H0z" fill="url(#waveGradient)" opacity="0.6">
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="
              M0 8c40-16 80-16 120 0s80 16 120 0 40-16 40-16v24H0z;
              M0 8c40 16 80 16 120 0s80-16 120 0 40 16 40 16v-24H0z;
              M0 8c40-16 80-16 120 0s80 16 120 0 40-16 40-16v24H0z"
          />
        </path>
        <path d="M0 8c40 16 80 16 120 0s80-16 120 0 40 16 40 16v-24H0z" fill="url(#waveGradient)" opacity="0.4">
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
              M0 8c40 16 80 16 120 0s80-16 120 0 40 16 40 16v-24H0z;
              M0 8c40-16 80-16 120 0s80 16 120 0 40-16 40-16v24H0z;
              M0 8c40 16 80 16 120 0s80-16 120 0 40 16 40 16v-24H0z"
          />
        </path>
      </g>
    </svg>
  );
}