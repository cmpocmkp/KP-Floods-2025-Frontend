import React from "react";

interface FloodBackgroundProps {
  prefersReducedMotion?: boolean;
}

export default function FloodBackground({ prefersReducedMotion = false }: FloodBackgroundProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none z-0">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 0.3 }} />
            <stop offset="50%" style={{ stopColor: "#1d4ed8", stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: "#1e40af", stopOpacity: 0.7 }} />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#60a5fa", stopOpacity: 0.2 }} />
            <stop offset="50%" style={{ stopColor: "#3b82f6", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "#2563eb", stopOpacity: 0.6 }} />
          </linearGradient>
        </defs>
        
        {/* First wave layer */}
        <path
          fill="url(#waveGradient)"
          d="M0,40 C120,20 240,60 360,40 C480,20 600,60 720,40 C840,20 960,60 1080,40 C1140,30 1170,35 1200,40 L1200,120 L0,120 Z"
        >
          {!prefersReducedMotion && (
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="M0,40 C120,20 240,60 360,40 C480,20 600,60 720,40 C840,20 960,60 1080,40 C1140,30 1170,35 1200,40 L1200,120 L0,120 Z;
                      M0,50 C120,70 240,30 360,50 C480,70 600,30 720,50 C840,70 960,30 1080,50 C1140,40 1170,45 1200,50 L1200,120 L0,120 Z;
                      M0,40 C120,20 240,60 360,40 C480,20 600,60 720,40 C840,20 960,60 1080,40 C1140,30 1170,35 1200,40 L1200,120 L0,120 Z"
            />
          )}
        </path>
        
        {/* Second wave layer */}
        <path
          fill="url(#waveGradient2)"
          d="M0,60 C150,40 300,80 450,60 C600,40 750,80 900,60 C1050,40 1150,70 1200,60 L1200,120 L0,120 Z"
        >
          {!prefersReducedMotion && (
            <animate
              attributeName="d"
              dur="6s"
              repeatCount="indefinite"
              values="M0,60 C150,40 300,80 450,60 C600,40 750,80 900,60 C1050,40 1150,70 1200,60 L1200,120 L0,120 Z;
                      M0,70 C150,90 300,50 450,70 C600,90 750,50 900,70 C1050,90 1150,60 1200,70 L1200,120 L0,120 Z;
                      M0,60 C150,40 300,80 450,60 C600,40 750,80 900,60 C1050,40 1150,70 1200,60 L1200,120 L0,120 Z"
            />
          )}
        </path>
        
        {/* Third wave layer */}
        <path
          fill="url(#waveGradient)"
          opacity="0.5"
          d="M0,80 C100,60 200,100 300,80 C400,60 500,100 600,80 C700,60 800,100 900,80 C1000,60 1100,90 1200,80 L1200,120 L0,120 Z"
        >
          {!prefersReducedMotion && (
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="M0,80 C100,60 200,100 300,80 C400,60 500,100 600,80 C700,60 800,100 900,80 C1000,60 1100,90 1200,80 L1200,120 L0,120 Z;
                      M0,90 C100,110 200,70 300,90 C400,110 500,70 600,90 C700,110 800,70 900,90 C1000,110 1100,80 1200,90 L1200,120 L0,120 Z;
                      M0,80 C100,60 200,100 300,80 C400,60 500,100 600,80 C700,60 800,100 900,80 C1000,60 1100,90 1200,80 L1200,120 L0,120 Z"
            />
          )}
        </path>
      </svg>
    </div>
  );
}
