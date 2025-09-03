export default function KPD3Logo({ className = "h-9 w-auto", title = "KP D3" }) {
  return (
    <svg viewBox="0 0 320 80" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id="kpGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1DA1F2" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        {/* Disaster gradient */}
        <linearGradient id="disasterGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0.6" />
        </linearGradient>
        {/* Directory gradient */}
        <linearGradient id="directoryGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        {/* Wave gradient */}
        <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Main Logo Icon - Three interconnected elements representing D3 */}
      <g transform="translate(8,8)">
        {/* Damages - Building/Infrastructure icon */}
        <g transform="translate(0,0)">
          <rect x="0" y="16" width="16" height="16" fill="url(#kpGradient)" rx="2"/>
          <rect x="2" y="18" width="4" height="4" fill="white" opacity="0.8"/>
          <rect x="10" y="18" width="4" height="4" fill="white" opacity="0.8"/>
          <rect x="6" y="26" width="4" height="6" fill="white" opacity="0.6"/>
        </g>
        
        {/* Disasters - Warning/Alert icon */}
        <g transform="translate(20,0)">
          <path d="M8 0L16 16H0L8 0Z" fill="url(#disasterGradient)"/>
          <circle cx="8" cy="12" r="1" fill="white"/>
          <path d="M7 14h2v2h-2z" fill="white"/>
        </g>
        
        {/* Directories - Folder/Data icon */}
        <g transform="translate(40,0)">
          <path d="M0 4h6l2-2h8v2h2v12H0V4z" fill="url(#directoryGradient)"/>
          <rect x="2" y="8" width="12" height="1" fill="white" opacity="0.8"/>
          <rect x="2" y="10" width="8" height="1" fill="white" opacity="0.6"/>
          <rect x="2" y="12" width="10" height="1" fill="white" opacity="0.7"/>
        </g>
      </g>

      {/* Main Text */}
      <text x="80" y="34" fontFamily="Inter, ui-sans-serif" fontWeight="700" fontSize="28">
        <tspan fill="#0f172a">KP D</tspan>
        <tspan fill="url(#kpGradient)" dx="2">3</tspan>
      </text>

      {/* Subtitle with expanded meaning */}
      <text x="80" y="52" fontFamily="Inter, ui-sans-serif" fontWeight="500" fontSize="14" fill="#6B7280">
        <tspan fill="url(#kpGradient)">Damages</tspan>
        <tspan dx="8" fill="#6B7280">•</tspan>
        <tspan dx="8" fill="url(#disasterGradient)">Disasters</tspan>
        <tspan dx="8" fill="#6B7280">•</tspan>
        <tspan dx="8" fill="url(#directoryGradient)">Directories</tspan>
      </text>

      {/* Animated connecting lines between the three elements */}
      <g stroke="url(#kpGradient)" strokeWidth="2" fill="none" opacity="0.6">
        <line x1="32" y1="24" x2="52" y2="24">
          <animate
            attributeName="stroke-dasharray"
            dur="2s"
            repeatCount="indefinite"
            values="0,20;20,0;0,20"
          />
        </line>
        <line x1="52" y1="24" x2="72" y2="24">
          <animate
            attributeName="stroke-dasharray"
            dur="2s"
            repeatCount="indefinite"
            values="20,0;0,20;20,0"
          />
        </line>
      </g>

      {/* Animated waves at the bottom */}
      <g transform="translate(0, 64)">
        <path d="M0 8c40-16 80-16 120 0s80 16 120 0 40-16 40-16v16H0z" fill="url(#waveGradient)" opacity="0.6">
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="
              M0 8c40-16 80-16 120 0s80 16 120 0 40-16 40-16v16H0z;
              M0 8c40 16 80 16 120 0s80-16 120 0 40 16 40 16v-16H0z;
              M0 8c40-16 80-16 120 0s80 16 120 0 40-16 40-16v16H0z"
          />
        </path>
        <path d="M0 8c40 16 80 16 120 0s80-16 120 0 40 16 40 16v-16H0z" fill="url(#waveGradient)" opacity="0.4">
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
              M0 8c40 16 80 16 120 0s80-16 120 0 40 16 40 16v-16H0z;
              M0 8c40-16 80-16 120 0s80 16 120 0 40-16 40-16v16H0z;
              M0 8c40 16 80 16 120 0s80-16 120 0 40 16 40 16v-16H0z"
          />
        </path>
      </g>
    </svg>
  );
} 