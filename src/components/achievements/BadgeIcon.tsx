import React from 'react';
import { BadgeId } from '../../types/achievement';

interface BadgeIconProps {
  badgeId: BadgeId;
  size?: number;
  glow?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ badgeId, size = 80, glow = false }) => {
  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
    border: '2px solid rgba(255, 255, 255, 0.15)',
    boxShadow: glow
      ? badgeId === 'calculation_champion'
        ? '0 0 25px rgba(245, 158, 11, 0.4), inset 0 0 15px rgba(245, 158, 11, 0.2)'
        : badgeId === 'master_mind'
        ? '0 0 25px rgba(56, 189, 248, 0.4), inset 0 0 15px rgba(56, 189, 248, 0.2)'
        : '0 0 25px rgba(168, 85, 247, 0.4), inset 0 0 15px rgba(168, 85, 247, 0.2)'
      : '0 4px 12px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  };

  if (badgeId === 'calculation_champion') {
    // 1. Calculation Champion: Golden medal with embossed red star and ribbons
    return (
      <div style={containerStyle}>
        <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <filter id="medalShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Ribbons */}
          <path d="M36 60 L24 88 L38 84 L46 72 Z" fill="url(#ribbonGrad)" />
          <path d="M64 60 L76 88 L62 84 L54 72 Z" fill="url(#ribbonGrad)" />

          {/* Outer Medal Rim */}
          <circle cx="50" cy="45" r="32" fill="url(#goldGrad)" filter="url(#medalShadow)" />
          <circle cx="50" cy="45" r="28" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" />
          <circle cx="50" cy="45" r="24" fill="url(#goldGrad)" />

          {/* Inner Golden Ring */}
          <circle cx="50" cy="45" r="18" fill="#d97706" />

          {/* Red Center with Star */}
          <circle cx="50" cy="45" r="14" fill="#dc2626" />
          <polygon
            points="50,35 53.5,42 61,43 55.5,48 57,55 50,51.5 43,55 44.5,48 39,43 46.5,42"
            fill="#fef08a"
          />
        </svg>
      </div>
    );
  }

  if (badgeId === 'master_mind') {
    // 2. Master Mind: Crowned sapphire glowing brain emblem with diamond wings
    return (
      <div style={containerStyle}>
        <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="azureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Ornate Winged Crest Behind */}
          <path d="M15 45 C15 30, 30 25, 50 35 C70 25, 85 30, 85 45 C85 65, 50 82, 50 82 C50 82, 15 65, 15 45 Z" fill="rgba(2, 132, 199, 0.2)" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Crown on top */}
          <path d="M35 28 L42 34 L50 24 L58 34 L65 28 L62 38 L38 38 Z" fill="url(#crownGrad)" stroke="#b45309" strokeWidth="1" />
          <circle cx="35" cy="28" r="2" fill="#38bdf8" />
          <circle cx="50" cy="24" r="2.5" fill="#38bdf8" />
          <circle cx="65" cy="28" r="2" fill="#38bdf8" />

          {/* Brain / Mind Emblem */}
          <rect x="32" y="38" width="36" height="32" rx="16" fill="url(#azureGrad)" stroke="#7dd3fc" strokeWidth="1.5" />
          {/* Brain gyri folds / circuitry */}
          <path d="M42 44 C42 48, 46 50, 46 54 C46 58, 42 60, 44 64" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M58 44 C58 48, 54 50, 54 54 C54 58, 58 60, 56 64" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M50 42 L50 66" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="2 2" />

          {/* Sapphire Diamond Pendant */}
          <polygon points="50,72 58,80 50,88 42,80" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 3. Math Legend: Winged gold star inside royal purple shield
  return (
    <div style={containerStyle}>
      <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
          <linearGradient id="legendStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Legend Angel Wings on Left and Right */}
        <path d="M12 45 C15 32, 28 35, 34 46 C25 48, 16 58, 20 68 C15 62, 10 52, 12 45 Z" fill="url(#wingGrad)" />
        <path d="M88 45 C85 32, 72 35, 66 46 C75 48, 84 58, 80 68 C85 62, 90 52, 88 45 Z" fill="url(#wingGrad)" />

        {/* Hanging Ribbons */}
        <path d="M38 68 L32 86 L42 82 L48 74 Z" fill="#9333ea" />
        <path d="M62 68 L68 86 L58 82 L52 74 Z" fill="#9333ea" />

        {/* Royal Hexagon Shield */}
        <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" fill="url(#purpleGrad)" stroke="#fef08a" strokeWidth="2" />
        <polygon points="50,27 69,38 69,61 50,73 31,61 31,38" fill="#581c87" />

        {/* Golden Star in Center */}
        <polygon
          points="50,36 54.5,46 65,47.5 57,54 59.5,64 50,59 40.5,64 43,54 35,47.5 45.5,46"
          fill="url(#legendStarGrad)"
          stroke="#ca8a04"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};
