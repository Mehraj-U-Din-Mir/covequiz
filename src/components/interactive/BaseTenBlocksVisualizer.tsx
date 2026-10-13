import React from 'react';

export interface BaseTenBlocksVisualizerProps {
  tens: number;
  ones: number;
}

export const BaseTenBlocksVisualizer: React.FC<BaseTenBlocksVisualizerProps> = ({ tens, ones }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.25rem',
      }}
    >
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
        Base-10 Place Value Blocks (Blue = Tens Rods | Yellow = Ones Cubes)
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'clamp(0.75rem, 3.5vw, 2rem)',
          alignItems: 'flex-end',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Tens Rods Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ display: 'flex', gap: 'clamp(4px, 1.5vw, 8px)', alignItems: 'flex-end' }}>
            {Array.from({ length: tens }).map((_, tIdx) => (
              <div
                key={tIdx}
                title="1 Ten Rod = 10 units"
                style={{
                  width: 'clamp(13px, 3.2vw, 18px)',
                  height: 'clamp(80px, 18vw, 110px)',
                  background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                  borderRadius: '3px',
                  border: '1.5px solid #7dd3fc',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 4px 10px rgba(56, 189, 248, 0.25)',
                }}
              >
                {/* 10 unit segments inside the rod */}
                {Array.from({ length: 10 }).map((_, segIdx) => (
                  <div
                    key={segIdx}
                    style={{
                      flex: 1,
                      borderBottom: segIdx < 9 ? '1px solid rgba(0, 0, 0, 0.35)' : 'none',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>
            {tens} Tens ({tens * 10})
          </div>
        </div>

        {/* Separator */}
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)', paddingBottom: '0.8rem' }}>
          +
        </div>

        {/* Ones Units Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 'clamp(4px, 1.5vw, 6px)',
              maxWidth: '120px',
            }}
          >
            {Array.from({ length: ones }).map((_, oIdx) => (
              <div
                key={oIdx}
                title="1 One Unit = 1"
                style={{
                  width: 'clamp(12px, 3vw, 16px)',
                  height: 'clamp(12px, 3vw, 16px)',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                  borderRadius: '2px',
                  border: '1.5px solid #fde68a',
                  boxShadow: '0 2px 6px rgba(251, 191, 36, 0.3)',
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fbbf24' }}>
            {ones} Ones ({ones})
          </div>
        </div>
      </div>
    </div>
  );
};
