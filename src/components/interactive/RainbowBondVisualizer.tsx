import React from 'react';

export interface RainbowBondVisualizerProps {
  given: number;
  target: number;
}

export const RainbowBondVisualizer: React.FC<RainbowBondVisualizerProps> = ({ given, target }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1rem',
        marginBottom: '1.25rem',
      }}
    >
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
        Rainbow Number Bond Bridge to <strong style={{ color: '#38bdf8' }}>{target}</strong>
      </div>

      <svg width="280" height="120" viewBox="0 0 280 120">
        <defs>
          <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="75%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Rainbow Arch Path */}
        <path
          d="M 40 100 A 100 80 0 0 1 240 100"
          fill="none"
          stroke="url(#rainbowGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 50 100 A 90 70 0 0 1 230 100"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Left Anchor Cloud & Given Number */}
        <circle cx="40" cy="100" r="22" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2.5" />
        <text x="40" y="106" fill="white" fontSize="16" fontWeight="900" textAnchor="middle">
          {given}
        </text>

        {/* Target Crown in Middle */}
        <rect x="110" y="8" width="60" height="30" rx="15" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        <text x="140" y="28" fill="#38bdf8" fontSize="14" fontWeight="900" textAnchor="middle">
          = {target}
        </text>

        {/* Right Partner Cloud with ? */}
        <circle cx="240" cy="100" r="22" fill="#1e1b4b" stroke="#ec4899" strokeWidth="2.5" />
        <text x="240" y="106" fill="#f59e0b" fontSize="18" fontWeight="900" textAnchor="middle">
          ?
        </text>
      </svg>

      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
        {given} + <strong style={{ color: '#f59e0b' }}>[ ? ]</strong> = {target}
      </div>
    </div>
  );
};
