import React from 'react';

interface FractionVisualizerProps {
  numerator: number;
  denominator: number;
  mode?: 'circle' | 'bar';
}

export const FractionVisualizer: React.FC<FractionVisualizerProps> = ({
  numerator,
  denominator,
  mode = 'circle',
}) => {
  const safeDen = Math.max(1, denominator);
  const safeNum = Math.min(numerator, safeDen);

  if (mode === 'bar') {
    return (
      <div style={{ width: '100%', maxWidth: '380px', margin: '0.5rem auto' }}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {Array.from({ length: safeDen }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i < safeNum ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.05)',
                borderRight: i < safeDen - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: i < safeNum ? 'white' : 'var(--text-muted)',
              }}
            >
              1/{safeDen}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.5rem', fontWeight: 700, color: '#38bdf8' }}>
          {safeNum} / {safeDen} shaded
        </div>
      </div>
    );
  }

  // Circular pizza/pie representation via SVG
  const radius = 60;
  const center = 75;
  const sliceAngle = 360 / safeDen;

  const getSlicePath = (index: number) => {
    const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        {Array.from({ length: safeDen }).map((_, i) => (
          <path
            key={i}
            d={getSlicePath(i)}
            fill={i < safeNum ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}
            stroke="#1e293b"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div style={{ marginTop: '0.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: '#6366f1' }}>
        {safeNum} / {safeDen}
      </div>
    </div>
  );
};
