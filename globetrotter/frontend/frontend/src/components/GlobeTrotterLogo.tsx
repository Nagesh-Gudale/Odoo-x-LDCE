import React from 'react';
import './GlobeTrotterLogo.css';

interface GlobeTrotterLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  variant?: 'light' | 'dark' | 'gradient';
  className?: string;
}

export const GlobeTrotterLogo: React.FC<GlobeTrotterLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  variant = 'gradient',
  className = '',
}) => {
  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const iconSize = pixelSizes[size];

  return (
    <div className={`gt-logo-container size-${size} variant-${variant} ${className}`}>
      {/* Brand SVG Globe + Airplane Orbit Icon */}
      <div className="gt-logo-icon-box" style={{ width: iconSize, height: iconSize }}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="gt-logo-svg"
        >
          <defs>
            {/* Globe Blue Gradient */}
            <linearGradient id="gtGlobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Orbit Arc Coral/Pink Gradient */}
            <linearGradient id="gtOrbitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7A45" />
              <stop offset="50%" stopColor="#FF4F9A" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>

          {/* Ocean Base Circle */}
          <circle cx="50" cy="50" r="40" fill="url(#gtGlobeGrad)" />

          {/* Stylized Continent Outlines */}
          <path
            d="M 22,40 C 26,35 34,36 38,42 C 42,48 36,54 30,56 C 24,58 20,52 22,40 Z"
            fill="#60A5FA"
            opacity="0.45"
          />
          <path
            d="M 52,24 C 62,22 72,28 68,38 C 64,48 56,44 50,34 C 48,30 46,26 52,24 Z"
            fill="#93C5FD"
            opacity="0.5"
          />
          <path
            d="M 55,56 C 64,52 74,58 70,68 C 66,76 56,74 52,66 C 50,62 50,58 55,56 Z"
            fill="#60A5FA"
            opacity="0.4"
          />

          {/* Latitude & Longitude Subtle Grid Lines */}
          <ellipse cx="50" cy="50" rx="38" ry="16" stroke="#ffffff" strokeWidth="1.2" opacity="0.25" fill="none" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#ffffff" strokeWidth="1.2" opacity="0.25" />

          {/* Ascending Orbit Arc */}
          <path
            d="M 12,68 C 18,84 46,92 74,62 C 86,49 88,34 84,24"
            stroke="url(#gtOrbitGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Flying Airplane Accent */}
          <g transform="translate(82, 22) rotate(42)">
            <path
              d="M 0,-12 L 5,4 L 14,8 L 4,9 L 2,16 L -2,16 L -4,9 L -14,8 L -5,4 Z"
              fill="#FF4F9A"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="gt-logo-text-wrapper">
          <div className="gt-brand-title">
            <span className="part-globe">Globe</span>
            <span className="part-trotter">Trotter</span>
          </div>
          {showTagline && (
            <span className="gt-brand-tagline">Your Journey, Perfectly Planned.</span>
          )}
        </div>
      )}
    </div>
  );
};
